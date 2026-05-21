# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# HR API Routes
# File: backend/app/api/hr/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()

# ─── Departments ──────────────────────────────────────────────────────────────

@router.get("/departments")
async def list_departments(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT d.*, COUNT(e.id) as employee_count
        FROM departments d
        LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'active'
        GROUP BY d.id ORDER BY d.name
    """), {}).fetchall()
    return [dict(r._mapping) for r in result]

@router.post("/departments")
async def create_department(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    result = db.execute(text("""
        INSERT INTO departments (name, code, description, manager_id, budget)
        VALUES (:name, :code, :description, :manager_id, :budget) RETURNING *
    """), data)
    db.commit()
    return dict(result.fetchone()._mapping)

# ─── Leave Management ─────────────────────────────────────────────────────────

@router.get("/leaves")
async def list_leaves(
    status: Optional[str] = None,
    department_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin","admin","hr"]))
):
    offset = (page - 1) * size
    query = """
        SELECT la.*, e.first_name, e.last_name, e.employee_code, lt.name as leave_type_name
        FROM leave_applications la
        JOIN employees e ON e.id = la.employee_id
        JOIN leave_types lt ON lt.id = la.leave_type_id
        WHERE 1=1
    """
    params = {}
    if status:
        query += " AND la.status = :status"
        params["status"] = status
    if department_id:
        query += " AND e.department_id = :dept_id"
        params["dept_id"] = department_id
    query += " ORDER BY la.applied_at DESC LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM leave_applications"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.post("/leaves/{leave_id}/approve")
async def approve_leave(leave_id: str, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    db.execute(text("""
        UPDATE leave_applications SET status = 'approved',
        approved_by = :approved_by, approved_at = NOW()
        WHERE id = :id
    """), {"id": leave_id, "approved_by": str(current_user["id"])})
    db.commit()
    return {"message": "Leave approved successfully"}

@router.post("/leaves/{leave_id}/reject")
async def reject_leave(leave_id: str, data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    db.execute(text("""
        UPDATE leave_applications SET status = 'rejected',
        approved_by = :approved_by, approved_at = NOW(), rejection_reason = :reason
        WHERE id = :id
    """), {"id": leave_id, "approved_by": str(current_user["id"]), "reason": data.get("reason","")})
    db.commit()
    return {"message": "Leave rejected"}

# ─── Payroll Management ──────────────────────────────────────────────────────

@router.get("/payroll")
async def list_payroll(
    month: Optional[int] = None,
    year: Optional[int] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin","admin","hr"]))
):
    offset = (page - 1) * size
    query = """
        SELECT p.*, e.first_name, e.last_name, e.employee_code, e.designation
        FROM payroll p JOIN employees e ON e.id = p.employee_id WHERE 1=1
    """
    params = {}
    if month:
        query += " AND p.month = :month"
        params["month"] = month
    if year:
        query += " AND p.year = :year"
        params["year"] = year
    if status:
        query += " AND p.status = :status"
        params["status"] = status
    query += " ORDER BY p.year DESC, p.month DESC, e.first_name LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM payroll"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.post("/payroll/process")
async def process_payroll(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    """Process monthly payroll for all active employees"""
    month = data.get("month")
    year = data.get("year")
    employees = db.execute(text("""
        SELECT e.id, e.basic_salary FROM employees e WHERE e.status = 'active'
    """), {}).fetchall()
    processed = 0
    for emp in employees:
        emp_id = emp[0]
        basic = float(emp[1])
        hra = basic * 0.40
        allowances = basic * 0.20
        gross = basic + hra + allowances
        pf = basic * 0.12
        pt = 200.0
        it = max(0, (gross * 12 - 250000) / 12 * 0.05) if gross * 12 > 250000 else 0
        total_deductions = pf + pt + it
        net = gross - total_deductions
        existing = db.execute(text("""
            SELECT id FROM payroll WHERE employee_id = :emp_id AND month = :month AND year = :year
        """), {"emp_id": str(emp_id), "month": month, "year": year}).fetchone()
        if not existing:
            db.execute(text("""
                INSERT INTO payroll (employee_id, month, year, basic_salary, hra, allowances,
                    gross_salary, pf_deduction, professional_tax, income_tax,
                    total_deductions, net_salary, status)
                VALUES (:emp_id, :month, :year, :basic, :hra, :allowances,
                    :gross, :pf, :pt, :it, :total_ded, :net, 'processed')
            """), {
                "emp_id": str(emp_id), "month": month, "year": year,
                "basic": basic, "hra": hra, "allowances": allowances,
                "gross": gross, "pf": pf, "pt": pt, "it": it,
                "total_ded": total_deductions, "net": net
            })
            processed += 1
    db.commit()
    return {"message": f"Payroll processed for {processed} employees", "month": month, "year": year}

# ─── HR Analytics ────────────────────────────────────────────────────────────

@router.get("/analytics")
async def hr_analytics(db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    total_employees = db.execute(text("SELECT COUNT(*) FROM employees WHERE status = 'active'"), {}).scalar() or 0
    new_joiners = db.execute(text("SELECT COUNT(*) FROM employees WHERE join_date >= CURRENT_DATE - INTERVAL '30 days'"), {}).scalar() or 0
    pending_leaves = db.execute(text("SELECT COUNT(*) FROM leave_applications WHERE status = 'pending'"), {}).scalar() or 0
    avg_salary = db.execute(text("SELECT COALESCE(AVG(basic_salary),0) FROM employees WHERE status='active'"), {}).scalar() or 0
    dept_wise = db.execute(text("""
        SELECT d.name, COUNT(e.id) as count
        FROM departments d LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'active'
        GROUP BY d.name ORDER BY count DESC
    """), {}).fetchall()
    return {
        "total_employees": total_employees,
        "new_joiners_30d": new_joiners,
        "pending_leaves": pending_leaves,
        "avg_basic_salary": round(float(avg_salary), 2),
        "department_wise": [dict(r._mapping) for r in dept_wise]
    }
