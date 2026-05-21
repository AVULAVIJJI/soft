"""
ERP Models - Employees, Attendance, Leaves, Payroll, Tasks, Expenses
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Date, Enum, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"
    half_day = "half_day"
    on_leave = "on_leave"
    holiday = "holiday"


class LeaveStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"


class LeaveType(str, enum.Enum):
    annual = "annual"
    sick = "sick"
    casual = "casual"
    maternity = "maternity"
    paternity = "paternity"
    unpaid = "unpaid"


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    employee_id = Column(String(50), unique=True, nullable=False)
    department = Column(String(100))
    designation = Column(String(100))
    employment_type = Column(String(50), default="full_time")
    reporting_manager_id = Column(Integer, ForeignKey("employees.id"))
    date_of_joining = Column(Date)
    date_of_leaving = Column(Date)
    basic_salary = Column(Float, default=0.0)
    bank_account = Column(String(50))
    bank_name = Column(String(100))
    epf_number = Column(String(50))
    etf_number = Column(String(50))
    nic_number = Column(String(20))
    emergency_contact = Column(String(100))
    emergency_phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    attendance = relationship("Attendance", back_populates="employee")
    leaves = relationship("Leave", back_populates="employee", foreign_keys="[Leave.employee_id]")
    payroll_records = relationship("PayrollRecord", back_populates="employee")


class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.present)
    work_hours = Column(Float, default=0.0)
    total_hours = Column(Float, default=0.0)
    overtime_hours = Column(Float, default=0.0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    employee = relationship("Employee", back_populates="attendance")


class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(Enum(LeaveType), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days_count = Column(Float, nullable=False)
    total_days = Column(Float, default=0)
    reason = Column(Text)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.pending)
    approved_by = Column(Integer, ForeignKey("employees.id"))
    approved_at = Column(DateTime(timezone=True))
    rejection_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    employee = relationship("Employee", back_populates="leaves", foreign_keys=[employee_id])


class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    basic_salary = Column(Float, default=0.0)
    allowances = Column(Float, default=0.0)
    overtime_pay = Column(Float, default=0.0)
    bonuses = Column(Float, default=0.0)
    bonus = Column(Float, default=0.0)
    gross_salary = Column(Float, default=0.0)
    epf_employee = Column(Float, default=0.0)
    epf_employer = Column(Float, default=0.0)
    etf_employer = Column(Float, default=0.0)
    income_tax = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    other_deductions = Column(Float, default=0.0)
    net_salary = Column(Float, default=0.0)
    payment_date = Column(Date)
    payment_method = Column(String(50), default="bank_transfer")
    status = Column(String(50), default="pending")
    payslip_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    employee = relationship("Employee", back_populates="payroll_records")


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    assigned_by = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    priority = Column(String(20), default="medium")
    status = Column(String(50), default="todo")
    due_date = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    category = Column(String(100))
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    description = Column(Text)
    receipt_url = Column(String(500))
    expense_date = Column(Date)
    status = Column(String(50), default="pending")
    approved_by = Column(Integer, ForeignKey("employees.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
