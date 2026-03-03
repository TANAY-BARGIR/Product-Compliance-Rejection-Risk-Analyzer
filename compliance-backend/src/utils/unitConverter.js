const SUPPORTED_UNITS = ["%", "percent", "percentage", "ppm", "mg/kg"];

function normalizeToPercent(value, unit) {
  const cleanUnit = unit.toLowerCase().trim();

  if (cleanUnit === "%" || cleanUnit === "percent" || cleanUnit === "percentage") {
    return parseFloat(value);
  }

  if (cleanUnit === "ppm" || cleanUnit === "mg/kg") {
    return parseFloat(value) / 10000;
  }

  throw new Error(
    `Unsupported unit: "${unit}". Supported units: ${SUPPORTED_UNITS.join(", ")}`
  );
}

module.exports = { normalizeToPercent, SUPPORTED_UNITS };
