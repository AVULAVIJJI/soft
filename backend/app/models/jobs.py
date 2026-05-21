"""
Jobs Portal Models
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class JobType(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"
    remote = "remote"


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    screening = "screening"
    interview = "interview"
    offered = "offered"
    hired = "hired"
    rejected = "rejected"
    withdrawn = "withdrawn"


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255))
    department = Column(String(100))
    location = Column(String(255))
    job_type = Column(Enum(JobType), default=JobType.full_time)
    description = Column(Text)
    requirements = Column(Text)
    responsibilities = Column(Text)
    salary_min = Column(Float)
    salary_max = Column(Float)
    salary_currency = Column(String(10), default="INR")
    experience_min = Column(Integer, default=0)
    experience_max = Column(Integer)
    skills_required = Column(Text)
    category = Column(String(100))
    is_remote = Column(Boolean, default=False)
    posted_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    status = Column(String(50), default="open")  # open, closed, draft
    deadline = Column(DateTime(timezone=True))
    total_applications = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    applications = relationship("JobApplication", back_populates="job")


class JobApplication(Base):
    __tablename__ = "job_applications"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    resume_url = Column(String(500))
    cover_letter = Column(Text)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    notes = Column(Text)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    job = relationship("Job", back_populates="applications")


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    title = Column(String(255))
    resume_url = Column(String(500))
    is_default = Column(Boolean, default=False)
    parsed_data = Column(Text)
    skills = Column(Text)
    experience_years = Column(Integer, default=0)
    education = Column(Text)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id"), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    interview_type = Column(String(50), default="video")
    meeting_link = Column(String(500))
    notes = Column(Text)
    feedback = Column(Text)
    rating = Column(Integer)
    status = Column(String(50), default="scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
