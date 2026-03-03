/**
 * Normalizes any concentration value to Percentage (%).
 * * Rules:
 * - 1 ppm = 0.0001%
 * - 1 mg/kg = 0.0001% (Same as ppm)
 * - 1 % = 1 %
 * * @param {number} value - The numerical amount
 * @param {string} unit - The unit (ppm, %, mg/kg)
 * @returns {number} - The value converted to %
 */
function normalizeToPercent(value, unit) {
  const cleanUnit = unit.toLowerCase().trim();

  if (cleanUnit === '%' || cleanUnit === 'percent' || cleanUnit === 'percentage') {
    return parseFloat(value);
  }

  if (cleanUnit === 'ppm' || cleanUnit === 'mg/kg') {
    // Conversion: ppm / 10000 = %
    return parseFloat(value) / 10000;
  }

  // Fallback (Assumes % if unit is weird, but ideally validation catches this)
  return parseFloat(value);
}

module.exports = { normalizeToPercent };
