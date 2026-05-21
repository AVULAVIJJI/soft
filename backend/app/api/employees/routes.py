# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Employees API Routes
# File: backend/app/api/employees/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()

@router.get("/")
async def list_employees(
    department_id: Optional[str] = None,
    status: Optional[str] = "active",
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin", "admin", "hr"]))
):
    offset = (page - 1) * size
    query = """SELECT e.*, d.name as department_name, u.email
               FROM employees e
               LEFT JOIN departments d ON d.id = e.department_id
               LEFT JOIN users u ON u.id = e.user_id
               WHERE 1=1"""
    params = {}
    if department_id:
        query += " AND e.department_id = :dept_id"
        params["dept_id"] = department_id
    if status:
        query += " AND e.status = :status"
        params["status"] = status
    if search:
        query += " AND (e.first_name ILIKE :search OR e.last_name ILIKE :search OR e.employee_code ILIKE :search)"
        params["search"] = f"%{search}%"
    query += " ORDER BY e.first_name LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM employees"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.get("/me")
async def get_my_employee_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT e.*, d.name as department_name FROM employees e
        LEFT JOIN departments d ON d.id = e.department_id
        WHERE e.user_id = :user_id
    """), {"user_id": str(current_user["id"])}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    return dict(result._mapping)

@router.get("/{employee_id}")
async def get_employee(employee_id: str, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    result = db.execute(text("""
        SELECT e.*, d.name as department_name, u.email FROM employees e
        LEFT JOIN departments d ON d.id = e.department_id
        LEFT JOIN users u ON u.id = e.user_id
        WHERE e.id = :id
    """), {"id": employee_id}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Employee not found")
    return dict(result._mapping)

@router.post("/")
async def create_employee(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    result = db.execute(text("""
        INSERT INTO employees (user_id, employee_code, first_name, last_name, email, phone,
            department_id, designation, employment_type, join_date, basic_salary, status)
        VALUES (:user_id, :employee_code, :first_name, :last_name, :email, :phone,
            :department_id, :designation, :employment_type, :join_date, :basic_salary, 'active')
        RETURNING *
    """), data)
    db.commit()
    return dict(result.fetchone()._mapping)

@router.put("/{employee_id}")
async def update_employee(employee_id: str, data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    db.execute(text("""
        UPDATE employees SET
            designation = COALESCE(:designation, designation),
            department_id = COALESCE(:department_id, department_id),
            basic_salary = COALESCE(:basic_salary, basic_salary),
            status = COALESCE(:status, status),
            updated_at = NOW()
        WHERE id = :id
    """), {**data, "id": employee_id})
    db.commit()
    return {"message": "Employee updated successfully"}

@router.get("/{employee_id}/payslips")
async def get_employee_payslips(employee_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT * FROM payroll WHERE employee_id = :emp_id ORDER BY year DESC, month DESC
    """), {"emp_id": employee_id}).fetchall()
    return [dict(r._mapping) for r in result]

@router.get("/{employee_id}/attendance-summary")
async def get_attendance_summary(employee_id: str, month: int, year: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT
            COUNT(*) FILTER (WHERE status = 'present') as present_days,
            COUNT(*) FILTER (WHERE status = 'absent') as absent_days,
            COUNT(*) FILTER (WHERE status = 'half_day') as half_days,
            COUNT(*) FILTER (WHERE status = 'work_from_home') as wfh_days,
            COUNT(*) FILTER (WHERE status = 'on_leave') as leave_days,
            SUM(work_hours) as total_hours
        FROM attendance
        WHERE employee_id = :emp_id
        AND EXTRACT(MONTH FROM attendance_date) = :month
        AND EXTRACT(YEAR FROM attendance_date) = :year
    """), {"emp_id": employee_id, "month": month, "year": year}).fetchone()
    return dict(result._mapping) if result else {}

@router.get("/departments/list")
async def list_departments(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("SELECT * FROM departments WHERE is_active = TRUE ORDER BY name"), {}).fetchall()
    return [dict(r._mapping) for r in result]
