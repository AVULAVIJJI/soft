from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import re
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.blog import BlogPost, BlogStatus

router = APIRouter()


def make_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    return slug + "-" + str(int(datetime.utcnow().timestamp()))


@router.get("/")
async def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    category: Optional[str] = None,
    status: Optional[str] = "published",
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BlogPost)
    if status:
        query = query.filter(BlogPost.status == status)
    if category:
        query = query.filter(BlogPost.category == category)
    if featured is not None:
        query = query.filter(BlogPost.is_featured == featured)
    if search:
        query = query.filter(
            BlogPost.title.ilike(f"%{search}%") |
            BlogPost.excerpt.ilike(f"%{search}%")
        )
    total = query.count()
    posts = query.order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "posts": [
            {
                "id": p.id, "title": p.title, "slug": p.slug,
                "excerpt": p.excerpt, "category": p.category,
                "status": p.status, "is_featured": p.is_featured,
                "thumbnail_url": p.thumbnail_url,
                "read_time_minutes": p.read_time_minutes,
                "views": p.views,
                "published_at": str(p.published_at) if p.published_at else None,
                "created_at": str(p.created_at)
            }
            for p in posts
        ],
        "total": total, "page": skip // limit + 1, "limit": limit
    }


@router.get("/{slug}")
async def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views = (post.views or 0) + 1
    db.commit()
    return {
        "id": post.id, "title": post.title, "slug": post.slug,
        "excerpt": post.excerpt, "content": post.content,
        "category": post.category, "tags": post.tags,
        "status": post.status, "is_featured": post.is_featured,
        "thumbnail_url": post.thumbnail_url,
        "read_time_minutes": post.read_time_minutes,
        "views": post.views, "author_id": post.author_id,
        "published_at": str(post.published_at) if post.published_at else None,
        "created_at": str(post.created_at)
    }


@router.post("/")
async def create_post(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin", "trainer"]:
        raise HTTPException(status_code=403, detail="Not authorized to create posts")
    content = data.get("content", "")
    words = len(content.split())
    read_time = max(1, round(words / 200))
    post = BlogPost(
        title=data["title"],
        slug=make_slug(data["title"]),
        excerpt=data.get("excerpt", content[:200] + "..." if len(content) > 200 else content),
        content=content,
        category=data.get("category"),
        tags=data.get("tags"),
        thumbnail_url=data.get("thumbnail_url"),
        is_featured=data.get("is_featured", False),
        read_time_minutes=read_time,
        author_id=current_user.id,
        status=data.get("status", "draft")
    )
    if post.status == "published":
        post.published_at = datetime.utcnow()
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"message": "Post created", "post_id": post.id, "slug": post.slug}


@router.put("/{post_id}")
async def update_post(
    post_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin", "trainer"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for field in ["title", "excerpt", "content", "category", "tags", "thumbnail_url", "is_featured"]:
        if field in data:
            setattr(post, field, data[field])
    if "status" in data:
        post.status = data["status"]
        if data["status"] == "published" and not post.published_at:
            post.published_at = datetime.utcnow()
    post.updated_at = datetime.utcnow()
    if "content" in data:
        words = len(data["content"].split())
        post.read_time_minutes = max(1, round(words / 200))
    db.commit()
    return {"message": "Post updated"}


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}
