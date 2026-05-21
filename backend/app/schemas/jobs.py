from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class JobTypeEnum(str, Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"
    remote = "remote"


class JobStatusEnum(str, Enum):
    open = "open"
    closed = "closed"
    paused = "paused"


class ApplicationStatusEnum(str, Enum):
    applied = "applied"
    reviewed = "reviewed"
    shortlisted = "shortlisted"
    interview = "interview"
    offered = "offered"
    hired = "hired"
    rejected = "rejected"


class JobBase(BaseModel):
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    job_type: JobTypeEnum = JobTypeEnum.full_time
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_years: Optional[int] = None
    skills_required: Optional[List[str]] = None
    category: Optional[str] = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    job_type: Optional[JobTypeEnum] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    status: Optional[JobStatusEnum] = None
    skills_required: Optional[List[str]] = None


class JobResponse(JobBase):
    id: int
    status: JobStatusEnum
    posted_by: int
    applications_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int
    page: int
    limit: int


class ApplicationBase(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    resume_id: Optional[int] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    job_title: Optional[str] = None
    applicant_id: int
    applicant_name: Optional[str] = None
    status: ApplicationStatusEnum
    cover_letter: Optional[str] = None
    applied_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ApplicationListResponse(BaseModel):
    applications: List[ApplicationResponse]
    total: int


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatusEnum
    notes: Optional[str] = None


class ResumeBase(BaseModel):
    title: str
    summary: Optional[str] = None
    experience: Optional[List[dict]] = None
    education: Optional[List[dict]] = None
    skills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None


class ResumeCreate(ResumeBase):
    pass


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    resume_url: Optional[str] = None
    is_default: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class InterviewBase(BaseModel):
    application_id: int
    scheduled_at: datetime
    duration_minutes: int = 60
    interview_type: str = "online"
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewResponse(InterviewBase):
    id: int
    status: str
    feedback: Optional[str] = None
    score: Optional[float] = None

    class Config:
        from_attributes = True
