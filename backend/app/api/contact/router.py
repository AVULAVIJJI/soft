from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional
import os

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = "General Inquiry"
    message: str
    inquiry_type: Optional[str] = "general"

@router.post("/")
async def submit_contact(form: ContactForm, background_tasks: BackgroundTasks):
    # Log the inquiry
    print(f"[CONTACT] From: {form.name} <{form.email}> | Subject: {form.subject}")
    # Send email in background
    background_tasks.add_task(send_contact_email, form)
    return {"success": True, "message": "Thank you for contacting us. We will respond within 1 business day."}

async def send_contact_email(form: ContactForm):
    try:
        import httpx
        api_key = os.getenv("BREVO_API_KEY", "")
        if not api_key:
            return
        payload = {
            "sender": {"name": "Softmaster Website", "email": "noreply@softmastertech.com"},
            "to": [{"email": "contact@softmastertech.com", "name": "Softmaster Team"}],
            "subject": f"New Inquiry: {form.subject} from {form.name}",
            "htmlContent": f"""
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {form.name}</p>
<p><strong>Email:</strong> {form.email}</p>
<p><strong>Phone:</strong> {form.phone or 'Not provided'}</p>
<p><strong>Type:</strong> {form.inquiry_type}</p>
<p><strong>Subject:</strong> {form.subject}</p>
<p><strong>Message:</strong></p>
<p>{form.message}</p>
"""
        }
        async with httpx.AsyncClient() as client:
            await client.post("https://api.brevo.com/v3/smtp/email", json=payload, headers={"api-key": api_key, "Content-Type": "application/json"})
    except Exception as e:
        print(f"[CONTACT EMAIL ERROR] {e}")
