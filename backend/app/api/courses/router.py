from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.academy import Course, Lesson, Enrollment, StudentProgress, Certificate

router = APIRouter()


@router.get("/")
async def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course).filter(Course.status == "published")
    if category:
        query = query.filter(Course.category == category)
    if level:
        query = query.filter(Course.level == level)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    total = query.count()
    courses = query.offset(skip).limit(limit).all()
    return {
        "courses": [
            {"id": c.id, "title": c.title, "description": c.description,
             "level": c.level, "price": c.price, "category": c.category,
             "thumbnail_url": getattr(c, "thumbnail_url", None),
             "rating": getattr(c, "rating", 0.0),
             "enrolled_count": db.query(Enrollment).filter(Enrollment.course_id == c.id).count()}
            for c in courses
        ],
        "total": total, "page": skip // limit + 1, "limit": limit
    }


@router.get("/my-courses")
async def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    result = []
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if course:
            result.append({
                "enrollment_id": e.id,
                "course_id": course.id,
                "course_title": course.title,
                "progress_percent": getattr(e, "progress_percent", 0.0),
                "status": getattr(e, "status", "active"),
                "enrolled_at": str(e.enrolled_at) if hasattr(e, "enrolled_at") else None
            })
    return {"enrollments": result, "total": len(result)}


@router.get("/{course_id}")
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()
    return {
        "id": course.id, "title": course.title, "description": course.description,
        "level": course.level, "price": course.price, "category": course.category,
        "duration_hours": getattr(course, "duration_hours", None),
        "lessons": [{"id": l.id, "title": l.title, "duration_minutes": getattr(l, "duration_minutes", None),
                     "is_free": getattr(l, "is_free", False), "order_index": l.order_index} for l in lessons],
        "enrolled_count": db.query(Enrollment).filter(Enrollment.course_id == course_id).count()
    }


@router.post("/")
async def create_course(
    course_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin", "trainer"]:
        raise HTTPException(status_code=403, detail="Only trainers and admins can create courses")
    import re, time
    slug = re.sub(r'[^a-z0-9\s-]', '', course_data['title'].lower())
    slug = re.sub(r'\s+', '-', slug) + '-' + str(int(time.time()))
    course = Course(slug=slug,
        title=course_data["title"],
        description=course_data["description"],
        level=course_data.get("level", "beginner"),
        price=course_data.get("price", 0.0),
        category=course_data.get("category"),
        instructor_id=current_user.id,
        status="draft"
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"message": "Course created", "course_id": course.id}


@router.put("/{course_id}")
async def update_course(
    course_id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and str(current_user.role) not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    allowed = ["title", "description", "level", "price", "category", "status", "thumbnail_url"]
    for field in allowed:
        if field in update_data:
            setattr(course, field, update_data[field])
    db.commit()
    return {"message": "Course updated"}


@router.post("/{course_id}/enroll")
async def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    enrollment = Enrollment(student_id=current_user.id, course_id=course_id, status="active")
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}


@router.get("/{course_id}/lessons")
async def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()
    return {
        "lessons": [
            {"id": l.id, "title": l.title, "description": getattr(l, "description", None),
             "duration_minutes": getattr(l, "duration_minutes", None),
             "is_free": getattr(l, "is_free", False),
             "video_url": l.video_url if (enrollment or getattr(l, "is_free", False)) else None,
             "order_index": l.order_index}
            for l in lessons
        ],
        "is_enrolled": enrollment is not None
    }

@router.get("/enrollments/all")
async def all_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.core.security import get_user_role
    if get_user_role(current_user) not in ["super_admin", "admin", "trainer"]:
        raise HTTPException(status_code=403, detail="Access denied")
    enrollments = db.query(Enrollment).all()
    result = []
    for e in enrollments:
        student = db.query(User).filter(User.id == e.student_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        result.append({
            "id": e.id,
            "student_id": e.student_id,
            "student_name": student.full_name if student else "Unknown",
            "student_email": student.email if student else "",
            "course_id": e.course_id,
            "course_title": course.title if course else "Unknown",
            "enrolled_at": str(e.enrolled_at),
            "progress": getattr(e, "progress_percent", 0),
            "status": getattr(e, "status", "active"),
        })
    return {"enrollments": result, "total": len(result)}
