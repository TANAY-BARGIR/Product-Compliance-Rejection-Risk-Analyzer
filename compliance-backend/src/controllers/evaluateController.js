// src/controllers/evaluateController.js
const { submissionSchema } = require("../utils/validationSchema");
const { resolveIngredient } = require("../services/normalizationService");
const { normalizeToPercent } = require("../utils/unitConverter");
const { evaluateCompliance } = require("../services/ruleEngine");
const { generateExplanation } = require("../services/aiService");
const { generatePDFReport } = require("../services/reportService");

/**
 * Endpoint: POST /api/evaluate
 * Returns: JSON Compliance Report with AI Explanation
 */
async function evaluateProduct(req, res) {
  try {
    const validatedData = submissionSchema.parse(req.body);
    console.log(`\n📦 Processing Product: ${validatedData.productName}`);

    const { normalizedIngredients, unknownIngredients } =
      await processIngredients(validatedData.ingredients);
    const complianceResult = evaluateCompliance(
      normalizedIngredients,
      unknownIngredients,
    );

    let aiSummary = "Product is fully compliant. No further action required.";
    if (complianceResult.status !== "COMPLIANT") {
      console.log("🤖 Generating AI Explanation...");
      aiSummary = await generateExplanation(complianceResult);
    }

    res.json({
      status: "success",
      message: "Evaluation completed",
      data: {
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
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * Endpoint: POST /api/report
 * Returns: PDF File Stream (Downloadable)
 */
async function getProductReport(req, res) {
  try {
    // 1. RE-EVALUATE
    const validatedData = submissionSchema.parse(req.body);
    console.log(`\n📄 Generating PDF for: ${validatedData.productName}`);

    const { normalizedIngredients, unknownIngredients } =
      await processIngredients(validatedData.ingredients);
    const complianceResult = evaluateCompliance(
      normalizedIngredients,
      unknownIngredients,
    );

    // 2. GENERATE AI SUMMARY
    let aiSummary = "Product is fully compliant.";
    if (complianceResult.status !== "COMPLIANT") {
      aiSummary = await generateExplanation(complianceResult);
    }
    complianceResult.ai_explanation = aiSummary;

    // 3. PREPARE DATA
    const reportData = {
      product: validatedData.productName,
      category: validatedData.category,
      compliance_report: complianceResult,
    };

    // 4. STREAM PDF RESPONSE
    const doc = generatePDFReport(reportData); // This function calls doc.end() internally!

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=compliance_report_${Date.now()}.pdf`,
    );

    doc.pipe(res);
    // REMOVED: doc.end(); <--- THIS WAS THE CAUSE OF THE ERROR
  } catch (error) {
    handleError(res, error);
  }
}

// --- HELPER FUNCTIONS ---

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
  res.status(500).json({ status: "error", message: "Internal Server Error" });
}

module.exports = { evaluateProduct, getProductReport };
