"""
Softmaster Technology Solutions Pvt Ltd
Audit Log Middleware
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import logging
import time

logger = logging.getLogger("audit")


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000

        # Log all API requests
        if request.url.path.startswith("/api/"):
            logger.info(
                f"{request.method} {request.url.path} "
                f"status={response.status_code} "
                f"duration={process_time:.2f}ms "
                f"ip={request.client.host if request.client else 'unknown'}"
            )

        return response
