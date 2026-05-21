# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Clients API Routes
# File: backend/app/api/clients_api/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()

@router.get("/")
async def list_clients(
    search: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin","admin","hr"]))
):
    offset = (page - 1) * size
    query = "SELECT * FROM clients WHERE 1=1"
    params = {}
    if search:
        query += " AND (company_name ILIKE :search OR contact_name ILIKE :search OR email ILIKE :search)"
        params["search"] = f"%{search}%"
    if status:
        query += " AND status = :status"
        params["status"] = status
    query += " ORDER BY company_name LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM clients"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.get("/{client_id}")
async def get_client(client_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("SELECT * FROM clients WHERE id = :id"), {"id": client_id}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Client not found")
    client = dict(result._mapping)
    projects = db.execute(text("SELECT * FROM projects WHERE client_id = :id ORDER BY created_at DESC"), {"id": client_id}).fetchall()
    client["projects"] = [dict(p._mapping) for p in projects]
    return client

@router.post("/")
async def create_client(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin"]))):
    result = db.execute(text("""
        INSERT INTO clients (company_name, contact_name, email, phone, address,
            gstin, website, industry, status, created_by)
        VALUES (:company_name, :contact_name, :email, :phone, :address,
            :gstin, :website, :industry, 'active', :created_by)
        RETURNING *
    """), {**data, "created_by": str(current_user["id"])})
    db.commit()
    return dict(result.fetchone()._mapping)

@router.put("/{client_id}")
async def update_client(client_id: str, data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin"]))):
    db.execute(text("""
        UPDATE clients SET
            company_name = COALESCE(:company_name, company_name),
            contact_name = COALESCE(:contact_name, contact_name),
            email = COALESCE(:email, email),
            phone = COALESCE(:phone, phone),
            status = COALESCE(:status, status),
            updated_at = NOW()
        WHERE id = :id
    """), {**data, "id": client_id})
    db.commit()
    return {"message": "Client updated"}

@router.delete("/{client_id}")
async def delete_client(client_id: str, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin"]))):
    db.execute(text("DELETE FROM clients WHERE id = :id"), {"id": client_id})
    db.commit()
    return {"message": "Client deleted"}

@router.get("/{client_id}/invoices")
async def get_client_invoices(client_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("SELECT * FROM invoices WHERE client_id = :id ORDER BY invoice_date DESC"), {"id": client_id}).fetchall()
    return [dict(r._mapping) for r in result]

@router.get("/{client_id}/meetings")
async def get_client_meetings(client_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        SELECT * FROM client_meetings WHERE client_id = :id ORDER BY meeting_date DESC
    """), {"id": client_id}).fetchall()
    return [dict(r._mapping) for r in result]
