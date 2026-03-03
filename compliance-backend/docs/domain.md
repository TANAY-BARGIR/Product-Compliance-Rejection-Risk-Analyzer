# Domain Lock — Phase 0

## Product Category
**Toilet Soap** — as defined by BIS IS 2888:2004

## Regulation Authority
**Bureau of Indian Standards (BIS)** — India

## Standard Reference
IS 2888:2004 — *Toilet Soaps — Specification*

---

## Identified Ingredients (10)

| # | Substance | CAS Number | Classification | Limit |
|---|---|---|---|---|
| 1 | Total Fatty Matter (TFM) | — | Allowed (Min) | ≥ 76% (Grade 1) |
| 2 | Sodium Hydroxide (NaOH) | 1310-73-2 | Restricted | ≤ 0.05% |
| 3 | Triclosan | 3380-34-5 | Restricted | ≤ 0.3% |
| 4 | Mercury | 7439-97-6 | **Banned** | 0% |
| 5 | Lead | 7439-92-1 | Restricted (Group) | ≤ 20 ppm (with Arsenic) |
| 6 | Arsenic | 7440-38-2 | Restricted (Group) | ≤ 20 ppm (with Lead) |
| 7 | Moisture Content | — | Allowed (Max) | ≤ 15% |
| 8 | Sodium Chloride (NaCl) | 7647-14-5 | Restricted | ≤ 1.0% |
| 9 | Formaldehyde | 50-00-0 | **Banned** | 0% |
| 10 | EDTA | 60-00-4 | Restricted | ≤ 0.1% |

**Bonus:** Rosin (CAS 8050-09-7) — Allowed up to 25%

---

## Rule Types Used

| Type | Description |
|---|---|
| `MIN_LIMIT` | Ingredient must be above threshold |
| `MAX_LIMIT` | Ingredient must be below threshold |
| `BANNED` | Zero tolerance — any amount = violation |
| `GROUP_MAX` | Sum of a group of substances must be below threshold |

---

## Known Exclusions

- This system evaluates **chemical composition only**, not physical properties (e.g., hardness, lather, shape).
- Cosmetic claims (e.g., "antibacterial", "moisturizing") are not validated.
- Fragrance and color additives are not part of the current rule set.
- The system does not handle batch-level variability or manufacturing tolerance.
- Only Indian BIS regulations are covered; EU/FDA rules are out of scope.

---

## Assumptions

1. All ingredient concentrations are provided by the manufacturer (self-declared).
2. Unit inputs are limited to `%`, `ppm`, and `mg/kg`.
3. The system is a **pre-certification decision-support tool**, not a legal certification authority.
4. AI-generated explanations are advisory only and cannot override deterministic rule outcomes.
5. Grade 1 soap is the default evaluation grade.
