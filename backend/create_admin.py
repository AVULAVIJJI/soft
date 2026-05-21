"""
Create Super Admin user for Softmaster Platform
Run: cd backend && python create_admin.py
"""
import sys
sys.path.insert(0, '.')

from passlib.context import CryptContext
from app.core.database import SessionLocal, engine, Base
from app.core.config import settings

# Import ALL models so tables get created
import app.models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    # Create all tables first
    Base.metadata.create_all(bind=engine)
    print("All database tables created/verified.")

    db = SessionLocal()
    try:
        from app.models.user import User, UserProfile, UserRole

        email = settings.SUPER_ADMIN_EMAIL
        password = settings.SUPER_ADMIN_PASSWORD
        name = settings.SUPER_ADMIN_NAME

        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Admin '{email}' already exists! You can login now.")
            print(f"  Role: {existing.role}")
            return

        hashed = pwd_context.hash(password)
        user = User(
            email=email,
            password_hash=hashed,
            full_name=name,
            role=UserRole.super_admin,
            is_active=True,
            is_verified=True,
        )
        db.add(user)
        db.flush()

        # Create profile
        db.add(UserProfile(user_id=user.id))
        from app.models.erp import Employee
        from datetime import date
        db.add(Employee(user_id=user.id, employee_id=f"EMP{user.id:03d}",
                        department="Management", designation="Super Admin",
                        basic_salary=100000, date_of_joining=date.today(), is_active=True))
        db.commit()
        db.refresh(user)

        print(f"Super Admin created successfully!")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        print(f"  Role: super_admin")
        print(f"  User ID: {user.id}")
    except Exception as e:
        db.rollback()
        print(f"Error creating admin: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
