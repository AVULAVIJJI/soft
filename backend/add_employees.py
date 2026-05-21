import sys
sys.path.insert(0, '.')
from app.core.database import SessionLocal
from app.models.user import User
from app.models.erp import Employee
from datetime import date

db = SessionLocal()

users = db.query(User).all()
for u in users:
    existing = db.query(Employee).filter(Employee.user_id == u.id).first()
    if not existing:
        emp = Employee(
            user_id=u.id,
            employee_id=f"EMP{u.id:03d}",
            department="General",
            designation=str(u.role).replace("UserRole.", "").replace("_", " ").title(),
            basic_salary=50000.0,
            date_of_joining=date.today(),
            is_active=True,
        )
        db.add(emp)
        print(f"Created employee: {u.full_name} -> EMP{u.id:03d}")
    else:
        print(f"Exists: {u.full_name} -> {existing.employee_id}")

db.commit()
db.close()
print("Done!")