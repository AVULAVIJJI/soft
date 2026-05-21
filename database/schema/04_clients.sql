-- Client Portal and Payments Schema
CREATE TYPE project_status AS ENUM ('planning','active','on_hold','completed','cancelled');
CREATE TYPE ticket_priority AS ENUM ('low','medium','high','critical');

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY, client_id INTEGER NOT NULL REFERENCES users(id),
    project_manager_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL, description TEXT,
    status project_status DEFAULT 'planning',
    start_date DATE, end_date DATE, budget DECIMAL(12,2),
    amount_billed DECIMAL(12,2) DEFAULT 0, progress_percent INTEGER DEFAULT 0,
    github_url VARCHAR(500), staging_url VARCHAR(500), live_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY, ticket_number VARCHAR(20) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(id),
    client_id INTEGER NOT NULL REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    subject VARCHAR(255) NOT NULL, description TEXT,
    priority ticket_priority DEFAULT 'medium', status VARCHAR(50) DEFAULT 'open',
    resolved_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);
CREATE INDEX idx_tickets_client ON support_tickets(client_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id SERIAL PRIMARY KEY, ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL, attachment_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_documents (
    id SERIAL PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL, file_url VARCHAR(500) NOT NULL,
    file_size INTEGER, file_type VARCHAR(50), category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY, invoice_number VARCHAR(50) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(id),
    client_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL, tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL, currency VARCHAR(10) DEFAULT 'LKR',
    status VARCHAR(50) DEFAULT 'unpaid', due_date DATE, paid_at TIMESTAMPTZ,
    notes TEXT, invoice_url VARCHAR(500), created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
    invoice_id INTEGER REFERENCES invoices(id),
    amount DECIMAL(12,2) NOT NULL, currency VARCHAR(10) DEFAULT 'LKR',
    payment_method VARCHAR(50), razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100), status VARCHAR(50) DEFAULT 'pending',
    description TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, message TEXT, type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE, link VARCHAR(500), created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
