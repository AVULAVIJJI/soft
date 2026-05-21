from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.cms import SiteSetting, Testimonial, ClientCompany, ServiceItem, FAQItem

router = APIRouter()

# ─── SITE SETTINGS ────────────────────────────────────────────────────────────

DEFAULT_SETTINGS = {
    "company_name": "Softmaster Technology Solutions Pvt Ltd",
    "company_address": "12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039",
    "company_phone": "+91 8500910044",
    "company_email": "contact@softmastertech.com",
    "company_website": "softmastertech.com",
    "company_founded": "2000",
    "company_cin": "U78100TS2024PTC191444",
    "company_about": "Softmaster Technology Solutions Pvt Ltd is a leading software company based in Hyderabad delivering enterprise-grade ERP, hospital, school, and hotel management solutions to 1700+ clients across India for 24+ years.",
    "total_clients": "1700",
    "total_years": "24",
    "total_products": "10",
    "placement_rate": "75",
    "hero_tagline": "India's Premier IT Solutions Company",
    "hero_subtitle": "Custom ERP, Hospital, School, Hotel Management Systems trusted by 1700+ businesses across India for 24+ years.",
    "office_hours": "Mon - Sat: 9:00 AM - 6:00 PM",
    "maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4327!2d78.5797!3d17.4274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9c7f3e4a5a5a%3A0xabcdef1234567890!2sPerezadiguda%2C%20Hyderabad%2C%20Telangana%20500039!5e0!3m2!1sen!2sin!4v1234567890",
    "facebook_url": "",
    "linkedin_url": "",
    "twitter_url": "",
    "instagram_url": "",
    "youtube_url": "",
    "razorpay_key_public": "",
    "currency": "INR",
    "timezone": "Asia/Kolkata",
    "meta_description": "24+ years of trusted software solutions. 1700+ clients across India. Custom ERP, HMS, SMS, Hotel Management, IT Training and more.",
    "meta_keywords": "software development, ERP, hospital management, school management, hotel management, IT training, Hyderabad",
}


@router.get("/settings")
async def get_all_settings(db: Session = Depends(get_db)):
    rows = db.query(SiteSetting).all()
    result = dict(DEFAULT_SETTINGS)
    for row in rows:
        result[row.key] = row.value
    return result


@router.get("/settings/{key}")
async def get_setting(key: str, db: Session = Depends(get_db)):
    row = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    value = row.value if row else DEFAULT_SETTINGS.get(key, "")
    return {"key": key, "value": value}


@router.put("/settings")
async def update_settings(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Only admins can update site settings")
    updated = []
    for key, value in data.items():
        row = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if row:
            row.value = str(value)
        else:
            row = SiteSetting(key=key, value=str(value))
            db.add(row)
        updated.append(key)
    db.commit()
    return {"message": f"Updated {len(updated)} settings", "updated_keys": updated}


# ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

@router.get("/testimonials")
async def list_testimonials(db: Session = Depends(get_db)):
    items = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.order_index).all()
    return {
        "testimonials": [
            {"id": t.id, "name": t.name, "role": t.role, "company": t.company,
             "content": t.content, "rating": t.rating, "avatar_url": t.avatar_url}
            for t in items
        ]
    }


@router.post("/testimonials")
async def create_testimonial(
    data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = Testimonial(**{k: v for k, v in data.items() if k in ["name", "role", "company", "content", "rating", "avatar_url", "order_index"]})
    db.add(item)
    db.commit()
    return {"message": "Testimonial added", "id": item.id}


@router.put("/testimonials/{item_id}")
async def update_testimonial(
    item_id: int, data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.items():
        if hasattr(item, k):
            setattr(item, k, v)
    db.commit()
    return {"message": "Updated"}


@router.delete("/testimonials/{item_id}")
async def delete_testimonial(
    item_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Deleted"}


# ─── CLIENTS ──────────────────────────────────────────────────────────────────

@router.get("/clients")
async def list_clients(featured: Optional[bool] = None, db: Session = Depends(get_db)):
    q = db.query(ClientCompany).filter(ClientCompany.is_active == True)
    if featured is not None:
        q = q.filter(ClientCompany.is_featured == featured)
    items = q.order_by(ClientCompany.order_index).all()
    return {
        "clients": [
            {"id": c.id, "name": c.name, "sector": c.sector, "location": c.location,
             "product_used": c.product_used, "logo_url": c.logo_url, "is_featured": c.is_featured}
            for c in items
        ]
    }


@router.post("/clients")
async def create_client(
    data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = ClientCompany(**{k: v for k, v in data.items() if k in ["name", "sector", "location", "product_used", "logo_url", "website_url", "is_featured", "order_index"]})
    db.add(item)
    db.commit()
    return {"message": "Client added", "id": item.id}


@router.put("/clients/{item_id}")
async def update_client(
    item_id: int, data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(ClientCompany).filter(ClientCompany.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.items():
        if hasattr(item, k):
            setattr(item, k, v)
    db.commit()
    return {"message": "Updated"}


@router.delete("/clients/{item_id}")
async def delete_client(
    item_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(ClientCompany).filter(ClientCompany.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Deleted"}


# ─── SERVICES ─────────────────────────────────────────────────────────────────

@router.get("/services-list")
async def list_services(db: Session = Depends(get_db)):
    items = db.query(ServiceItem).filter(ServiceItem.is_active == True).order_by(ServiceItem.order_index).all()
    return {
        "services": [
            {"id": s.id, "title": s.title, "description": s.description,
             "icon": s.icon, "category": s.category}
            for s in items
        ]
    }


@router.post("/services-list")
async def create_service(
    data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = ServiceItem(**{k: v for k, v in data.items() if k in ["title", "description", "icon", "category", "order_index"]})
    db.add(item)
    db.commit()
    return {"message": "Service added", "id": item.id}


@router.put("/services-list/{item_id}")
async def update_service(
    item_id: int, data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(ServiceItem).filter(ServiceItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.items():
        if hasattr(item, k):
            setattr(item, k, v)
    db.commit()
    return {"message": "Updated"}


@router.delete("/services-list/{item_id}")
async def delete_service(
    item_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(ServiceItem).filter(ServiceItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Deleted"}


# ─── FAQ ──────────────────────────────────────────────────────────────────────

@router.get("/faqs")
async def list_faqs(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(FAQItem).filter(FAQItem.is_active == True)
    if category:
        q = q.filter(FAQItem.category == category)
    items = q.order_by(FAQItem.order_index).all()
    return {
        "faqs": [
            {"id": f.id, "question": f.question, "answer": f.answer, "category": f.category}
            for f in items
        ]
    }


@router.post("/faqs")
async def create_faq(
    data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = FAQItem(**{k: v for k, v in data.items() if k in ["question", "answer", "category", "order_index"]})
    db.add(item)
    db.commit()
    return {"message": "FAQ added", "id": item.id}


@router.put("/faqs/{item_id}")
async def update_faq(
    item_id: int, data: dict, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.items():
        if hasattr(item, k):
            setattr(item, k, v)
    db.commit()
    return {"message": "Updated"}


@router.delete("/faqs/{item_id}")
async def delete_faq(
    item_id: int, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if str(current_user.role).replace("UserRole.", "") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    item = db.query(FAQItem).filter(FAQItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Deleted"}
