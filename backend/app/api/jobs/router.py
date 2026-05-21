from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.jobs import Job, JobApplication, Resume, Interview

router = APIRouter()


@router.get("/")
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    job_type: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.is_active == True)
    if category:
        query = query.filter(Job.category == category)
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if search:
        query = query.filter(
            Job.title.ilike(f"%{search}%") | Job.company_name.ilike(f"%{search}%")
        )
    total = query.count()
    jobs = query.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "jobs": [
            {"id": j.id, "title": j.title, "company": j.company_name,
             "location": j.location, "job_type": str(j.job_type).replace("JobType.", "") if j.job_type else None,
             "salary_min": j.salary_min, "salary_max": j.salary_max,
             "is_remote": j.is_remote,
             "skills_required": j.skills_required,
             "applications_count": db.query(JobApplication).filter(JobApplication.job_id == j.id).count(),
             "created_at": str(j.created_at)}
            for j in jobs
        ],
        "total": total, "page": skip // limit + 1, "limit": limit
    }


@router.get("/{job_id}")
async def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "id": job.id, "title": job.title, "company": job.company_name,
        "description": job.description, "requirements": job.requirements,
        "responsibilities": job.responsibilities,
        "location": job.location,
        "job_type": str(job.job_type).replace("JobType.", "") if job.job_type else None,
        "salary_min": job.salary_min, "salary_max": job.salary_max,
        "is_remote": job.is_remote,
        "skills_required": job.skills_required,
        "experience_min": job.experience_min,
        "status": job.status, "created_at": str(job.created_at)
    }


@router.post("/")
async def create_job(
    job_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin", "hr", "recruiter"]:
        raise HTTPException(status_code=403, detail="Not authorized to post jobs")
    job = Job(
        title=job_data["title"],
        company_name=job_data.get("company", "Softmaster Technology Solutions"),
        description=job_data["description"],
        job_type=job_data.get("job_type", "full_time"),
        location=job_data.get("location"),
        is_remote=job_data.get("is_remote", False),
        salary_min=job_data.get("salary_min"),
        salary_max=job_data.get("salary_max"),
        experience_min=job_data.get("experience_min", 0),
        skills_required=job_data.get("skills_required", ""),
        category=job_data.get("category"),
        posted_by=current_user.id,
        status="open"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"message": "Job posted successfully", "job_id": job.id}


@router.post("/{job_id}/apply")
async def apply_for_job(
    job_id: int,
    application_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or closed")
    existing = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.applicant_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    application = JobApplication(
        job_id=job_id,
        applicant_id=current_user.id,
        cover_letter=application_data.get("cover_letter"),
        resume_id=application_data.get("resume_id"),
        status="applied"
    )
    db.add(application)
    db.commit()
    return {"message": "Application submitted", "application_id": application.id}


@router.get("/{job_id}/applications")
async def get_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin", "hr", "recruiter"]:
        raise HTTPException(status_code=403, detail="Access denied")
    applications = db.query(JobApplication).filter(JobApplication.job_id == job_id).all()
    return {
        "applications": [
            {"id": a.id, "applicant_id": a.applicant_id,
             "status": str(a.status).replace("ApplicationStatus.", ""),
             "applied_at": str(a.applied_at)}
            for a in applications
        ],
        "total": len(applications)
    }


@router.get("/applications/my")
async def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    apps = db.query(JobApplication).filter(JobApplication.applicant_id == current_user.id).all()
    result = []
    for a in apps:
        job = db.query(Job).filter(Job.id == a.job_id).first()
        result.append({
            "id": a.id, "job_id": a.job_id,
            "job_title": job.title if job else None,
            "company": job.company_name if job else None,
            "status": str(a.status).replace("ApplicationStatus.", ""),
            "applied_at": str(a.applied_at)
        })
    return {"applications": result, "total": len(result)}


@router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin", "hr", "recruiter"]:
        raise HTTPException(status_code=403, detail="Access denied")
    app = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = update_data.get("status", app.status)
    db.commit()
    return {"message": "Status updated"}


@router.get("/resumes/my")
async def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return {
        "resumes": [
            {"id": r.id, "title": r.title, "is_default": r.is_default,
             "resume_url": r.resume_url, "created_at": str(r.created_at)}
            for r in resumes
        ]
    }
