import { logError } from "./loggerUtils";

export function getGenerateURL(url) {
  if (!url) return null;
  return new URL(url, window.location.origin).href;
}

export function getCleanTrackingURL(url) {
  if (!url) return null;
  try {
    const decodedUrl = decodeURIComponent(url);
    const urlMatch = decodedUrl?.match(/url=([^&]*)/);
    if (!urlMatch) return null;
    const cleanUrl = decodeURIComponent(urlMatch[1]);
    return getGenerateURL(cleanUrl);
  } catch (error) {
    logError("Error processing URL:", error);
    return null;
  }
}

export function cleanAmazonProductURL(url) {
  try {
    const asinMatch = url?.match(/\/dp\/([A-Z0-9]{10})/i);
    if (!asinMatch) return null;
    const asin = asinMatch[1];
    return getGenerateURL(`/dp/${asin}`);
  } catch (error) {
    logError("URL cleaning failed:", error);
    return null;
  }
}
