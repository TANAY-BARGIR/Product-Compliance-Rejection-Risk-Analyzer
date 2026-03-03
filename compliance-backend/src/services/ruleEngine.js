// src/services/ruleEngine.js
const fs = require("fs");
const path = require("path");
const { normalizeToPercent } = require("../utils/unitConverter");

// Load Rules
const rulesPath = path.join(__dirname, "../../rules/soap.bis.json");
const ruleSet = JSON.parse(fs.readFileSync(rulesPath, "utf8"));

/**
 * Calculates 'Rejection Risk' based on Violations AND Missing Data.
 * Matches Phase 5: "Compute Severity score, Overall rejection risk"
 */
function calculateRisk(violations, unknownCount) {
  let score = 0;
  let reasons = [];

  // 1. Violation Risk
  for (const v of violations) {
    if (v.severity === "CRITICAL") {
      score += 100;
      reasons.push("Critical Regulation Failure");
    } else if (v.severity === "WARNING") {
      score += 15;
      reasons.push("Warning Limit Exceeded");
    }
  }

  // 2. Missing Data Risk (The Fix)
  if (unknownCount > 0) {
    score += unknownCount * 10; // +10% risk per unknown ingredient
    reasons.push("Unidentified Ingredients Detected");
  }

  // Cap the score
  score = Math.min(score, 100);

  // Determine Level
  let level = "LOW";
  if (score >= 100) level = "CRITICAL (REJECTED)";
  else if (score >= 50) level = "HIGH";
  else if (score > 0) level = "MODERATE";

  return { score, level, reasons: [...new Set(reasons)] }; // Unique reasons
}

/**
 * Evaluates compliance and aggregation.
 * Now accepts 'unknownIngredients' to fix the "False Negative" flaw.
 */
function evaluateCompliance(normalizedIngredients, unknownIngredients = []) {
  const violations = [];

  // 1. Create Lookup Map
  const ingredientMap = new Map();
  normalizedIngredients.forEach((item) => {
    ingredientMap.set(item.substance_id, item.value_percent);
  });

  // 2. Rule Execution (Phase 4 Logic)
  for (const rule of ruleSet.rules) {
    let isViolation = false;
    let actualValue = 0;
    const limitInPercent = normalizeToPercent(rule.limit, rule.unit);

    if (rule.type === "MIN_LIMIT") {
      actualValue = ingredientMap.get(rule.target_code) || 0;
      if (actualValue < limitInPercent) isViolation = true;
    } else if (rule.type === "MAX_LIMIT") {
      actualValue = ingredientMap.get(rule.target_code) || 0;
      if (actualValue > limitInPercent) isViolation = true;
    } else if (rule.type === "BANNED") {
      actualValue = ingredientMap.get(rule.target_code) || 0;
      if (actualValue > 0) isViolation = true;
    } else if (rule.type === "GROUP_MAX") {
      actualValue = 0;
      rule.targets.forEach((targetId) => {
        actualValue += ingredientMap.get(targetId) || 0;
      });
      if (actualValue > limitInPercent) isViolation = true;
    }

    if (isViolation) {
      violations.push({
        rule_id: rule.id,
        rule_name: rule.name,
        severity: rule.severity,
        description: rule.description,
        limit_readable: `${rule.limit} ${rule.unit}`,
        actual_percent: actualValue.toFixed(4) + "%",
      });
    }
  }

  // 3. Phase 5 Aggregation
  const riskAnalysis = calculateRisk(violations, unknownIngredients.length);

  // 4. Determine Logic Status (Phase 4 "Outcomes" Requirement)
  let status = "COMPLIANT";
  if (violations.length > 0) {
    status = "NON-COMPLIANT";
  } else if (unknownIngredients.length > 0) {
    status = "NOT_EVALUATED"; // Or 'UNCERTAIN' - Critical for safety
  }

  return {
    status,
    risk_score: riskAnalysis.score,
    risk_level: riskAnalysis.level,
    primary_reasons: riskAnalysis.reasons,
    standard: ruleSet.standard,
    total_violations: violations.length,
    missing_data_count: unknownIngredients.length,
    violations,
  };
}

module.exports = { evaluateCompliance };
