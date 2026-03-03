-- ============================================================
-- Seed Data for Compliance Analyzer  |  v2.0
-- Covers: Soap (BIS IS 2888:2004), Cookies (FSSAI 2.11.10)
-- Extensible for: Shampoo, Lotion, Sunscreen, etc.
-- ============================================================


-- =========================
-- SUBSTANCES  (18 total)
-- =========================

-- Soap substances
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-TFM', 'Total Fatty Matter', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-1310-73-2', 'Sodium Hydroxide', '1310-73-2', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-3380-34-5', 'Triclosan', '3380-34-5', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7439-97-6', 'Mercury', '7439-97-6', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7439-92-1', 'Lead', '7439-92-1', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7440-38-2', 'Arsenic', '7440-38-2', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-MOISTURE', 'Moisture Content', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7647-14-5', 'Sodium Chloride', '7647-14-5', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-50-00-0', 'Formaldehyde', '50-00-0', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-60-00-4', 'Ethylenediaminetetraacetic Acid', '60-00-4', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-8050-09-7', 'Rosin', '8050-09-7', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- Substances from old DB (Glycerin, Titanium Dioxide, Phosphate)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-56-81-5', 'Glycerin', '56-81-5', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-13463-67-7', 'Titanium Dioxide', '13463-67-7', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-14265-44-2', 'Phosphate', '14265-44-2', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- Cookies-specific substances
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-TRANSFAT', 'Trans Fat', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-1162-65-8', 'Aflatoxin B1', '1162-65-8', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-108-78-1', 'Melamine', '108-78-1', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-ASH', 'Acid Insoluble Ash', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;


-- =========================
-- SUBSTANCE ALIASES  (25+)
-- =========================

-- TFM aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'TFM' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Fatty Matter' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Total Fatty Matter' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Sodium Hydroxide aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Lye' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Caustic Soda' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'NaOH' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Triclosan aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Irgasan' FROM substances WHERE reference_code = 'CAS-3380-34-5'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Moisture aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Moisture' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Water Content' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Sodium Chloride aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Salt' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Table Salt' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'NaCl' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Formaldehyde aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Formalin' FROM substances WHERE reference_code = 'CAS-50-00-0'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- EDTA aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'EDTA' FROM substances WHERE reference_code = 'CAS-60-00-4'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Rosin aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Colophony' FROM substances WHERE reference_code = 'CAS-8050-09-7'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Glycerin aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Glycerol' FROM substances WHERE reference_code = 'CAS-56-81-5'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Titanium Dioxide aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'TiO2' FROM substances WHERE reference_code = 'CAS-13463-67-7'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Trans Fat aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Trans Fatty Acid' FROM substances WHERE reference_code = 'PARAM-TRANSFAT'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'TFA' FROM substances WHERE reference_code = 'PARAM-TRANSFAT'
ON CONFLICT (substance_id, alias_name) DO NOTHING;

-- Acid Insoluble Ash aliases
INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Ash' FROM substances WHERE reference_code = 'PARAM-ASH'
ON CONFLICT (substance_id, alias_name) DO NOTHING;


-- =========================
-- SUBSTANCE ↔ CATEGORY
-- =========================

-- Soap-relevant substances
INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-3380-34-5'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-7439-97-6'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-7439-92-1'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-7440-38-2'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-50-00-0'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-60-00-4'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-8050-09-7'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-56-81-5'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-13463-67-7'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'soap' FROM substances WHERE reference_code = 'CAS-14265-44-2'
ON CONFLICT (substance_id, category) DO NOTHING;

-- Cookies-relevant substances
INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'PARAM-TRANSFAT'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'CAS-1162-65-8'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'CAS-108-78-1'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'PARAM-ASH'
ON CONFLICT (substance_id, category) DO NOTHING;

-- Cross-category substances (heavy metals are banned globally)
INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'CAS-7439-92-1'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'CAS-7440-38-2'
ON CONFLICT (substance_id, category) DO NOTHING;

INSERT INTO substance_categories (substance_id, category)
SELECT id, 'cookies' FROM substances WHERE reference_code = 'CAS-7439-97-6'
ON CONFLICT (substance_id, category) DO NOTHING;


-- =========================
-- REGULATIONS
-- =========================

INSERT INTO regulations (standard_code, standard_name, category, authority, version, effective_date, is_active)
VALUES ('IS-2888-2004', 'BIS IS 2888:2004 - Toilet Soaps', 'soap', 'BIS', '1.0', '2004-01-01', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO regulations (standard_code, standard_name, category, authority, version, effective_date, is_active)
VALUES ('FSSAI-2.11.10', 'FSSAI 2.11.10 - Cookies & Biscuits', 'cookies', 'FSSAI', '1.0', '2020-01-01', TRUE)
ON CONFLICT DO NOTHING;
