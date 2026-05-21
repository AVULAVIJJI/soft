from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.erp import PayrollRecord

router = APIRouter()


@router.get("/")
async def list_payroll(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    employee_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    query = db.query(PayrollRecord)
    if user_role not in ["super_admin", "admin", "hr"]:
        query = query.filter(PayrollRecord.employee_id == current_user.id)
    elif employee_id:
        query = query.filter(PayrollRecord.employee_id == employee_id)
    if month:
        query = query.filter(PayrollRecord.month == month)
    if year:
        query = query.filter(PayrollRecord.year == year)
    total = query.count()
    records = query.order_by(PayrollRecord.year.desc(), PayrollRecord.month.desc()).offset(skip).limit(limit).all()
    return {
        "records": [
            {"id": r.id, "employee_id": r.employee_id,
             "month": r.month, "year": r.year,
             "basic_salary": r.basic_salary,
             "allowances": getattr(r, "allowances", 0.0),
             "deductions": getattr(r, "deductions", 0.0),
             "bonus": getattr(r, "bonus", 0.0),
             "gross_salary": getattr(r, "gross_salary", r.basic_salary),
             "net_salary": getattr(r, "net_salary", r.basic_salary),
             "status": getattr(r, "status", "generated")}
            for r in records
        ],
        "total": total
    }


@router.post("/generate")
async def generate_payroll(
    payroll_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if user_role not in ["super_admin", "admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized to generate payroll")
    existing = db.query(PayrollRecord).filter(
        PayrollRecord.employee_id == payroll_data["employee_id"],
        PayrollRecord.month == payroll_data["month"],
        PayrollRecord.year == payroll_data["year"]
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Payroll already generated for this period")
    basic = float(payroll_data.get("basic_salary", 0))
    allowances = float(payroll_data.get("allowances", 0))
    deductions = float(payroll_data.get("deductions", 0))
    bonus = float(payroll_data.get("bonus", 0))
    gross = basic + allowances + bonus
    tax = gross * 0.1 if gross > 50000 else 0
    net = gross - deductions - tax
    record = PayrollRecord(
        employee_id=payroll_data["employee_id"],
        month=payroll_data["month"],
        year=payroll_data["year"],
        basic_salary=basic,
        allowances=allowances,
        deductions=deductions,
        bonus=bonus,
        gross_salary=gross,
        net_salary=net,
        tax_amount=tax,
        status="generated"
    )
    db.add(record)
    db.commit()
    return {"message": "Payroll generated", "payroll_id": record.id, "net_salary": net}


@router.put("/{payroll_id}/pay")
async def mark_payroll_paid(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if user_role not in ["super_admin", "admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    record = db.query(PayrollRecord).filter(PayrollRecord.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    record.status = "paid"
    db.commit()
    return {"message": "Marked as paid"}


@router.get("/{payroll_id}/slip")
async def get_payslip(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(PayrollRecord).filter(PayrollRecord.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll not found")
    user_role = str(current_user.role).replace("UserRole.", "")
    if record.employee_id != current_user.id and user_role not in ["super_admin", "admin", "hr"]:
        raise HTTPException(status_code=403, detail="Access denied")
    employee = db.query(User).filter(User.id == record.employee_id).first()
    return {
        "payslip": {
            "employee_name": employee.full_name if employee else "Unknown",
            "employee_email": employee.email if employee else None,
            "month": record.month, "year": record.year,
            "basic_salary": record.basic_salary,
            "allowances": getattr(record, "allowances", 0),
            "bonus": getattr(record, "bonus", 0),
            "gross_salary": getattr(record, "gross_salary", record.basic_salary),
            "deductions": getattr(record, "deductions", 0),
            "tax_amount": getattr(record, "tax_amount", 0),
            "net_salary": getattr(record, "net_salary", record.basic_salary),
            "status": getattr(record, "status", "generated")
        }
    }