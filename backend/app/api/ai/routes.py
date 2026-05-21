"""
Softmaster Technology Solutions Pvt Ltd
API Routes - Stub (expand as needed)
"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/")
async def list_items(current_user: User = Depends(get_current_user)):
    return {"items": [], "message": "Endpoint operational"}

@router.get("/health")
async def health():
    return {"status": "ok"}
