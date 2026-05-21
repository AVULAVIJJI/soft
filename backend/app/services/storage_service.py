# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Cloudinary Storage Service
# File: backend/app/services/storage_service.py

import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import UploadFile, HTTPException
from app.core.config import settings
import uuid
import io

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DOC_TYPES = {"application/pdf", "application/msword",
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/avi"}

MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5MB
MAX_DOC_SIZE = 20 * 1024 * 1024    # 20MB
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB


async def upload_image(file: UploadFile, folder: str = "general") -> dict:
    """Upload an image to Cloudinary"""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large. Maximum size is 5MB")

    public_id = f"softmaster/{folder}/{uuid.uuid4()}"
    result = cloudinary.uploader.upload(
        contents,
        public_id=public_id,
        folder=f"softmaster/{folder}",
        quality="auto",
        fetch_format="auto",
        transformation=[{"width": 1200, "crop": "limit"}]
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "size": result.get("bytes")
    }


async def upload_document(file: UploadFile, folder: str = "documents") -> dict:
    """Upload a document (PDF/DOC) to Cloudinary"""
    if file.content_type not in ALLOWED_DOC_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and Word documents allowed")

    contents = await file.read()
    if len(contents) > MAX_DOC_SIZE:
        raise HTTPException(status_code=400, detail="Document too large. Maximum size is 20MB")

    public_id = f"softmaster/{folder}/{uuid.uuid4()}"
    result = cloudinary.uploader.upload(
        contents,
        public_id=public_id,
        resource_type="raw",
        folder=f"softmaster/{folder}"
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "size": result.get("bytes"),
        "original_filename": file.filename
    }


async def upload_resume(file: UploadFile, user_id: str) -> dict:
    """Upload a resume file"""
    folder = f"resumes/{user_id}"
    return await upload_document(file, folder)


async def upload_certificate(file: UploadFile, user_id: str, course_id: str) -> dict:
    """Upload a certificate image"""
    folder = f"certificates/{user_id}"
    return await upload_image(file, folder)


async def upload_profile_photo(file: UploadFile, user_id: str) -> dict:
    """Upload a profile photo with face detection"""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large")

    result = cloudinary.uploader.upload(
        contents,
        public_id=f"softmaster/avatars/{user_id}",
        overwrite=True,
        transformation=[
            {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
            {"quality": "auto", "fetch_format": "auto"}
        ]
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


async def upload_course_thumbnail(file: UploadFile, course_id: str) -> dict:
    """Upload a course thumbnail"""
    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        public_id=f"softmaster/courses/{course_id}/thumbnail",
        overwrite=True,
        transformation=[
            {"width": 800, "height": 450, "crop": "fill"},
            {"quality": "auto", "fetch_format": "auto"}
        ]
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


async def delete_file(public_id: str, resource_type: str = "image") -> bool:
    """Delete a file from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return result.get("result") == "ok"
    except Exception:
        return False


def get_optimized_url(public_id: str, width: int = 800, height: int = None) -> str:
    """Get an optimized URL for an image"""
    transformation = [{"width": width, "crop": "limit", "quality": "auto", "fetch_format": "auto"}]
    if height:
        transformation[0]["height"] = height
    return cloudinary.CloudinaryImage(public_id).build_url(transformation=transformation)
