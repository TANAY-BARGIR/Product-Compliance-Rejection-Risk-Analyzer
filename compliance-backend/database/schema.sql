-- Schema for Product Compliance & Rejection Risk Analyzer
-- PostgreSQL

CREATE TABLE IF NOT EXISTS substances (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(50) UNIQUE NOT NULL,
  official_name VARCHAR(200) NOT NULL,
  cas_number VARCHAR(20),
  type VARCHAR(50) NOT NULL DEFAULT 'chemical',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS substance_aliases (
  id SERIAL PRIMARY KEY,
  substance_id INTEGER NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  alias_name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_ingredients (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  substance_id INTEGER REFERENCES substances(id),
  raw_name VARCHAR(200) NOT NULL,
  concentration NUMERIC(10,4) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  normalized_percent NUMERIC(10,6)
);

CREATE TABLE IF NOT EXISTS regulations (
  id SERIAL PRIMARY KEY,
  standard_code VARCHAR(50) NOT NULL,
  standard_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  effective_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredient_limits (
  id SERIAL PRIMARY KEY,
  regulation_id INTEGER NOT NULL REFERENCES regulations(id) ON DELETE CASCADE,
  substance_id INTEGER REFERENCES substances(id),
  rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('MIN_LIMIT', 'MAX_LIMIT', 'BANNED', 'GROUP_MAX')),
  limit_value NUMERIC(10,4),
  unit VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
  description TEXT
);

CREATE TABLE IF NOT EXISTS evaluations (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('COMPLIANT', 'NON-COMPLIANT', 'BORDERLINE', 'NOT_EVALUATED')),
  risk_score INTEGER NOT NULL DEFAULT 0,
  risk_level VARCHAR(30) NOT NULL,
  total_violations INTEGER DEFAULT 0,
  total_borderlines INTEGER DEFAULT 0,
  missing_data_count INTEGER DEFAULT 0,
  ai_explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS violations (
  id SERIAL PRIMARY KEY,
  evaluation_id INTEGER NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  rule_id VARCHAR(20) NOT NULL,
  rule_name VARCHAR(200) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  description TEXT,
  limit_readable VARCHAR(50),
  actual_percent VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_substances_reference ON substances(reference_code);
CREATE INDEX idx_substances_cas ON substances(cas_number);
CREATE INDEX idx_aliases_name ON substance_aliases(alias_name);
CREATE INDEX idx_evaluations_category ON evaluations(category);
CREATE INDEX idx_evaluations_status ON evaluations(status);
CREATE INDEX idx_evaluations_created ON evaluations(created_at DESC);
CREATE INDEX idx_violations_eval ON violations(evaluation_id);
