"""
Authentication Routes
Login, Register, Refresh, Logout, Forgot Password, Reset Password
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import secrets, hashlib
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, decode_token, get_current_user
)
from app.core.config import settings
from app.models.user import User, UserProfile, UserSession, UserRole
from app.services.email_service import (
    send_welcome_email, send_password_reset_email,
    send_password_changed_alert, send_verification_email
)
from pydantic import BaseModel, EmailStr
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# In-memory token store (use Redis in production)
_reset_tokens: dict = {}
_verify_tokens: dict = {}


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "guest"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    portal: Optional[str] = "academy"


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    allowed_roles = ["guest", "student", "client"]
    role = data.role if data.role in allowed_roles else "guest"

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=UserRole(role),
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    db.flush()
    db.add(UserProfile(user_id=user.id))
    db.commit()
    db.refresh(user)

    # Send welcome + verification emails
    token = secrets.token_urlsafe(32)
    _verify_tokens[token] = {"user_id": user.id, "expires": datetime.utcnow() + timedelta(hours=24)}
    send_welcome_email(user.email, user.full_name)
    send_verification_email(user.email, user.full_name, token)

    return {"message": "Registration successful. Check your email to verify your account.", "user_id": user.id}


@router.post("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    entry = _verify_tokens.get(token)
    if not entry or entry["expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    user = db.query(User).filter(User.id == entry["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    del _verify_tokens[token]
    return {"message": "Email verified successfully. You can now sign in."}


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.is_active == True).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.last_login = datetime.utcnow()
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    expires_at = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(UserSession(
        user_id=user.id, refresh_token=refresh_token,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        expires_at=expires_at,
    ))
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id, "email": user.email,
            "full_name": user.full_name, "role": user.role,
            "avatar_url": user.avatar_url, "is_verified": user.is_verified,
        },
    )


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.is_active == True).first()
    # Always return success to prevent email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        _reset_tokens[token] = {
            "user_id": user.id,
            "expires": datetime.utcnow() + timedelta(hours=1),
            "portal": data.portal,
        }
        send_password_reset_email(user.email, user.full_name, token, data.portal)
    # In dev mode, return token directly (remove in production!)
    if settings.APP_ENV == "development" and user:
        return {"message": "Reset link generated", "reset_token": token, "reset_url": f"http://localhost:3006/reset-password?token={token}"}
    return {"message": "If this email is registered, you will receive a password reset link shortly."}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    entry = _reset_tokens.get(data.token)
    if not entry or entry["expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset link. Please request a new one.")
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user = db.query(User).filter(User.id == entry["user_id"], User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(data.new_password)
    db.query(UserSession).filter(UserSession.user_id == user.id).update({"is_active": False})
    db.commit()
    del _reset_tokens[data.token]

    send_password_changed_alert(user.email, user.full_name)
    return {"message": "Password reset successful. You can now sign in with your new password."}


@router.post("/refresh")
async def refresh_token(data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    session = db.query(UserSession).filter(
        UserSession.refresh_token == data.refresh_token,
        UserSession.is_active == True,
    ).first()
    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token expired or invalid")

    user = db.query(User).filter(User.id == session.user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(data={"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token(data={"sub": str(user.id)})
    session.refresh_token = new_refresh
    session.expires_at = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    db.commit()
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}


@router.post("/logout")
async def logout(data: RefreshRequest, db: Session = Depends(get_db)):
    session = db.query(UserSession).filter(UserSession.refresh_token == data.refresh_token).first()
    if session:
        session.is_active = False
        db.commit()
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "email": current_user.email,
        "full_name": current_user.full_name, "role": current_user.role,
        "phone": current_user.phone, "avatar_url": current_user.avatar_url,
        "is_verified": current_user.is_verified, "created_at": current_user.created_at,
        "last_login": current_user.last_login,
    }


@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    current_user.password_hash = get_password_hash(data.new_password)
    db.query(UserSession).filter(UserSession.user_id == current_user.id).update({"is_active": False})
    db.commit()
    send_password_changed_alert(current_user.email, current_user.full_name)
    return {"message": "Password changed successfully. Please log in again."}
