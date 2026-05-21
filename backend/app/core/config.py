"""
Application Configuration - Reads from .env file
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets


class Settings(BaseSettings):
    APP_NAME: str = "Softmaster Technology Solutions"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_URL: str = "http://localhost:3000"
    API_URL: str = "http://localhost:8000"

    DATABASE_URL: str = "postgresql://softmaster_user:Softmaster@2024@localhost:5432/softmaster_db"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "softmaster_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres123"

    JWT_SECRET: str = secrets.token_urlsafe(64)
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    BREVO_API_KEY: str = ""
    SMTP_HOST: str = "smtp-relay.brevo.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@softmastertech.com"
    EMAIL_FROM_NAME: str = "Softmaster Technology Solutions"

    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    REDIS_URL: str = "redis://localhost:6379"

    SUPER_ADMIN_EMAIL: str = "admin@softmastertech.com"
    SUPER_ADMIN_PASSWORD: str = "Admin@Softmaster2024"
    SUPER_ADMIN_NAME: str = "Softmaster Admin"

    ALLOWED_HOSTS: str = "softmastertech.com,localhost,127.0.0.1,*"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:8000"

    COMPANY_NAME: str = "Softmaster Technology Solutions Pvt Ltd"
    COMPANY_ADDRESS: str = "12-18, Indira Nagar Colony, Peerzadiguda, Hyderabad, Telangana - 500039"
    COMPANY_PHONE: str = "+91 8500910044"
    COMPANY_EMAIL: str = "contact@softmastertech.com"

    def model_post_init(self, __context):
        """Auto-build DATABASE_URL from components to handle special chars."""
        from urllib.parse import quote_plus
        safe_password = quote_plus(self.DB_PASSWORD)
        self.DATABASE_URL = f"postgresql://{self.DB_USER}:{safe_password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def ALLOWED_HOSTS_LIST(self) -> List[str]:
        return [h.strip() for h in self.ALLOWED_HOSTS.split(",")]

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
