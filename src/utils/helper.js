import { SCRAPER_CONFIG } from "../constants/config";

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getGenerateURL(url) {
  return new URL(url, window.location.origin).href;
}

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
