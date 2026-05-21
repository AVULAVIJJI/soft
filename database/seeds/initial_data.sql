-- SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
-- Database Seed File - Initial Data
-- Run AFTER schema migration

-- Default Super Admin User
-- Password: Admin@Softmaster2024 (CHANGE IMMEDIATELY AFTER FIRST LOGIN)
INSERT INTO users (email, hashed_password, full_name, role, is_active, is_verified, phone)
VALUES (
    'admin@softmastertech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfbVK.Edt2T2A7Y2C3OPkJK',
    'Super Admin',
    'super_admin',
    TRUE,
    TRUE,
    '+94812204130'
) ON CONFLICT (email) DO NOTHING;

-- Demo HR User
INSERT INTO users (email, hashed_password, full_name, role, is_active, is_verified)
VALUES (
    'hr@softmastertech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfbVK.Edt2T2A7Y2C3OPkJK',
    'HR Manager',
    'hr',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Demo Trainer
INSERT INTO users (email, hashed_password, full_name, role, is_active, is_verified)
VALUES (
    'trainer@softmastertech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfbVK.Edt2T2A7Y2C3OPkJK',
    'Demo Trainer',
    'trainer',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Demo Student
INSERT INTO users (email, hashed_password, full_name, role, is_active, is_verified)
VALUES (
    'student@softmastertech.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJfbVK.Edt2T2A7Y2C3OPkJK',
    'Demo Student',
    'student',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Sample Course
INSERT INTO courses (title, description, level, price, category, status, instructor_id)
SELECT 
    'Python for Beginners',
    'Complete Python programming course from basics to advanced concepts.',
    'beginner',
    0.00,
    'Programming',
    'published',
    u.id
FROM users u WHERE u.email = 'trainer@softmastertech.com'
LIMIT 1;

-- Sample Job
INSERT INTO jobs (title, company, description, job_type, location, status, posted_by)
SELECT 
    'Junior Software Developer',
    'Softmaster Technology Solutions Pvt Ltd',
    'We are looking for a talented junior developer to join our team.',
    'full_time',
    'Kandy, Sri Lanka',
    'open',
    u.id
FROM users u WHERE u.email = 'admin@softmastertech.com'
LIMIT 1;

-- NOTE: The hashed password above = Admin@Softmaster2024
-- Generate a fresh hash with: python3 -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('YourNewPassword'))"
