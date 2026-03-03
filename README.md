# Product Compliance & Rejection Risk Analyzer

A pre-certification decision-support system that evaluates product formulations against regulatory standards, identifies compliance violations, and generates AI-powered risk assessments with professional PDF reports.

---

## 🎯 Problem Statement

Manufacturers face costly product rejections during BIS (Bureau of Indian Standards) certification due to non-compliant formulations. Current compliance checks are manual, error-prone, and lack structured risk assessment — leading to delayed time-to-market and financial losses.

## 💡 Solution

An automated compliance engine that:
- Validates product ingredient data against regulation-grade rules
- Detects violations (banned substances, exceeded limits, missing data)
- Computes rejection risk scores with severity-weighted aggregation
- Generates human-readable AI explanations and actionable recommendations
- Produces professional PDF compliance certificates

---

## 🏗️ Architecture

```
Frontend (React)
   ↓
API Layer (Express)
   ↓
Validation & Normalization Layer
   ↓
Generic Rule Engine (JS)
   ↓
Category Rule Loader (JSON)
   ↓
Risk Aggregation Engine
   ↓
AI Explanation Engine (Gemini)
   ↓
Report Generator (PDF)
   ↓
PostgreSQL
```

**Core Principle:** Logic is generic. Categories are data.

---

## 📌 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Frontend | React + HTML + CSS |
| Database | PostgreSQL |
| Rule Engine | Custom JS engine |
| Rules | JSON-based, data-driven |
| AI | Google Gemini (explanations & suggestions only) |
| Validation | Zod |
| Reports | PDFKit |

---

## 📁 Project Structure

```
compliance/
├── compliance-backend/
│   ├── rules/
│   │   └── soap.bis.json          # BIS regulation rules for soap
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   └── evaluateController.js  # Main evaluation pipeline
│   │   ├── routes/
│   │   │   └── apiRoutes.js       # API route definitions
│   │   ├── services/
│   │   │   ├── aiService.js       # Gemini AI explanation layer
│   │   │   ├── normalizationService.js  # Ingredient name resolution
│   │   │   ├── reportService.js   # PDF report generation
│   │   │   └── ruleEngine.js      # Generic rule engine + risk aggregation
│   │   ├── utils/
│   │   │   ├── unitConverter.js   # ppm/mg·kg ↔ % normalization
│   │   │   └── validationSchema.js    # Zod input validation
│   │   └── index.js               # Express server entry point
│   ├── package.json
│   └── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Google Gemini API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd compliance
   ```

2. **Install dependencies**
   ```bash
   cd compliance-backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and Gemini API key
   ```

4. **Setup database**
   - Create a PostgreSQL database named `compliance_db`
   - Run the seed SQL to populate substances and aliases

5. **Start the server**
   ```bash
   node src/index.js
   ```

---

## 📡 API Endpoints

### `POST /api/evaluate`
Evaluates a product's ingredient list against compliance rules.

**Request Body:**
```json
{
  "productName": "Premium Bath Soap",
  "category": "soap",
  "ingredients": [
    { "name": "TFM", "concentration": 78, "unit": "%" },
    { "name": "Sodium Hydroxide", "concentration": 0.03, "unit": "%" },
    { "name": "Triclosan", "concentration": 0.2, "unit": "%" }
  ]
}
```

**Response:** JSON compliance report with risk score, violations, and AI explanation.

### `POST /api/report`
Generates a downloadable PDF compliance certificate (same request body as above).

**Response:** PDF file stream.

---

## 🔒 Domain Scope (Current)

| Parameter | Value |
|---|---|
| Product Category | Soap (Toilet Soap) |
| Regulation | BIS IS 2888:2004 |
| Rule Types | MIN_LIMIT, MAX_LIMIT, BANNED, GROUP_MAX |
| Evaluation Outcomes | COMPLIANT, NON-COMPLIANT, NOT_EVALUATED |

---

## 📄 License

ISC
