from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.erp import Attendance, Leave

router = APIRouter()


@router.get("/")
async def list_attendance(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    employee_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    query = db.query(Attendance)
    if user_role not in ["super_admin", "admin", "hr"]:
        query = query.filter(Attendance.employee_id == current_user.id)
    elif employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    total = query.count()
    records = query.order_by(Attendance.date.desc()).offset(skip).limit(limit).all()
    return {
        "records": [
            {"id": r.id, "employee_id": r.employee_id, "date": str(r.date),
             "check_in": str(r.check_in) if r.check_in else None,
             "check_out": str(r.check_out) if r.check_out else None,
             "status": str(getattr(r, "status", "present")).replace("AttendanceStatus.", ""),
             "total_hours": getattr(r, "total_hours", None)}
            for r in records
        ],
        "total": total
    }


@router.post("/check-in")
async def check_in(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    existing = db.query(Attendance).filter(
        Attendance.employee_id == current_user.id,
        Attendance.date == today
    ).first()
    if existing and existing.check_in:
        raise HTTPException(status_code=400, detail="Already checked in today")
    if existing:
        existing.check_in = datetime.utcnow()
        existing.status = "present"
    else:
        record = Attendance(
            employee_id=current_user.id,
            date=today,
            check_in=datetime.utcnow(),
            status="present"
        )
        db.add(record)
    db.commit()
    return {"message": "Check-in recorded", "time": str(datetime.now())}


@router.post("/check-out")
async def check_out(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    record = db.query(Attendance).filter(
        Attendance.employee_id == current_user.id,
        Attendance.date == today
    ).first()
    if not record or not record.check_in:
        raise HTTPException(status_code=400, detail="No check-in found for today")
    if record.check_out:
        raise HTTPException(status_code=400, detail="Already checked out today")
    now = datetime.utcnow()
    record.check_out = now
    check_in_naive = record.check_in.replace(tzinfo=None) if record.check_in.tzinfo else record.check_in
    diff = now - check_in_naive
    record.total_hours = round(diff.total_seconds() / 3600, 2)
    db.commit()
    return {"message": "Check-out recorded", "total_hours": record.total_hours}


@router.get("/today-summary")
async def today_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    record = db.query(Attendance).filter(
        Attendance.employee_id == current_user.id,
        Attendance.date == today
    ).first()
    return {
        "date": str(today),
        "checked_in": record is not None and record.check_in is not None,
        "check_in": str(record.check_in) if record and record.check_in else None,
        "checked_out": record is not None and record.check_out is not None,
        "check_out": str(record.check_out) if record and record.check_out else None,
        "total_hours": getattr(record, "total_hours", None) if record else None
    }


@router.get("/all-today")
async def all_today_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if user_role not in ["super_admin", "admin", "hr"]:
        raise HTTPException(status_code=403, detail="Access denied")
    today = date.today()
    records = db.query(Attendance).filter(Attendance.date == today).all()
    result = []
    for r in records:
        emp = db.query(User).filter(User.id == r.employee_id).first()
        result.append({
            "id": r.id, "employee_id": r.employee_id,
            "employee_name": emp.full_name if emp else "Unknown",
            "check_in": str(r.check_in) if r.check_in else None,
            "check_out": str(r.check_out) if r.check_out else None,
            "status": str(getattr(r, "status", "present")).replace("AttendanceStatus.", ""),
            "total_hours": getattr(r, "total_hours", None),
        })
    return {"records": result, "total": len(result), "date": str(today)}


@router.get("/leaves")
async def get_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    query = db.query(Leave)
    if user_role not in ["super_admin", "admin", "hr"]:
        query = query.filter(Leave.employee_id == current_user.id)
    leaves = query.order_by(Leave.created_at.desc()).all()
    result = []
    for l in leaves:
        emp = db.query(User).filter(User.id == l.employee_id).first()
        result.append({
            "id": l.id, "employee_id": l.employee_id,
            "employee_name": emp.full_name if emp else "Unknown",
            "leave_type": str(l.leave_type).replace("LeaveType.", ""),
            "start_date": str(l.start_date),
            "end_date": str(l.end_date), "reason": l.reason,
            "status": str(l.status).replace("LeaveStatus.", ""),
            "total_days": getattr(l, "total_days", 0)
        })
    return {"leaves": result, "total": len(result)}


@router.post("/leaves")
async def apply_leave(
    leave_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start = date.fromisoformat(leave_data["start_date"])
    end = date.fromisoformat(leave_data["end_date"])
    total_days = (end - start).days + 1
    leave = Leave(
        employee_id=current_user.id,
        leave_type=leave_data["leave_type"],
        start_date=start,
        end_date=end,
        days_count=total_days,
        reason=leave_data["reason"],
        total_days=total_days,
        status="pending"
    )
    db.add(leave)
    db.commit()
    return {"message": "Leave application submitted", "leave_id": leave.id, "total_days": total_days}


@router.post("/leaves/{leave_id}/update")
async def update_leave_status(
    leave_id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if user_role not in ["super_admin", "admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized to approve/reject leaves")
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = update_data.get("status", leave.status)
    if hasattr(leave, "approved_by"):
        leave.approved_by = current_user.id
    db.commit()
    return {"message": "Leave status updated"}