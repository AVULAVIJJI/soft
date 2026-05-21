"""
Security - JWT Token, Password Hashing, Role Verification
"""

from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Backward-compat aliases
hash_password = lambda p: pwd_context.hash(p)
verify_password = lambda plain, hashed: pwd_context.verify(plain, hashed)
get_password_hash = lambda p: pwd_context.hash(p)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Alias for backward compat
verify_token = decode_token


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    from app.models.user import User
    token = credentials.credentials
    payload = decode_token(token)
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user


def get_user_role(user) -> str:
    """Strip UserRole. prefix from role string"""
    return str(user.role).replace("UserRole.", "")


def require_role(*roles):
    """
    Accepts either require_role("admin","hr") or require_role(["admin","hr"]).
    """
    # If called with a single list argument, unpack it
    if len(roles) == 1 and isinstance(roles[0], (list, tuple)):
        roles = tuple(roles[0])

    async def role_checker(current_user=Depends(get_current_user)):
        user_role = str(current_user.role).replace("UserRole.", "")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(roles)}",
            )
        return current_user
    return role_checker


# Role constants
ROLE_SUPER_ADMIN = "super_admin"
ROLE_ADMIN = "admin"
ROLE_HR = "hr"
ROLE_TRAINER = "trainer"
ROLE_RECRUITER = "recruiter"
ROLE_STUDENT = "student"
ROLE_CLIENT = "client"
ROLE_EMPLOYEE = "employee"

# Convenience shortcuts
require_admin = require_role("super_admin", "admin")
require_hr = require_role("super_admin", "admin", "hr")
require_trainer = require_role("super_admin", "admin", "trainer")
require_recruiter = require_role("super_admin", "admin", "hr", "recruiter")
