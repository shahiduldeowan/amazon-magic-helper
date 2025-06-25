import { PRODUCT_SELECTORS } from "../constants/selectors";
import { logError } from "./loggerUtils";

function parsePriceFromElement(parent, selector) {
  try {
    const textContent = parent.querySelector(selector)?.textContent?.trim();
    if (!textContent) return null;

    const price = parseFloat(textContent.replace(/[^\d.-]/g, ""));
    return isNaN(price) ? null : price;
  } catch (error) {
    logError(`parsePriceFromElement ${selector}:`, error);
    return null;
  }
}

export function getProductPrices(element) {
  if (!element) return null;

  try {
    const currentPrice =
      parsePriceFromElement(PRODUCT_SELECTORS.PRICES.CURRENT) ||
      parsePriceFromElement(PRODUCT_SELECTORS.PRICES.CURRENT_FALLBACK);

    const listPrice =
      parsePriceFromElement(PRODUCT_SELECTORS.PRICES.LIST) ||
      parsePriceFromElement(PRODUCT_SELECTORS.PRICES.LIST_1);

    if (currentPrice === null) return null;

    return {
      current: currentPrice,
      list: listPrice,
      discount:
        listPrice && currentPrice
          ? Math.round(((listPrice - currentPrice) / listPrice) * 100)
          : null,
    };
  } catch (error) {
    logError("getProductPrices", error);
    return null;
  }
}
