"""
Softmaster Technology Solutions Pvt Ltd
Enterprise SaaS Platform - FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base

# Import all models so they register with Base
import app.models

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.courses import router as courses_router
from app.api.jobs import router as jobs_router
from app.api.projects import router as projects_router
from app.api.payments import router as payments_router
from app.api.attendance import router as attendance_router
from app.api.payroll import router as payroll_router
from app.api.certificates import router as certificates_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.reports import router as reports_router
from app.api.blog.router import router as blog_router
from app.api.contact.router import router as contact_router
from app.api.cms.router import router as cms_router

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("Database tables created/verified.")
    yield


app = FastAPI(
    title="Softmaster Enterprise API",
    description="Enterprise SaaS Platform API for Softmaster Technology Solutions Pvt Ltd",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
API_PREFIX = "/api/v1"
app.include_router(auth_router,          prefix=f"{API_PREFIX}/auth",          tags=["Authentication"])
app.include_router(users_router,         prefix=f"{API_PREFIX}/users",         tags=["Users"])
app.include_router(courses_router,       prefix=f"{API_PREFIX}/courses",       tags=["Academy"])
app.include_router(jobs_router,          prefix=f"{API_PREFIX}/jobs",          tags=["Jobs"])
app.include_router(projects_router,      prefix=f"{API_PREFIX}/projects",      tags=["Client Portal"])
app.include_router(payments_router,      prefix=f"{API_PREFIX}/payments",      tags=["Payments"])
app.include_router(attendance_router,    prefix=f"{API_PREFIX}/attendance",    tags=["ERP"])
app.include_router(payroll_router,       prefix=f"{API_PREFIX}/payroll",       tags=["ERP"])
app.include_router(certificates_router,  prefix=f"{API_PREFIX}/certificates",  tags=["Academy"])
app.include_router(analytics_router,     prefix=f"{API_PREFIX}/analytics",     tags=["Analytics"])
app.include_router(notifications_router, prefix=f"{API_PREFIX}/notifications", tags=["Notifications"])
app.include_router(reports_router,       prefix=f"{API_PREFIX}/reports",       tags=["Reports"])
app.include_router(blog_router,          prefix=f"{API_PREFIX}/blog",          tags=["Blog"])
app.include_router(contact_router,       prefix=f"{API_PREFIX}/contact",       tags=["Contact"])
app.include_router(cms_router,           prefix=f"{API_PREFIX}/cms",           tags=["CMS"])

# Backward compat
app.include_router(auth_router,          prefix="/api/auth",                   tags=["Auth v0"])
app.include_router(users_router,         prefix="/api/users",                  tags=["Users v0"])
app.include_router(courses_router,       prefix="/api/courses",                tags=["Courses v0"])
app.include_router(jobs_router,          prefix="/api/jobs",                   tags=["Jobs v0"])
app.include_router(notifications_router, prefix="/api/notifications",          tags=["Notifications v0"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "company": "Softmaster Technology Solutions Pvt Ltd",
        "platform": "Enterprise SaaS API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "api": "online"}