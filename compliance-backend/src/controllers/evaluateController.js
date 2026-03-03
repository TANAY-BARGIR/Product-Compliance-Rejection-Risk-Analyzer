const { submissionSchema } = require("../utils/validationSchema");
const { resolveIngredient } = require("../services/normalizationService");
const { normalizeToPercent } = require("../utils/unitConverter");
const { evaluateCompliance } = require("../services/ruleEngine");
const { generateExplanation } = require("../services/aiService");
const { generatePDFReport } = require("../services/reportService");
const db = require("../config/db");

async function evaluateProduct(req, res) {
  try {
    const validatedData = submissionSchema.parse(req.body);
    console.log(`\n📦 Processing Product: ${validatedData.productName}`);

    const { normalizedIngredients, unknownIngredients } =
      await processIngredients(validatedData.ingredients);

    const complianceResult = evaluateCompliance(
      normalizedIngredients,
      unknownIngredients,
      validatedData.category
    );

    let aiSummary = "Product is fully compliant. No further action required.";
    if (complianceResult.status !== "COMPLIANT") {
      console.log("🤖 Generating AI Explanation...");
      aiSummary = await generateExplanation(complianceResult);
    }

    const responseData = {
      product: validatedData.productName,
      category: validatedData.category,
      normalization_summary: {
        resolved_count: normalizedIngredients.length,
        unknown_count: unknownIngredients.length,
        unknown_list: unknownIngredients,
      },
      compliance_report: {
        ...complianceResult,
        ai_explanation: aiSummary,
      },
    };

    await persistEvaluation(validatedData, complianceResult, aiSummary);

    res.json({
      status: "success",
      message: "Evaluation completed",
      data: responseData,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function getProductReport(req, res) {
  try {
    const validatedData = submissionSchema.parse(req.body);
    console.log(`\n📄 Generating PDF for: ${validatedData.productName}`);

    const { normalizedIngredients, unknownIngredients } =
      await processIngredients(validatedData.ingredients);

    const complianceResult = evaluateCompliance(
      normalizedIngredients,
      unknownIngredients,
      validatedData.category
    );

    let aiSummary = "Product is fully compliant.";
    if (complianceResult.status !== "COMPLIANT") {
      aiSummary = await generateExplanation(complianceResult);
    }
    complianceResult.ai_explanation = aiSummary;

    const reportData = {
      product: validatedData.productName,
      category: validatedData.category,
      compliance_report: complianceResult,
    };

    await persistEvaluation(validatedData, complianceResult, aiSummary);

    const doc = generatePDFReport(reportData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=compliance_report_${Date.now()}.pdf`
    );

    doc.pipe(res);
  } catch (error) {
    handleError(res, error);
  }
}

async function getEvaluationHistory(req, res) {
  try {
    const result = await db.query(
      `SELECT id, product_name, category, status, risk_score, risk_level, 
              total_violations, created_at 
       FROM evaluations 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    res.json({ status: "success", data: result.rows });
  } catch (error) {
    handleError(res, error);
  }
}

async function persistEvaluation(validatedData, complianceResult, aiSummary) {
  try {
    const evalResult = await db.query(
      `INSERT INTO evaluations 
        (product_name, category, status, risk_score, risk_level, total_violations, total_borderlines, missing_data_count, ai_explanation) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id`,
      [
        validatedData.productName,
        validatedData.category,
        complianceResult.status,
        complianceResult.risk_score,
        complianceResult.risk_level,
        complianceResult.total_violations,
        complianceResult.total_borderlines || 0,
        complianceResult.missing_data_count,
        aiSummary,
      ]
    );

    const evalId = evalResult.rows[0].id;

    for (const v of complianceResult.violations) {
      await db.query(
        `INSERT INTO violations 
          (evaluation_id, rule_id, rule_name, severity, description, limit_readable, actual_percent) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [evalId, v.rule_id, v.rule_name, v.severity, v.description, v.limit_readable, v.actual_percent]
      );
    }

    console.log(`💾 Evaluation persisted with ID: ${evalId}`);
  } catch (error) {
    console.error("⚠️ Failed to persist evaluation:", error.message);
  }
}

async function processIngredients(ingredients) {
  const normalizedIngredients = [];
  const unknownIngredients = [];

  for (const item of ingredients) {
    const substance = await resolveIngredient(item.name);

    if (substance) {
      const percentValue = normalizeToPercent(item.concentration, item.unit);
      normalizedIngredients.push({
        input_name: item.name,
        substance_id: substance.reference_code,
        official_name: substance.official_name,
        type: substance.type,
        value_percent: percentValue,
      });
    } else {
      unknownIngredients.push(item.name);
    }
  }
  return { normalizedIngredients, unknownIngredients };
}

function handleError(res, error) {
  if (error.name === "ZodError") {
    return res.status(400).json({ status: "error", errors: error.errors });
  }
  console.error(error);
  res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
}

module.exports = { evaluateProduct, getProductReport, getEvaluationHistory };
