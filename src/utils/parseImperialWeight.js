/**
 * Parse an imperial weight string (e.g. "1.92 ounces", "3 lbs", etc.) into a
 * weight in kilograms, rounded to 2 decimal places.
 *
 * @param {string} weight - The string to parse
 * @returns {number|null} The parsed weight in kilograms, or null if parsing fails
 */
export function parseImperialWeightToKg(weight) {
  if (!weight) return null;

  // Remove invisible and directionality control characters
  const normalized = weight
    .replace(
      /[\u200B-\u200D\u00A0\uFEFF\u202A-\u202E\u2066-\u2069\u200E\u200F]/g,
      ""
    )
    .trim();

  const match = normalized.match(
    /^([\d.]+)\s*(kilograms?|kg|grams?|g|pounds?|lbs?|ounces?|oz)$/i
  );
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith("kilogram") || unit === "kg") {
    return Math.round(value * 100) / 100;
  }

  if (unit.startsWith("gram") || unit === "g") {
    return Math.round((value / 1000) * 100) / 100;
  }

  if (unit.startsWith("pound") || unit === "lb" || unit === "lbs") {
    return Math.round(value * 0.45359237 * 100) / 100;
  }

  if (unit.startsWith("ounce") || unit === "oz") {
    return Math.round((value / 16) * 0.45359237 * 100) / 100;
  }

  return null;
}
