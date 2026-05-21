from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


class ProjectStatusEnum(str, Enum):
    planning = "planning"
    active = "active"
    on_hold = "on_hold"
    completed = "completed"
    cancelled = "cancelled"


class TicketPriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class TicketStatusEnum(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class InvoiceStatusEnum(str, Enum):
    draft = "draft"
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_id: int
    budget: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatusEnum] = None
    progress_percent: Optional[float] = None
    budget: Optional[float] = None
    end_date: Optional[date] = None


class ProjectResponse(ProjectBase):
    id: int
    status: ProjectStatusEnum
    progress_percent: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int


class TicketBase(BaseModel):
    subject: str
    description: str
    priority: TicketPriorityEnum = TicketPriorityEnum.medium
    category: Optional[str] = None
    project_id: Optional[int] = None


class TicketCreate(TicketBase):
    pass


class TicketReplyCreate(BaseModel):
    message: str
    is_internal: bool = False


class TicketResponse(TicketBase):
    id: int
    client_id: int
    status: TicketStatusEnum
    ticket_number: str
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InvoiceBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    amount: float
    tax_amount: float = 0.0
    due_date: Optional[date] = None
    description: Optional[str] = None
    line_items: Optional[List[dict]] = None


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceResponse(InvoiceBase):
    id: int
    invoice_number: str
    status: InvoiceStatusEnum
    total_amount: float
    paid_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeaveStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"


class LeaveTypeEnum(str, Enum):
    annual = "annual"
    sick = "sick"
    casual = "casual"
    maternity = "maternity"
    paternity = "paternity"
    unpaid = "unpaid"


class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: str = "present"
    notes: Optional[str] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    id: int
    total_hours: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceListResponse(BaseModel):
    records: List[AttendanceResponse]
    total: int


class LeaveBase(BaseModel):
    employee_id: int
    leave_type: LeaveTypeEnum
    start_date: date
    end_date: date
    reason: str


class LeaveCreate(LeaveBase):
    pass


class LeaveUpdate(BaseModel):
    status: LeaveStatusEnum
    rejection_reason: Optional[str] = None


class LeaveResponse(LeaveBase):
    id: int
    status: LeaveStatusEnum
    total_days: int
    approved_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PayrollBase(BaseModel):
    employee_id: int
    month: int
    year: int
    basic_salary: float
    allowances: float = 0.0
    deductions: float = 0.0
    bonus: float = 0.0


class PayrollCreate(PayrollBase):
    pass


class PayrollResponse(PayrollBase):
    id: int
    gross_salary: float
    net_salary: float
    tax_amount: float = 0.0
    status: str
    payment_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PayrollListResponse(BaseModel):
    records: List[PayrollResponse]
    total: int


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    project_id: Optional[int] = None
    priority: str = "medium"
    due_date: Optional[date] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None
    progress_percent: Optional[float] = None


class TaskResponse(TaskBase):
    id: int
    status: str
    progress_percent: float = 0.0
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    total_users: int
    total_students: int
    total_courses: int
    total_jobs: int
    total_revenue: float
    active_projects: int
    placements_this_month: int
    new_enrollments_this_month: int


class RevenueData(BaseModel):
    month: str
    revenue: float
    expenses: float
    profit: float


class DashboardStats(BaseModel):
    summary: AnalyticsSummary
    revenue_trend: List[RevenueData]
    recent_activities: List[dict]
