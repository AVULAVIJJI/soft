# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Razorpay Payment Service
# File: backend/app/services/payment_service.py

import razorpay
import hmac
import hashlib
import json
from app.core.config import settings
from fastapi import HTTPException

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def create_order(amount_inr: float, receipt: str, notes: dict = None) -> dict:
    """Create a Razorpay order. Amount in INR, converted to paise internally."""
    try:
        amount_paise = int(amount_inr * 100)  # Razorpay uses paise
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "notes": notes or {}
        }
        order = client.order.create(data=order_data)
        return {
            "order_id": order["id"],
            "amount": amount_inr,
            "amount_paise": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "status": order["status"],
            "razorpay_key": settings.RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create payment order: {str(e)}")


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify Razorpay webhook signature to confirm payment authenticity."""
    try:
        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
            f"{order_id}|{payment_id}".encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_signature, signature)
    except Exception:
        return False


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify Razorpay webhook event signature."""
    try:
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
            payload,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception:
        return False


def fetch_payment(payment_id: str) -> dict:
    """Fetch payment details from Razorpay."""
    try:
        payment = client.payment.fetch(payment_id)
        return {
            "id": payment["id"],
            "order_id": payment["order_id"],
            "amount": payment["amount"] / 100,  # Convert paise to INR
            "currency": payment["currency"],
            "status": payment["status"],
            "method": payment["method"],
            "email": payment.get("email"),
            "contact": payment.get("contact"),
            "created_at": payment["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Payment not found: {str(e)}")


def initiate_refund(payment_id: str, amount_inr: float = None, reason: str = "requested_by_customer") -> dict:
    """Initiate a refund for a payment."""
    try:
        refund_data = {"speed": "normal", "notes": {"reason": reason}}
        if amount_inr:
            refund_data["amount"] = int(amount_inr * 100)
        refund = client.payment.refund(payment_id, refund_data)
        return {
            "refund_id": refund["id"],
            "payment_id": refund["payment_id"],
            "amount": refund["amount"] / 100,
            "status": refund["status"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refund failed: {str(e)}")


def create_subscription_plan(plan_name: str, amount_inr: float, interval: str = "monthly") -> dict:
    """Create a subscription plan in Razorpay."""
    try:
        period_map = {"monthly": "monthly", "quarterly": "quarterly", "yearly": "yearly"}
        plan = client.plan.create({
            "period": period_map.get(interval, "monthly"),
            "interval": 1,
            "item": {
                "name": plan_name,
                "amount": int(amount_inr * 100),
                "currency": "INR",
                "description": f"Softmaster {plan_name} subscription"
            }
        })
        return {"plan_id": plan["id"], "name": plan_name, "amount": amount_inr}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create plan: {str(e)}")


def get_checkout_config(order_id: str, amount_inr: float, name: str, email: str, phone: str, description: str) -> dict:
    """Get complete Razorpay checkout configuration for frontend."""
    return {
        "key": settings.RAZORPAY_KEY_ID,
        "amount": int(amount_inr * 100),
        "currency": "INR",
        "name": "Softmaster Technology Solutions",
        "description": description,
        "image": "https://softmastertech.com/logo.png",
        "order_id": order_id,
        "prefill": {
            "name": name,
            "email": email,
            "contact": phone
        },
        "notes": {
            "company": "Softmaster Technology Solutions Pvt Ltd",
            "cin": "U78100TS2024PTC191444"
        },
        "theme": {
            "color": "#1e40af"
        }
    }
