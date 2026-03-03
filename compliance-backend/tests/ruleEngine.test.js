const { evaluateCompliance, getAvailableCategories, loadRules } = require("../src/services/ruleEngine");

describe("Rule Engine", () => {
  describe("getAvailableCategories", () => {
    test("returns soap as an available category", () => {
      const categories = getAvailableCategories();
      expect(categories).toContain("soap");
    });

    test("returns cookies as an available category", () => {
      const categories = getAvailableCategories();
      expect(categories).toContain("cookies");
    });
  });

  describe("loadRules", () => {
    test("loads soap rules successfully", () => {
      const rules = loadRules("soap");
      expect(rules.category).toBe("Toilet Soap");
      expect(rules.rules.length).toBe(10);
    });

    test("loads cookies rules successfully", () => {
      const rules = loadRules("cookies");
      expect(rules.category).toBe("Cookies & Biscuits");
    });

    test("throws on non-existent category", () => {
      expect(() => loadRules("nonexistent")).toThrow("No rule file found");
    });
  });

  describe("evaluateCompliance", () => {
    test("returns COMPLIANT when all rules pass", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 90 },
        { substance_id: "CAS-1310-73-2", value_percent: 0.02 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      expect(result.status).toBe("COMPLIANT");
      expect(result.total_violations).toBe(0);
      expect(result.risk_score).toBe(0);
    });

    test("returns NON-COMPLIANT when MIN_LIMIT is violated", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 50 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      expect(result.status).toBe("NON-COMPLIANT");
      expect(result.total_violations).toBeGreaterThan(0);
    });

    test("returns NON-COMPLIANT when BANNED substance is present", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 80 },
        { substance_id: "CAS-7439-97-6", value_percent: 0.001 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      expect(result.status).toBe("NON-COMPLIANT");
      expect(result.violations.some((v) => v.rule_name.includes("Mercury"))).toBe(true);
    });

    test("returns BORDERLINE when value is within 10% of limit", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 77 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      expect(result.total_borderlines).toBeGreaterThan(0);
    });

    test("returns NOT_EVALUATED when unknowns exist and no violations", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 90 },
      ];
      const result = evaluateCompliance(ingredients, ["UnknownSubstance"], "soap");
      expect(result.status).toBe("NOT_EVALUATED");
      expect(result.missing_data_count).toBe(1);
    });

    test("detects GROUP_MAX violations", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 80 },
        { substance_id: "CAS-7439-92-1", value_percent: 0.0015 },
        { substance_id: "CAS-7440-38-2", value_percent: 0.002 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      const groupViolation = result.violations.find((v) => v.rule_id === "R005");
      expect(groupViolation).toBeDefined();
    });

    test("works with cookies category (extensibility proof)", () => {
      const ingredients = [
        { substance_id: "PARAM-TRANSFAT", value_percent: 1.5 },
      ];
      const result = evaluateCompliance(ingredients, [], "cookies");
      expect(result.standard).toBe("FSSAI 2.11.10");
      expect(result.status).toBe("COMPLIANT");
    });

    test("risk score is capped at 100", () => {
      const ingredients = [
        { substance_id: "PARAM-TFM", value_percent: 10 },
        { substance_id: "CAS-7439-97-6", value_percent: 5 },
        { substance_id: "CAS-50-00-0", value_percent: 1 },
      ];
      const result = evaluateCompliance(ingredients, [], "soap");
      expect(result.risk_score).toBeLessThanOrEqual(100);
    });
  });
});
