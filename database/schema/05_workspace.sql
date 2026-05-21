-- ERP Workspace Schema - Employees, Attendance, Leaves, Payroll
CREATE TYPE attendance_status AS ENUM ('present','absent','late','half_day','on_leave','holiday');
CREATE TYPE leave_status AS ENUM ('pending','approved','rejected','cancelled');
CREATE TYPE leave_type AS ENUM ('annual','sick','casual','maternity','paternity','unpaid');

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE REFERENCES users(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL, department VARCHAR(100),
    designation VARCHAR(100), employment_type VARCHAR(50) DEFAULT 'full_time',
    reporting_manager_id INTEGER REFERENCES employees(id),
    date_of_joining DATE, date_of_leaving DATE,
    basic_salary DECIMAL(12,2) DEFAULT 0,
    bank_account VARCHAR(50), bank_name VARCHAR(100),
    epf_number VARCHAR(50), etf_number VARCHAR(50),
    nic_number VARCHAR(20), emergency_contact VARCHAR(100), emergency_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_dept ON employees(department);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY, employee_id INTEGER NOT NULL REFERENCES employees(id),
    date DATE NOT NULL, check_in_time TIME, check_out_time TIME,
    status attendance_status DEFAULT 'present',
    work_hours DECIMAL(4,2) DEFAULT 0, overtime_hours DECIMAL(4,2) DEFAULT 0,
    notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);

CREATE TABLE IF NOT EXISTS leave_balances (
    id SERIAL PRIMARY KEY, employee_id INTEGER NOT NULL REFERENCES employees(id),
    year INTEGER NOT NULL, leave_type leave_type NOT NULL,
    entitled INTEGER DEFAULT 0, used DECIMAL(4,1) DEFAULT 0,
    remaining DECIMAL(4,1) DEFAULT 0,
    UNIQUE(employee_id, year, leave_type)
);

CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY, employee_id INTEGER NOT NULL REFERENCES employees(id),
    leave_type leave_type NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL,
    days_count DECIMAL(4,1) NOT NULL, reason TEXT, status leave_status DEFAULT 'pending',
    approved_by INTEGER REFERENCES employees(id),
    approved_at TIMESTAMPTZ, rejection_reason TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_leaves_employee ON leaves(employee_id);
CREATE INDEX idx_leaves_status ON leaves(status);

CREATE TABLE IF NOT EXISTS payroll_records (
    id SERIAL PRIMARY KEY, employee_id INTEGER NOT NULL REFERENCES employees(id),
    month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
    year INTEGER NOT NULL, basic_salary DECIMAL(12,2) DEFAULT 0,
    allowances DECIMAL(12,2) DEFAULT 0, overtime_pay DECIMAL(12,2) DEFAULT 0,
    bonuses DECIMAL(12,2) DEFAULT 0, gross_salary DECIMAL(12,2) DEFAULT 0,
    epf_employee DECIMAL(12,2) DEFAULT 0, epf_employer DECIMAL(12,2) DEFAULT 0,
    etf_employer DECIMAL(12,2) DEFAULT 0, income_tax DECIMAL(12,2) DEFAULT 0,
    other_deductions DECIMAL(12,2) DEFAULT 0, net_salary DECIMAL(12,2) DEFAULT 0,
    payment_date DATE, payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    status VARCHAR(50) DEFAULT 'pending', payslip_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, month, year)
);
CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_period ON payroll_records(year, month);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT,
    assigned_to INTEGER REFERENCES users(id), assigned_by INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    priority VARCHAR(20) DEFAULT 'medium', status VARCHAR(50) DEFAULT 'todo',
    due_date TIMESTAMPTZ, completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY, employee_id INTEGER REFERENCES employees(id),
    category VARCHAR(100), amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR', description TEXT,
    receipt_url VARCHAR(500), expense_date DATE,
    status VARCHAR(50) DEFAULT 'pending', approved_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, asset_code VARCHAR(50) UNIQUE,
    category VARCHAR(100), serial_number VARCHAR(100),
    assigned_to INTEGER REFERENCES employees(id),
    purchase_date DATE, purchase_cost DECIMAL(12,2),
    condition VARCHAR(50) DEFAULT 'good', notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
