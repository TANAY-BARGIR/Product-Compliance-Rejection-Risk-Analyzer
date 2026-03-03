const fs = require("fs");
const path = require("path");
const { normalizeToPercent } = require("../utils/unitConverter");

const RULES_DIR = path.join(__dirname, "../../rules");

const RISK_WEIGHTS = {
  CRITICAL: 100,
  WARNING: 15,
  UNKNOWN_INGREDIENT: 10,
};

const BORDERLINE_THRESHOLD = 0.10;

function loadRules(category) {
  const rulesPath = path.join(RULES_DIR, `${category}.bis.json`);
  if (!fs.existsSync(rulesPath)) {
    throw new Error(`No rule file found for category: "${category}" (expected: ${rulesPath})`);
  }
  return JSON.parse(fs.readFileSync(rulesPath, "utf8"));
}

function getAvailableCategories() {
  const files = fs.readdirSync(RULES_DIR);
  return files
    .filter((f) => f.endsWith(".bis.json"))
    .map((f) => f.replace(".bis.json", ""));
}

function calculateRisk(violations, unknownCount) {
  let score = 0;
  let reasons = [];

  for (const v of violations) {
    const weight = RISK_WEIGHTS[v.severity] || 10;
    score += weight;
    if (v.severity === "CRITICAL") {
      reasons.push("Critical Regulation Failure");
    } else if (v.severity === "WARNING") {
      reasons.push("Warning Limit Exceeded");
    }
  }

  if (unknownCount > 0) {
    score += unknownCount * RISK_WEIGHTS.UNKNOWN_INGREDIENT;
    reasons.push("Unidentified Ingredients Detected");
  }

  score = Math.min(score, 100);

  let level = "LOW";
  if (score >= 100) level = "CRITICAL (REJECTED)";
  else if (score >= 50) level = "HIGH";
  else if (score > 0) level = "MODERATE";

  return { score, level, reasons: [...new Set(reasons)] };
}

function checkBorderline(actualValue, limitValue, ruleType) {
  if (ruleType === "BANNED") return false;
  const diff = Math.abs(actualValue - limitValue);
  const threshold = limitValue * BORDERLINE_THRESHOLD;
  if (ruleType === "MIN_LIMIT") {
    return actualValue >= limitValue && diff <= threshold;
  }
  if (ruleType === "MAX_LIMIT" || ruleType === "GROUP_MAX") {
    return actualValue <= limitValue && diff <= threshold;
  }
  return false;
}

function evaluateCompliance(normalizedIngredients, unknownIngredients = [], category = "soap") {
  const ruleSet = loadRules(category);
  const violations = [];
  const borderlines = [];

  const ingredientMap = new Map();
  normalizedIngredients.forEach((item) => {
    ingredientMap.set(item.substance_id, item.value_percent);
  });

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
    } else if (checkBorderline(actualValue, limitInPercent, rule.type)) {
      borderlines.push({
        rule_id: rule.id,
        rule_name: rule.name,
        description: rule.description,
        limit_readable: `${rule.limit} ${rule.unit}`,
        actual_percent: actualValue.toFixed(4) + "%",
        warning: "Value is within 10% of the regulatory limit",
      });
    }
  }

  const riskAnalysis = calculateRisk(violations, unknownIngredients.length);

  let status = "COMPLIANT";
  if (violations.length > 0) {
    status = "NON-COMPLIANT";
  } else if (borderlines.length > 0) {
    status = "BORDERLINE";
  } else if (unknownIngredients.length > 0) {
    status = "NOT_EVALUATED";
  }

  return {
    status,
    risk_score: riskAnalysis.score,
    risk_level: riskAnalysis.level,
    primary_reasons: riskAnalysis.reasons,
    standard: ruleSet.standard,
    total_violations: violations.length,
    total_borderlines: borderlines.length,
    missing_data_count: unknownIngredients.length,
    violations,
    borderlines,
  };
}

module.exports = { evaluateCompliance, getAvailableCategories, loadRules };
