from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/")
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if search:
        query = query.filter(
            User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    total = query.count()
    users = query.offset(skip).limit(limit).all()
    return {
        "users": [{"id": u.id, "email": u.email, "full_name": u.full_name,
                   "role": str(u.role).replace("UserRole.", ""), "is_active": u.is_active, "created_at": str(u.created_at)} for u in users],
        "total": total, "page": skip // limit + 1, "limit": limit
    }


@router.get("/me")
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email,
            "full_name": current_user.full_name, "role": str(current_user.role).replace("UserRole.", ""),
            "is_active": current_user.is_active, "is_verified": current_user.is_verified,
            "avatar_url": getattr(current_user, "avatar_url", None)}


@router.get("/{user_id}")
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "full_name": user.full_name,
            "role": str(user.role).replace("UserRole.", ""), "is_active": user.is_active}


@router.post("/")
async def create_user(
    user_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if user_role not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Only admins can create users")
    from app.core.security import get_password_hash
    existing = db.query(User).filter(User.email == user_data["email"]).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    from app.models.erp import Employee
    from datetime import date
    user = User(
        email=user_data["email"],
        password_hash=get_password_hash(user_data.get("password", "Welcome@2024")),
        full_name=user_data["full_name"],
        phone=user_data.get("phone", ""),
        role=user_data.get("role", "employee"),
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.flush()
    # Auto-create employee record
    emp = Employee(
        user_id=user.id,
        employee_id=f"EMP{user.id:03d}",
        department=user_data.get("department", "General"),
        designation=user_data.get("role", "employee").replace("_", " ").title(),
        basic_salary=float(user_data.get("basic_salary", 30000)),
        date_of_joining=date.today(),
        is_active=True,
    )
    db.add(emp)
    db.commit()
    db.refresh(user)
    return {"message": "User created", "id": user.id, "employee_id": emp.employee_id}


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(current_user.role).replace("UserRole.", "")
    if current_user.id != user_id and user_role not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    allowed = ["full_name", "phone", "avatar_url"]
    for field in allowed:
        if field in update_data:
            setattr(user, field, update_data[field])
    db.commit()
    return {"message": "User updated successfully"}


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully"}


@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    return {"message": "User activated"}