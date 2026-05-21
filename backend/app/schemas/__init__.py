from app.schemas.user import (
    UserCreate, UserUpdate, UserResponse, UserListResponse,
    ChangePasswordRequest, UserProfileUpdate, UserRoleEnum
)
from app.schemas.auth import (
    LoginRequest, TokenResponse, RefreshTokenRequest,
    RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest,
    AuthResponse
)
from app.schemas.academy import (
    CourseCreate, CourseUpdate, CourseResponse, CourseListResponse,
    LessonCreate, LessonResponse, EnrollmentResponse, EnrollmentListResponse,
    QuizCreate, QuizResponse, QuizSubmission, QuizResult,
    AssignmentCreate, AssignmentResponse, CertificateResponse
)
from app.schemas.jobs import (
    JobCreate, JobUpdate, JobResponse, JobListResponse,
    ApplicationCreate, ApplicationResponse, ApplicationListResponse,
    ApplicationStatusUpdate, ResumeCreate, ResumeResponse,
    InterviewCreate, InterviewResponse
)
from app.schemas.workspace import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse,
    TicketCreate, TicketResponse, InvoiceCreate, InvoiceResponse,
    AttendanceCreate, AttendanceResponse, AttendanceListResponse,
    LeaveCreate, LeaveUpdate, LeaveResponse,
    PayrollCreate, PayrollResponse, PayrollListResponse,
    TaskCreate, TaskUpdate, TaskResponse,
    AnalyticsSummary, DashboardStats
)
