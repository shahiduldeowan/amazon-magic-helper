import { SCRAPER_CONFIG } from "../../../constants/config";
import { hasKeyAndValue, logError } from "../../../utils";

/**
 * Extracts color variant information from a HTML element.
 *
 * @param {HTMLElement} element - HTML element to search for color variant
 *   information in.
 * @returns {Object<string, number|string>|null} Extracted color variant
 *   information or null if not found. The object has two properties: `count`
 *   (number) and `text` (string). The `count` property is the number of
 *   variants, and the `text` property is the text content of the element.
 */
export function extractColorVariants(element) {
  if (!element) return null;
  try {
    const content = element?.textContent?.trim();
    if (!content) return null;

    const match = content.match(/\+(\d+)/);
    return {
      count: match?.[1] ? parseInt(match[1], 10) : null,
      text: content,
    };
  } catch (error) {
    logError("extractColorVariants", error);
    return null;
  }
}

/**
 * Extracts and processes the "Bought in the past month" count from a HTML
 * element's text content.
 *
 * @param {string} countText - Text content of the HTML element.
 * @returns {number|null} Extracted and processed count or null if not found.
 *   The returned count is always an integer, and is rounded up if the
 *   original text content has a "+" symbol.
 */
export function extractBoughtPastMonth(countText) {
  try {
    if (!countText?.trim()) return null;

    const [firstToken] = countText.split(" ");
    if (!firstToken) return null;

    const match = firstToken.match(/^(\d+)(K)?(\+)?$/);
    if (!match) return null;

    let count = parseFloat(match[1], 10);
    if (isNaN(count)) return null;

    if (match[2] === "K") count *= 1000;
    if (match[3] === "+") {
      if (typeof SCRAPER_CONFIG?.PURCHASE_FREQUENCY_BUFFER !== "number") {
        throw new Error("Invalid SCRAPER_CONFIG.PURCHASE_FREQUENCY_BUFFER");
      }
      count = Math.round(count * SCRAPER_CONFIG.PURCHASE_FREQUENCY_BUFFER);
    }

    return count;
  } catch (error) {
    logError("extractBoughtPastMonth", error);
    return null;
  }
}

/**
 * Extracts weight and dimensions from the 'productDimensions' field and assigns
 * them to 'itemWeight' and 'productDimensions' fields in the details object.
 *
 * If 'itemWeight' is not already present and 'productDimensions' exists in the
 * details object, this function attempts to parse the weight and dimensions from
 * the 'productDimensions' string. It updates the details object with the parsed
 * 'itemWeight' and normalized 'productDimensions' values.
 *
 * @param {Object} details - The details object containing product information.
 * @returns {void} Modifies the details object in place.
 */
export function extractWeightFromDimensions(details) {
  try {
    if (
      !hasKeyAndValue(details, "itemWeight") &&
      hasKeyAndValue(details, "productDimensions")
    ) {
      const dimensionsMatch = details.productDimensions?.match(
        /^([\d.]+\s*x\s*[\d.]+\s*x\s*[\d.]+\s*\w+)/
      );
      const weightMatch = details.productDimensions?.match(
        /([\d.]+\s*\w+)(?:;|$)/g
      );

      const dimensions = dimensionsMatch?.[1]?.trim();
      const weight = weightMatch?.[1]?.trim();

      if (dimensions && weight) {
        details["itemWeight"] = weight;
        details["productDimensions"] = dimensions;
      }
    }
  } catch (error) {
    logError("extractWeightFromDimensions", error);
  }
}
