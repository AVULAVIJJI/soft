-- ============================================================
-- Softmaster Technology Solutions Pvt Ltd
-- Complete Database Initialization
-- CIN: U78100TS2024PTC191444
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

SET timezone = 'Asia/Kolkata';

-- Updated_at trigger function (must exist before schemas)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Load schemas in dependency order
\i /docker-entrypoint-initdb.d/schema/01_users.sql
\i /docker-entrypoint-initdb.d/schema/02_academy.sql
\i /docker-entrypoint-initdb.d/schema/03_jobs.sql
\i /docker-entrypoint-initdb.d/schema/04_clients.sql
\i /docker-entrypoint-initdb.d/schema/05_workspace.sql
\i /docker-entrypoint-initdb.d/schema/06_analytics.sql
\i /docker-entrypoint-initdb.d/schema/07_cms_blog.sql

COMMENT ON DATABASE softmaster_db IS 'Softmaster Technology Solutions Platform DB - CIN: U78100TS2024PTC191444';
