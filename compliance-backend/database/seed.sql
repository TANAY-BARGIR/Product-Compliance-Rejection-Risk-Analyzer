-- Seed data for Soap (BIS IS 2888:2004)
-- 10 Substances: Allowed, Restricted, and Banned

-- 1. Total Fatty Matter (Parameter)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-TFM', 'Total Fatty Matter', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;

-- 2. Sodium Hydroxide (Restricted)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-1310-73-2', 'Sodium Hydroxide', '1310-73-2', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- 3. Triclosan (Restricted)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-3380-34-5', 'Triclosan', '3380-34-5', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- 4. Mercury (Banned)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7439-97-6', 'Mercury', '7439-97-6', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

-- 5. Lead (Restricted - Group)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7439-92-1', 'Lead', '7439-92-1', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

-- 6. Arsenic (Restricted - Group)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7440-38-2', 'Arsenic', '7440-38-2', 'heavy_metal')
ON CONFLICT (reference_code) DO NOTHING;

-- 7. Moisture (Parameter)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('PARAM-MOISTURE', 'Moisture Content', NULL, 'parameter')
ON CONFLICT (reference_code) DO NOTHING;

-- 8. Sodium Chloride (Restricted)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-7647-14-5', 'Sodium Chloride', '7647-14-5', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- 9. Formaldehyde (Banned)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-50-00-0', 'Formaldehyde', '50-00-0', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- 10. EDTA (Restricted)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-60-00-4', 'Ethylenediaminetetraacetic Acid', '60-00-4', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;

-- 11. Rosin (Allowed up to limit)
INSERT INTO substances (reference_code, official_name, cas_number, type)
VALUES ('CAS-8050-09-7', 'Rosin', '8050-09-7', 'chemical')
ON CONFLICT (reference_code) DO NOTHING;


-- Aliases for common/trade names

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'TFM' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Fatty Matter' FROM substances WHERE reference_code = 'PARAM-TFM'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Lye' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Caustic Soda' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'NaOH' FROM substances WHERE reference_code = 'CAS-1310-73-2'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Irgasan' FROM substances WHERE reference_code = 'CAS-3380-34-5'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Moisture' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Water Content' FROM substances WHERE reference_code = 'PARAM-MOISTURE'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Salt' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'NaCl' FROM substances WHERE reference_code = 'CAS-7647-14-5'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Formalin' FROM substances WHERE reference_code = 'CAS-50-00-0'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'EDTA' FROM substances WHERE reference_code = 'CAS-60-00-4'
ON CONFLICT DO NOTHING;

INSERT INTO substance_aliases (substance_id, alias_name)
SELECT id, 'Colophony' FROM substances WHERE reference_code = 'CAS-8050-09-7'
ON CONFLICT DO NOTHING;


-- Regulation entry

INSERT INTO regulations (standard_code, standard_name, category, version, effective_date, is_active)
VALUES ('IS-2888-2004', 'BIS IS 2888:2004 - Toilet Soaps', 'soap', '1.0', '2004-01-01', TRUE)
ON CONFLICT DO NOTHING;
