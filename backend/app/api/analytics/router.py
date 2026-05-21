from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from datetime import datetime, date, timedelta

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user import User as UserModel
    from app.models.academy import Course, Enrollment, Certificate
    from app.models.jobs import Job, JobApplication
    from app.models.erp import PayrollRecord

    total_users = db.query(UserModel).count()
    total_students = db.query(UserModel).filter(UserModel.role == "student").count()
    total_courses = db.query(Course).filter(Course.status == "published").count()
    total_jobs = db.query(Job).filter(Job.is_active == True).count()
    total_enrollments = db.query(Enrollment).count()
    total_certs = db.query(Certificate).count() if hasattr(Certificate, '__tablename__') else 0

    this_month = date.today().replace(day=1)

    revenue_trend = []
    for i in range(6):
        month_start = (this_month - timedelta(days=30 * i)).replace(day=1)
        month_label = month_start.strftime("%b %Y")
        revenue_trend.append({
            "month": month_label,
            "revenue": 0.0,
            "expenses": 0.0,
            "profit": 0.0
        })

    return {
        "summary": {
            "total_users": total_users,
            "total_students": total_students,
            "total_courses": total_courses,
            "total_jobs": total_jobs,
            "total_enrollments": total_enrollments,
            "total_certificates": total_certs,
            "active_projects": 0,
            "placements_this_month": 0
        },
        "revenue_trend": list(reversed(revenue_trend)),
        "recent_activities": []
    }


@router.get("/users")
async def get_user_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user import User as UserModel
    role_counts = {}
    for role in ["student", "employee", "client", "trainer", "recruiter", "admin"]:
        role_counts[role] = db.query(UserModel).filter(UserModel.role == role).count()
    total = db.query(UserModel).count()
    active = db.query(UserModel).filter(UserModel.is_active == True).count()
    return {
        "total_users": total,
        "active_users": active,
        "inactive_users": total - active,
        "by_role": role_counts
    }


@router.get("/courses")
async def get_course_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.academy import Course, Enrollment
    total = db.query(Course).count()
    published = db.query(Course).filter(Course.status == "published").count()
    total_enrollments = db.query(Enrollment).count()
    return {
        "total_courses": total,
        "published_courses": published,
        "draft_courses": total - published,
        "total_enrollments": total_enrollments
    }


@router.get("/jobs")
async def get_job_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.jobs import Job, JobApplication
    total = db.query(Job).count()
    open_jobs = db.query(Job).filter(Job.is_active == True).count()
    total_apps = db.query(JobApplication).count()
    hired = db.query(JobApplication).filter(JobApplication.status == "hired").count()
    return {
        "total_jobs": total,
        "open_jobs": open_jobs,
        "closed_jobs": total - open_jobs,
        "total_applications": total_apps,
        "hired_count": hired
    }
