-- Jobs Portal Schema
CREATE TYPE job_type AS ENUM ('full_time','part_time','contract','internship','remote');
CREATE TYPE application_status AS ENUM ('applied','screening','interview','offered','hired','rejected','withdrawn');

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, company_name VARCHAR(255),
    department VARCHAR(100), location VARCHAR(255), job_type job_type DEFAULT 'full_time',
    description TEXT, requirements TEXT, responsibilities TEXT,
    salary_min DECIMAL(10,2), salary_max DECIMAL(10,2), salary_currency VARCHAR(10) DEFAULT 'LKR',
    experience_min INTEGER DEFAULT 0, experience_max INTEGER, skills_required TEXT,
    posted_by INTEGER REFERENCES users(id), is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE, deadline TIMESTAMPTZ,
    total_applications INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_type ON jobs(job_type);

CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url VARCHAR(500), cover_letter TEXT,
    status application_status DEFAULT 'applied', notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ,
    UNIQUE(job_id, applicant_id)
);
CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX idx_applications_status ON job_applications(status);

CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    resume_url VARCHAR(500), parsed_data TEXT, skills TEXT,
    experience_years INTEGER DEFAULT 0, education TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY, application_id INTEGER NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL, duration_minutes INTEGER DEFAULT 60,
    interview_type VARCHAR(50) DEFAULT 'video', meeting_link VARCHAR(500),
    notes TEXT, feedback TEXT, rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    status VARCHAR(50) DEFAULT 'scheduled', created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS placements (
    id SERIAL PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL, job_title VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2), placement_date DATE, is_verified BOOLEAN DEFAULT FALSE,
    notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_placements_student ON placements(student_id);
