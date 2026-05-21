# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Placements API Routes
# File: backend/app/api/placements/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()

# ─── Placement Drives ────────────────────────────────────────────────────────

@router.get("/drives")
async def list_drives(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    offset = (page - 1) * size
    query = "SELECT * FROM placement_drives WHERE 1=1"
    params = {}
    if status:
        query += " AND status = :status"
        params["status"] = status
    query += " ORDER BY drive_date DESC LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM placement_drives"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.get("/drives/{drive_id}")
async def get_drive(drive_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("SELECT * FROM placement_drives WHERE id = :id"), {"id": drive_id}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Drive not found")
    return dict(result._mapping)

@router.post("/drives")
async def create_drive(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin", "admin", "placement_officer"]))):
    result = db.execute(text("""
        INSERT INTO placement_drives (company_name, company_logo, drive_title, description,
            roles_offered, salary_package_lpa, eligibility_criteria, drive_date,
            registration_deadline, venue, status, created_by)
        VALUES (:company_name, :company_logo, :drive_title, :description,
            :roles_offered, :salary_package_lpa, :eligibility_criteria, :drive_date,
            :registration_deadline, :venue, 'upcoming', :created_by)
        RETURNING *
    """), {**data, "created_by": str(current_user["id"])})
    db.commit()
    return dict(result.fetchone()._mapping)

@router.put("/drives/{drive_id}")
async def update_drive(drive_id: str, data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin", "admin", "placement_officer"]))):
    db.execute(text("""
        UPDATE placement_drives SET
            company_name = COALESCE(:company_name, company_name),
            drive_title = COALESCE(:drive_title, drive_title),
            status = COALESCE(:status, status),
            updated_at = NOW()
        WHERE id = :id
    """), {**data, "id": drive_id})
    db.commit()
    return {"message": "Drive updated successfully"}

@router.post("/drives/{drive_id}/register")
async def register_for_drive(drive_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = db.execute(text("""
        SELECT id FROM drive_registrations WHERE drive_id = :drive_id AND student_id = :student_id
    """), {"drive_id": drive_id, "student_id": str(current_user["id"])}).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this drive")
    db.execute(text("""
        INSERT INTO drive_registrations (drive_id, student_id, status, registered_at)
        VALUES (:drive_id, :student_id, 'registered', NOW())
    """), {"drive_id": drive_id, "student_id": str(current_user["id"])})
    db.commit()
    return {"message": "Successfully registered for placement drive"}

# ─── Placed Students ──────────────────────────────────────────────────────────

@router.get("/placements")
async def list_placements(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    offset = (page - 1) * size
    result = db.execute(text("""
        SELECT ps.*, u.first_name, u.last_name, u.email
        FROM placed_students ps
        JOIN users u ON u.id = ps.student_id
        ORDER BY ps.placed_at DESC
        LIMIT :limit OFFSET :offset
    """), {"limit": size, "offset": offset}).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM placed_students"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.post("/placements")
async def record_placement(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin", "admin", "placement_officer"]))):
    result = db.execute(text("""
        INSERT INTO placed_students (student_id, company_name, role, package_lpa, joining_date, drive_id, placed_at)
        VALUES (:student_id, :company_name, :role, :package_lpa, :joining_date, :drive_id, NOW())
        RETURNING *
    """), data)
    db.commit()
    return dict(result.fetchone()._mapping)

# ─── Placement Stats ──────────────────────────────────────────────────────────

@router.get("/stats")
async def placement_stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    total = db.execute(text("SELECT COUNT(*) FROM placed_students"), {}).scalar() or 0
    avg_pkg = db.execute(text("SELECT COALESCE(AVG(package_lpa), 0) FROM placed_students"), {}).scalar() or 0
    max_pkg = db.execute(text("SELECT COALESCE(MAX(package_lpa), 0) FROM placed_students"), {}).scalar() or 0
    companies = db.execute(text("SELECT COUNT(DISTINCT company_name) FROM placed_students"), {}).scalar() or 0
    drives = db.execute(text("SELECT COUNT(*) FROM placement_drives"), {}).scalar() or 0
    return {
        "total_placed": total,
        "avg_package_lpa": round(float(avg_pkg), 2),
        "highest_package_lpa": round(float(max_pkg), 2),
        "companies_count": companies,
        "total_drives": drives
    }

# ─── Companies ───────────────────────────────────────────────────────────────

@router.get("/companies")
async def list_companies(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT company_name, COUNT(*) as placements, AVG(package_lpa) as avg_package
        FROM placed_students
        GROUP BY company_name
        ORDER BY placements DESC
    """), {}).fetchall()
    return [dict(r._mapping) for r in result]
