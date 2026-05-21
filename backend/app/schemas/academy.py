from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CourseLevelEnum(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class CourseStatusEnum(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class CourseBase(BaseModel):
    title: str
    description: str
    short_description: Optional[str] = None
    level: CourseLevelEnum = CourseLevelEnum.beginner
    price: float = 0.0
    duration_hours: Optional[int] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    language: str = "English"


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    level: Optional[CourseLevelEnum] = None
    price: Optional[float] = None
    duration_hours: Optional[int] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    status: Optional[CourseStatusEnum] = None


class CourseResponse(CourseBase):
    id: int
    status: CourseStatusEnum
    instructor_id: int
    instructor_name: Optional[str] = None
    enrolled_count: int = 0
    rating: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class CourseListResponse(BaseModel):
    courses: List[CourseResponse]
    total: int
    page: int
    limit: int


class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    order_index: int = 0
    is_free: bool = False


class LessonCreate(LessonBase):
    course_id: int


class LessonResponse(LessonBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    course_title: Optional[str] = None
    progress_percent: float = 0.0
    status: str
    enrolled_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EnrollmentListResponse(BaseModel):
    enrollments: List[EnrollmentResponse]
    total: int


class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    time_limit_minutes: Optional[int] = None
    pass_percentage: float = 60.0
    questions: Optional[List[dict]] = None


class QuizCreate(QuizBase):
    lesson_id: int


class QuizResponse(QuizBase):
    id: int
    lesson_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class QuizSubmission(BaseModel):
    quiz_id: int
    answers: List[dict]


class QuizResult(BaseModel):
    quiz_id: int
    score: float
    passed: bool
    correct_count: int
    total_questions: int
    time_taken_seconds: Optional[int] = None


class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: Optional[datetime] = None
    max_score: float = 100.0
    submission_type: str = "text"


class AssignmentCreate(AssignmentBase):
    course_id: int


class AssignmentResponse(AssignmentBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CertificateResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    course_title: Optional[str] = None
    student_name: Optional[str] = None
    certificate_number: str
    issued_at: datetime
    certificate_url: Optional[str] = None

    class Config:
        from_attributes = True
