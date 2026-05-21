from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.client import Project, SupportTicket, TicketReply, Invoice

router = APIRouter()


@router.get("/")
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Project)
    if str(current_user.role) == "client":
        query = query.filter(Project.client_id == current_user.id)
    if status:
        query = query.filter(Project.status == status)
    total = query.count()
    projects = query.offset(skip).limit(limit).all()
    return {
        "projects": [
            {"id": p.id, "title": getattr(p, "title", None) or p.name, "description": getattr(p, "description", None),
             "client_id": p.client_id, "status": p.status,
             "progress_percent": getattr(p, "progress_percent", 0.0),
             "budget": getattr(p, "budget", None),
             "start_date": str(p.start_date) if hasattr(p, "start_date") and p.start_date else None,
             "end_date": str(p.end_date) if hasattr(p, "end_date") and p.end_date else None,
             "created_at": str(p.created_at)}
            for p in projects
        ],
        "total": total
    }


@router.post("/")
async def create_project(
    project_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to create projects")
    project = Project(
        name=project_data["title"],
        title=project_data["title"],
        description=project_data.get("description"),
        client_id=project_data["client_id"],
        budget=project_data.get("budget"),
        status="planning"
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"message": "Project created", "project_id": project.id}


@router.get("/{project_id}")
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if str(current_user.role) == "client" and project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return {
        "id": project.id, "title": getattr(project, "title", None) or project.name,
        "description": getattr(project, "description", None),
        "client_id": project.client_id, "status": project.status,
        "progress_percent": getattr(project, "progress_percent", 0.0),
        "budget": getattr(project, "budget", None)
    }


@router.put("/{project_id}")
async def update_project(
    project_id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role) not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field in ["title", "description", "status", "progress_percent", "budget"]:
        if field in update_data:
            setattr(project, field, update_data[field])
    db.commit()
    return {"message": "Project updated"}


@router.get("/tickets/list")
async def list_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(SupportTicket)
    if str(current_user.role) == "client":
        query = query.filter(SupportTicket.client_id == current_user.id)
    tickets = query.order_by(SupportTicket.created_at.desc()).all()
    return {
        "tickets": [
            {"id": t.id, "subject": t.subject,
             "status": t.status, "priority": getattr(t, "priority", "medium"),
             "ticket_number": getattr(t, "ticket_number", f"TKT-{t.id:04d}"),
             "created_at": str(t.created_at)}
            for t in tickets
        ],
        "total": len(tickets)
    }


@router.post("/tickets")
async def create_ticket(
    ticket_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import random, string
    ticket_num = "TKT-" + "".join(random.choices(string.digits, k=6))
    ticket = SupportTicket(
        subject=ticket_data["subject"],
        description=ticket_data["description"],
        client_id=current_user.id,
        priority=ticket_data.get("priority", "medium"),
        status="open",
        ticket_number=ticket_num
    )
    db.add(ticket)
    db.commit()
    return {"message": "Ticket created", "ticket_id": ticket.id, "ticket_number": ticket_num}


@router.get("/invoices/list")
async def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Invoice)
    if str(current_user.role) == "client":
        query = query.filter(Invoice.client_id == current_user.id)
    invoices = query.order_by(Invoice.created_at.desc()).all()
    return {
        "invoices": [
            {"id": i.id, "invoice_number": getattr(i, "invoice_number", f"INV-{i.id:04d}"),
             "amount": i.amount, "total_amount": getattr(i, "total_amount", i.amount),
             "status": getattr(i, "status", "draft"),
             "due_date": str(i.due_date) if hasattr(i, "due_date") and i.due_date else None,
             "created_at": str(i.created_at)}
            for i in invoices
        ],
        "total": len(invoices)
    }
