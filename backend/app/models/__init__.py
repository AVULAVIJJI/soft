# Import all models so SQLAlchemy registers them for create_all()
from app.models.user import User, UserProfile, UserSession, UserRole
from app.models.blog import BlogPost, BlogStatus
from app.models.cms import SiteSetting, Testimonial, ClientCompany, ServiceItem, FAQItem
from app.models.client import (
    Project, SupportTicket, TicketReply, ProjectDocument,
    Invoice, Payment, Notification
)
from app.models.erp import (
    Employee, Attendance, Leave, PayrollRecord,
    Task, Expense, AttendanceStatus, LeaveStatus, LeaveType
)
from app.models.academy import (
    Course, Lesson, Enrollment, StudentProgress, Certificate,
    Assignment, AssignmentSubmission, Quiz, QuizQuestion,
    CourseLevel, CourseStatus
)
from app.models.jobs import (
    Job, JobApplication, Resume, Interview,
    JobType, ApplicationStatus
)
