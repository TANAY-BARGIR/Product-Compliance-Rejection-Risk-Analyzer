-- ============================================================
-- Schema for Product Compliance & Rejection Risk Analyzer
-- PostgreSQL  |  Multi-Category  |  v2.0
-- ============================================================

-- Drop existing tables in reverse-dependency order for clean reset
DROP TABLE IF EXISTS violations        CASCADE;
DROP TABLE IF EXISTS evaluations       CASCADE;
DROP TABLE IF EXISTS ingredient_limits CASCADE;
DROP TABLE IF EXISTS regulations       CASCADE;
DROP TABLE IF EXISTS product_ingredients CASCADE;
DROP TABLE IF EXISTS products          CASCADE;
DROP TABLE IF EXISTS substance_categories CASCADE;
DROP TABLE IF EXISTS substance_aliases CASCADE;
DROP TABLE IF EXISTS substances        CASCADE;


-- =========================
-- 1. SUBSTANCES
-- =========================
-- Master registry of all chemicals, parameters, and heavy metals
-- shared across every product category.

CREATE TABLE substances (
  id              SERIAL PRIMARY KEY,
  reference_code  VARCHAR(50)  UNIQUE NOT NULL,
  official_name   VARCHAR(200) NOT NULL,
  cas_number      VARCHAR(20),
  type            VARCHAR(50)  NOT NULL DEFAULT 'chemical'
                    CHECK (type IN ('chemical', 'parameter', 'heavy_metal')),
  created_at      TIMESTAMP    DEFAULT NOW()
);


-- =========================
-- 2. SUBSTANCE ALIASES
-- =========================
-- Alternate / trade names so users can type "Lye" instead of "Sodium Hydroxide".

CREATE TABLE substance_aliases (
  id              SERIAL PRIMARY KEY,
  substance_id    INTEGER      NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  alias_name      VARCHAR(200) NOT NULL,
  created_at      TIMESTAMP    DEFAULT NOW(),
  UNIQUE (substance_id, alias_name)
);


-- =========================
-- 3. SUBSTANCE ↔ CATEGORY
-- =========================
-- Junction table: which substances are relevant to which product categories.
-- e.g. Sodium Hydroxide → soap, shampoo
--      Mercury          → soap, cosmetics  (banned everywhere)

CREATE TABLE substance_categories (
  id              SERIAL PRIMARY KEY,
  substance_id    INTEGER      NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  category        VARCHAR(100) NOT NULL,
  UNIQUE (substance_id, category)
);


-- =========================
-- 4. PRODUCTS
-- =========================
-- Products submitted for compliance evaluation.

CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  product_name    VARCHAR(200) NOT NULL,
  category        VARCHAR(100) NOT NULL,
  manufacturer    VARCHAR(200),
  created_at      TIMESTAMP    DEFAULT NOW()
);


-- =========================
-- 5. PRODUCT INGREDIENTS
-- =========================
-- Raw ingredient list as declared by the manufacturer.

CREATE TABLE product_ingredients (
  id                  SERIAL PRIMARY KEY,
  product_id          INTEGER      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  substance_id        INTEGER      REFERENCES substances(id),
  raw_name            VARCHAR(200) NOT NULL,
  concentration       NUMERIC(10,4) NOT NULL,
  unit                VARCHAR(20)  NOT NULL,
  normalized_percent  NUMERIC(10,6)
);


-- =========================
-- 6. REGULATIONS
-- =========================
-- Regulatory standards (one row per standard version).

CREATE TABLE regulations (
  id              SERIAL PRIMARY KEY,
  standard_code   VARCHAR(50)  NOT NULL,
  standard_name   VARCHAR(200) NOT NULL,
  category        VARCHAR(100) NOT NULL,
  authority       VARCHAR(100) NOT NULL DEFAULT 'BIS',
  version         VARCHAR(20)  NOT NULL DEFAULT '1.0',
  effective_date  DATE,
  is_active       BOOLEAN      DEFAULT TRUE,
  created_at      TIMESTAMP    DEFAULT NOW()
);


-- =========================
-- 7. INGREDIENT LIMITS
-- =========================
-- Per-regulation substance limits / bans.

CREATE TABLE ingredient_limits (
  id              SERIAL PRIMARY KEY,
  regulation_id   INTEGER      NOT NULL REFERENCES regulations(id) ON DELETE CASCADE,
  substance_id    INTEGER      REFERENCES substances(id),
  rule_type       VARCHAR(20)  NOT NULL
                    CHECK (rule_type IN ('MIN_LIMIT', 'MAX_LIMIT', 'BANNED', 'GROUP_MAX')),
  limit_value     NUMERIC(10,4),
  unit            VARCHAR(20)  NOT NULL,
  severity        VARCHAR(20)  NOT NULL
                    CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
  description     TEXT
);


-- =========================
-- 8. EVALUATIONS
-- =========================
-- Result log — one row per product evaluation run.

CREATE TABLE evaluations (
  id                  SERIAL PRIMARY KEY,
  product_name        VARCHAR(200) NOT NULL,
  category            VARCHAR(100) NOT NULL,
  status              VARCHAR(30)  NOT NULL
                        CHECK (status IN ('COMPLIANT', 'NON-COMPLIANT', 'BORDERLINE', 'NOT_EVALUATED')),
  risk_score          INTEGER      NOT NULL DEFAULT 0,
  risk_level          VARCHAR(30)  NOT NULL,
  total_violations    INTEGER      DEFAULT 0,
  total_borderlines   INTEGER      DEFAULT 0,
  missing_data_count  INTEGER      DEFAULT 0,
  ai_explanation      TEXT,
  created_at          TIMESTAMP    DEFAULT NOW()
);


-- =========================
-- 9. VIOLATIONS
-- =========================
-- Individual rule failures recorded per evaluation.

CREATE TABLE violations (
  id              SERIAL PRIMARY KEY,
  evaluation_id   INTEGER      NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  rule_id         VARCHAR(20)  NOT NULL,
  rule_name       VARCHAR(200) NOT NULL,
  severity        VARCHAR(20)  NOT NULL,
  description     TEXT,
  limit_readable  VARCHAR(50),
  actual_percent  VARCHAR(50),
  created_at      TIMESTAMP    DEFAULT NOW()
);


-- =========================
-- INDEXES
-- =========================

-- Substances
CREATE INDEX idx_substances_reference  ON substances(reference_code);
CREATE INDEX idx_substances_cas        ON substances(cas_number);

-- Aliases
CREATE INDEX idx_aliases_name          ON substance_aliases(alias_name);
CREATE INDEX idx_aliases_substance     ON substance_aliases(substance_id);

-- Substance ↔ Category
CREATE INDEX idx_subcat_substance      ON substance_categories(substance_id);
CREATE INDEX idx_subcat_category       ON substance_categories(category);

-- Evaluations
CREATE INDEX idx_evaluations_category  ON evaluations(category);
CREATE INDEX idx_evaluations_status    ON evaluations(status);
CREATE INDEX idx_evaluations_created   ON evaluations(created_at DESC);

-- Violations
CREATE INDEX idx_violations_eval       ON violations(evaluation_id);
