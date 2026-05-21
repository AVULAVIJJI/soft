from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.core.database import Base
from datetime import datetime


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text)
    value_json = Column(JSON)
    setting_type = Column(String(50), default="text")
    label = Column(String(200))
    group = Column(String(100), default="general")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    role = Column(String(200))
    company = Column(String(200))
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ClientCompany(Base):
    __tablename__ = "client_companies"

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    sector = Column(String(100))
    location = Column(String(200))
    product_used = Column(String(200))
    logo_url = Column(String(500))
    website_url = Column(String(500))
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ServiceItem(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    category = Column(String(100))
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(Integer, primary_key=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), default="general")
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
