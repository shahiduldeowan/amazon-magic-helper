/**
 * Parses a string like "1.54 pounds" or "1.6 ounces" and converts it to kilograms
 * @param weight - Weight string to parse
 * @returns Weight in kilograms (rounded to 2 decimals), or null if invalid
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

  const match = normalized.match(/^([\d.]+)\s*(pounds?|lbs?|ounces?|oz)$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith("pound") || unit === "lb" || unit === "lbs") {
    return Math.round(value * 0.45359237 * 100) / 100;
  }

  if (unit.startsWith("ounce") || unit === "oz") {
    return Math.round((value / 16) * 0.45359237 * 100) / 100;
  }

  return null;
}
