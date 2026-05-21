"""
Softmaster Technology Solutions Pvt Ltd
Rate Limiter Middleware
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

# Simple in-memory rate limiter (use Redis in production for multi-worker)
request_counts: dict = defaultdict(list)
RATE_LIMIT = 200  # requests per minute per IP


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=1)

        # Clean old requests
        request_counts[client_ip] = [
            t for t in request_counts[client_ip] if t > window_start
        ]

        if len(request_counts[client_ip]) >= RATE_LIMIT:
            return JSONResponse(
                status_code=429,
                content={"error": "Too many requests. Please slow down."},
                headers={"Retry-After": "60"},
            )

        request_counts[client_ip].append(now)
        response = await call_next(request)
        return response
