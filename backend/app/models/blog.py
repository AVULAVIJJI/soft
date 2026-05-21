from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import enum


class BlogStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    slug = Column(String(350), unique=True, index=True)
    excerpt = Column(String(500))
    content = Column(Text, nullable=False)
    thumbnail_url = Column(String(500))
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(BlogStatus), default=BlogStatus.draft)
    category = Column(String(100))
    tags = Column(String(500))
    is_featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    read_time_minutes = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime)

    author = relationship("User", back_populates="blog_posts")
