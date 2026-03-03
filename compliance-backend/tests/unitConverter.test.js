const { normalizeToPercent } = require("../src/utils/unitConverter");

describe("Unit Converter", () => {
  test("returns percentage as-is", () => {
    expect(normalizeToPercent(50, "%")).toBe(50);
    expect(normalizeToPercent(0.05, "percent")).toBe(0.05);
    expect(normalizeToPercent(100, "percentage")).toBe(100);
  });

  test("converts ppm to percent", () => {
    expect(normalizeToPercent(10000, "ppm")).toBe(1);
    expect(normalizeToPercent(20, "ppm")).toBeCloseTo(0.002);
    expect(normalizeToPercent(1, "ppm")).toBeCloseTo(0.0001);
  });

  test("converts mg/kg to percent", () => {
    expect(normalizeToPercent(10000, "mg/kg")).toBe(1);
    expect(normalizeToPercent(500, "mg/kg")).toBeCloseTo(0.05);
  });

  test("is case-insensitive", () => {
    expect(normalizeToPercent(100, "PPM")).toBeCloseTo(0.01);
    expect(normalizeToPercent(50, " % ")).toBe(50);
  });

  test("throws on unsupported unit", () => {
    expect(() => normalizeToPercent(100, "g/L")).toThrow("Unsupported unit");
    expect(() => normalizeToPercent(100, "mol/L")).toThrow("Unsupported unit");
    expect(() => normalizeToPercent(100, "random")).toThrow("Unsupported unit");
  });
});
