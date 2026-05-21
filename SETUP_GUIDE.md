# Softmaster Technology Solutions - Complete Setup Guide

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Redis (optional)

---

## Step 1: PostgreSQL Database Setup

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE USER softmaster_user WITH PASSWORD 'Softmaster@2024';
CREATE DATABASE softmaster_db OWNER softmaster_user;
GRANT ALL PRIVILEGES ON DATABASE softmaster_db TO softmaster_user;
\c softmaster_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
\q
```

## Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# The .env file is already configured for local development
# Edit backend/.env if you need different database credentials

# Create all tables + Super Admin user
python create_admin.py

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be at: http://localhost:8000
Docs at: http://localhost:8000/docs

### Admin Login Credentials
- Email: admin@softmastertech.com
- Password: Admin@Softmaster2024

## Step 3: Frontend Setup

Each app runs on a different port:

```bash
# Install root dependencies
npm install

# Run any frontend app:
cd frontend/apps/website && npm install && npm run dev  # Port 3000
cd frontend/apps/academy && npm install && npm run dev  # Port 3001
cd frontend/apps/jobs && npm install && npm run dev     # Port 3002
cd frontend/apps/client && npm install && npm run dev   # Port 3003
cd frontend/apps/workspace && npm install && npm run dev # Port 3004
cd frontend/apps/employee && npm install && npm run dev  # Port 3005
cd frontend/apps/admin && npm install && npm run dev     # Port 3006
cd frontend/apps/placement && npm install && npm run dev # Port 3007
```

## Step 4: Verify Everything Works

1. Backend health: `curl http://localhost:8000/health`
2. API docs: Open http://localhost:8000/docs
3. Login test: POST to `/api/v1/auth/login` with admin credentials
4. Check tables: `psql -U softmaster_user -d softmaster_db -c "\dt"`

---

## Database Tables Created (auto by SQLAlchemy)

### Core
- users, user_profiles, sessions

### Academy
- courses, lessons, enrollments, student_progress
- assignments, assignment_submissions, quizzes, quiz_questions, certificates

### Jobs Portal
- jobs, job_applications, resumes, interviews

### Client Portal
- projects, support_tickets, ticket_replies, project_documents
- invoices, payments, notifications

### ERP/Workspace
- employees, attendance, leaves, payroll_records
- tasks, expenses

### CMS
- site_settings, testimonials, client_companies, services, faq_items
- blog_posts

### Placement
- placement_drives, drive_registrations, placed_students

---

## API Endpoints Summary

| Module | Prefix | Description |
|--------|--------|-------------|
| Auth | /api/v1/auth | Login, Register, Refresh, Password Reset |
| Users | /api/v1/users | User CRUD, Profile |
| Courses | /api/v1/courses | Course CRUD, Enroll, Lessons |
| Jobs | /api/v1/jobs | Job CRUD, Apply, Applications |
| Projects | /api/v1/projects | Projects, Tickets, Invoices |
| Attendance | /api/v1/attendance | Check-in/out, Leaves |
| Payroll | /api/v1/payroll | Salary, Payslips |
| Analytics | /api/v1/analytics | Dashboard stats |
| Notifications | /api/v1/notifications | User notifications |
| Blog | /api/v1/blog | Blog CRUD |
| CMS | /api/v1/cms | Settings, Testimonials, FAQs |
| Contact | /api/v1/contact | Contact form |
| Reports | /api/v1/reports | Reporting |
| Certificates | /api/v1/certificates | Certificates |
| Payments | /api/v1/payments | Razorpay integration |

## Data Flow

```
Frontend (Next.js) → Axios API Service → Backend (FastAPI)
                                              ↓
                                     SQLAlchemy ORM
                                              ↓
                                     PostgreSQL Database
```

All frontend apps share the same API service (frontend/services/api.ts) which:
- Attaches JWT token from localStorage
- Auto-refreshes expired tokens
- Redirects to /login on auth failure
