from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/")
async def list_items(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"items": [], "total": 0, "module": "payments"}

@router.get("/{item_id}")
async def get_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"id": item_id, "module": "payments"}
