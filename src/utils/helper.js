import { SCRAPER_CONFIG } from "../constants/config";

/**
 * Waits for the specified amount of time before resolving the promise.
 *
 * @param {number} ms The amount of time to wait in milliseconds.
 * @returns {Promise} A promise that resolves after the specified delay.
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a random integer between the specified minimum and maximum values.
 *
 * @param {number} min The minimum value of the range (inclusive).
 * @param {number} max The maximum value of the range (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a full URL string based on the provided relative or absolute URL.
 * If a relative URL is given, it is resolved against the current window origin.
 *
 * @param {string} url - The relative or absolute URL to generate the full URL from.
 * @returns {string} The fully qualified URL.
 */

export function getGenerateURL(url) {
  return new URL(url, window.location.origin).href;
}

/**
 * Takes a URL that may contain a tracking parameter and returns the cleaned URL,
 * or null if the input URL is invalid.
 *
 * This function handles URL strings that may be encoded and may contain a
 * tracking parameter. It extracts the non-tracking part of the URL, decodes it
 * (reversing any URL encoding), and returns the cleaned URL. If the input URL is
 * invalid or does not contain a tracking parameter, the function returns null.
 *
 * @param {string} url The URL to clean.
 * @returns {string|null} The cleaned URL or null if the input URL is invalid.
 */
export function getCleanTrackingURL(url) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const urlMatch = decodedUrl.match(/url=([^&]*)/);
    if (!urlMatch) return null;
    const cleanUrl = decodeURIComponent(urlMatch[1]);
    return getGenerateURL(cleanUrl);
  } catch (error) {
    console.error("Error processing URL:", error);
    return null;
  }
}

/**
 * Parses and cleans the "bought past month" count text into a numeric value.
 * Handles formats like "500", "5K", "1K+", etc., applying a buffer for '+' values.
 *
 * @param {string} countText - The raw count text to parse (e.g., "5K+")
 * @returns {number|null} - The parsed number or null if parsing fails
 */
export function getCleanBoughtPastMonth(countText) {
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
    console.error("Error processing bought past month:", error);
    return null;
  }
}
