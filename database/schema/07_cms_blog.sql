-- ============================================================
-- SOFTMASTER Enterprise Platform - CMS & Blog Schema
-- ============================================================

-- Site Settings (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_json JSONB,
    setting_type VARCHAR(50) DEFAULT 'text',
    label VARCHAR(200),
    "group" VARCHAR(100) DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200),
    company VARCHAR(200),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Companies (for website showcase)
CREATE TABLE IF NOT EXISTS client_companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sector VARCHAR(100),
    location VARCHAR(200),
    product_used VARCHAR(200),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
    id SERIAL PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    author_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    category VARCHAR(100),
    tags VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    read_time_minutes INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(300),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50) DEFAULT 'general',
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placement-specific tables
CREATE TABLE IF NOT EXISTS placement_drives (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_logo VARCHAR(500),
    drive_title VARCHAR(255),
    description TEXT,
    roles_offered TEXT,
    salary_package_lpa DECIMAL(10,2),
    eligibility_criteria TEXT,
    drive_date DATE,
    registration_deadline DATE,
    venue VARCHAR(255),
    status VARCHAR(50) DEFAULT 'upcoming',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS drive_registrations (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER REFERENCES placement_drives(id),
    student_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, student_id)
);

CREATE TABLE IF NOT EXISTS placed_students (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    package_lpa DECIMAL(10,2),
    joining_date DATE,
    drive_id INTEGER REFERENCES placement_drives(id),
    placed_at TIMESTAMPTZ DEFAULT NOW()
);
