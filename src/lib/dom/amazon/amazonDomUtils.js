import {
  PRODUCT_SELECTORS,
  QUERY_SELECTORS,
} from "../../../constants/selectors";
import { PRODUCT_DETAILS_KEYS } from "../../../constants/strings";
import {
  cleanAmazonProductURL,
  DomUtils,
  formatBSRData,
  getCleanTrackingURL,
  getGenerateURL,
  getProductPrices,
  hasKeyAndValue,
  logError,
  logWarn,
  toCamelCase,
} from "../../../utils";
import {
  extractAsinFromComponentProps,
  extractAsinFromUrl,
  extractBoughtPastMonth,
  extractColorVariants,
  extractWeightFromDimensions,
} from "./helpers/extractors";

/**
 * Utility for extracting Amazon product data from DOM elements
 * Follows best practices for error handling, performance, and clean code
 */
export const AmazonDomUtils = {
  /**
   * Finds all product containers in the current page
   * @returns {Node[]} Array of product container elements
   */
  findProductContainers() {
    try {
      return DomUtils.qsa(QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS);
    } catch (error) {
      logError("findProductContainers", error);
      return [];
    }
  },

  getProductCategory(element) {
    if (!element) return null;
    try {
      // Method 1: From data-csa-c-product-type attribute
      const el = DomUtils.qs(PRODUCT_SELECTORS.CATEGORIES.M_1, element);
      const type = el?.dataset?.csaCProductType;
      if (type) return type;

      // Method 2: Check badge supplementary text (most reliable)
      const badge = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.CATEGORIES.M_2
      );
      const match = badge?.match(/in (.+)/);
      if (match) return match[1].trim();

      // Method 3: Infer from URL keywords
      const url = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.CATEGORIES.M_3,
        PRODUCT_SELECTORS.HREF
      );
      const keywordMatch = url?.match(/keywords=([^&]+)/);
      if (keywordMatch) {
        return decodeURIComponent(match[1].replace(/\+/g, " "));
      }

      return null;
    } catch (error) {
      logError("getProductCategory", error);
      return null;
    }
  },

  getProductAsin(element) {
    if (!element) return null;

    try {
      // Method 1: From component props
      const el = DomUtils.qs(PRODUCT_SELECTORS.ASIN, element);
      const asinFromProps = extractAsinFromComponentProps(el);
      if (asinFromProps) return asinFromProps;

      // Method 2: From data-asin attribute
      const dataAsin = element.querySelector(
        QUERY_SELECTORS.SEARCH_PRODUCT_ATTRIBUTES
      )?.dataset?.asin;
      if (dataAsin) return dataAsin;

      // Method 3: From product URL
      const productUrl = this.getProductUrl(element);
      return extractAsinFromUrl(productUrl);
    } catch (error) {
      logError("getProductAsin", error);
      return null;
    }
  },

  getProductTitle(element) {
    if (!element) return null;
    return (
      DomUtils.getTextContent(element, PRODUCT_SELECTORS.TITLES.M_1) ||
      DomUtils.getTextContent(element, PRODUCT_SELECTORS.TITLES.M_2) ||
      DomUtils.getTextContent(element, PRODUCT_SELECTORS.TITLES.M_3)
    );
  },

  getProductReviews(element) {
    if (!element) return { rating: null, count: null };

    try {
      const ratingText = element.querySelector(
        PRODUCT_SELECTORS.RATINGS.RATING
      )?.textContent;
      const countText = element.querySelector(
        PRODUCT_SELECTORS.RATINGS.COUNT
      )?.textContent;

      return {
        rating: ratingText ? parseFloat(ratingText) : null,
        count: countText ? parseInt(countText.replace(/\D/g, ""), 10) : null,
      };
    } catch (error) {
      logError("getProductReviews", error);
      return { rating: null, count: null };
    }
  },

  getProductVariants(element) {
    if (!element) return { colors: null };

    return {
      colors: extractColorVariants(),
    };
  },

  getProductPerformance(element) {
    // Early return for null/undefined elements
    if (!element) return { boughtPastMonth: null, badge: null };

    try {
      // Use optional chaining and nullish coalescing for cleaner code
      const boughtEl = element.querySelector(
        PRODUCT_SELECTORS.PERFORMANCE.BOUGHT_PAST_MONTH
      );
      const boughtText = boughtEl?.textContent ?? null;

      const badgeEl = element.querySelector(
        PRODUCT_SELECTORS.PERFORMANCE.BADGE
      );
      const badge = badgeEl?.textContent?.trim() ?? null;

      return {
        boughtPastMonth: extractBoughtPastMonth(boughtText),
        badge,
      };
    } catch (error) {
      logError("getProductPerformance", error);
      // Maintain consistent return shape
      return { boughtPastMonth: null, badge: null };
    }
  },

  isPrimeEligible(element) {
    try {
      return !!element?.querySelector(PRODUCT_SELECTORS.IS_PRIME_ELIGIBLE);
    } catch (error) {
      logError("isPrimeEligible", error);
      return false;
    }
  },

  isProductSponsored(element) {
    if (!element) return false;
    try {
      const sponsorChecks = [
        () => DomUtils.qs(PRODUCT_SELECTORS.SPONSORS.M_1, element),
        () =>
          DomUtils.getTextContent(
            element,
            PRODUCT_SELECTORS.SPONSORS.M_2
          )?.includes("Sponsored Ad"),
        () => DomUtils.qsa(PRODUCT_SELECTORS.SPONSORS.M_3, element)?.length > 0,
        () => DomUtils.qsa(PRODUCT_SELECTORS.SPONSORS.M_4, element)?.length > 0,
      ];

      return sponsorChecks.some((check) => check());
    } catch (error) {
      logError("isProductSponsored", error);
      return false;
    }
  },

  getProductUrl(element) {
    if (!element) return null;
    try {
      const urlChecks = [
        () => DomUtils.qs(PRODUCT_SELECTORS.URLS.M_1, element)?.href,
        () =>
          DomUtils.getAttribute(
            element,
            PRODUCT_SELECTORS.URLS.M_2,
            PRODUCT_SELECTORS.HREF
          ),
        () =>
          DomUtils.getAttribute(
            element,
            PRODUCT_SELECTORS.URLS.M_3,
            PRODUCT_SELECTORS.HREF
          ),
        () => {
          const raw = DomUtils.getAttribute(
            element,
            PRODUCT_SELECTORS.URLS.M_4,
            PRODUCT_SELECTORS.HREF
          );
          return raw ? getCleanTrackingURL(getGenerateURL(raw)) : null;
        },
      ];

      const rawUrl = urlChecks.map((fn) => fn()).find(Boolean);
      return rawUrl ? getGenerateURL(rawUrl) : null;
    } catch (error) {
      logError("getProductUrl", error);
      return null;
    }
  },

  getUrls(element) {
    if (!element) return { productUrl: null, imageUrl: null, nicheUrl: null };

    try {
      const productUrl = this.getProductUrl(element);
      const imageElement = element.querySelector(PRODUCT_SELECTORS.IMAGE_URL);

      return {
        productUrl: cleanAmazonProductURL(productUrl),
        imageUrl:
          imageElement?.src ||
          imageElement?.getAttribute("srcset")?.split(",")[0]?.trim() ||
          null,
        nicheUrl: DomUtils.getPageUrl(),
      };
    } catch (error) {
      logError("getUrls", error);
      return { productUrl: null, imageUrl: null, nicheUrl: null };
    }
  },

  getProductDetailsFromList(details, element) {
    const labels = DomUtils.qsa("li span.a-text-bold", element);
    const listItems = DomUtils.qsa("li", element);

    PRODUCT_DETAILS_KEYS.forEach((key) => {
      const camelKey = toCamelCase(key);
      if (hasKeyAndValue(details, camelKey)) return;
      if (key === "Best Sellers Rank") {
        const rankItem = listItems.find((li) =>
          li.textContent.includes("Best Sellers Rank")
        );
        if (rankItem) {
          details[camelKey] = formatBSRData(rankItem.textContent.trim());
        }
        return;
      }

      const label = labels.find((li) => li.textContent.includes(key));
      const value = label?.nextElementSibling?.textContent?.trim();
      if (value) details[camelKey] = value;
    });
  },

  getProductDetailsFromTable(element) {
    const details = {};
    DomUtils.qsa(QUERY_SELECTORS.PRODUCT_DETAILS_TABLE, element).forEach(
      (row) => {
        const key = row.querySelector("th")?.textContent?.trim();
        const value = row.querySelector("td")?.textContent?.trim();
        if (!key && !value) return;

        if (PRODUCT_DETAILS_KEYS.includes(key)) {
          const camelKey = toCamelCase(key);
          details[camelKey] =
            camelKey === "bestSellersRank" ? formatBSRData(value) : value;
        }
      }
    );

    return details;
  },

  extractProductData(element) {
    if (!element || !(element instanceof HTMLElement)) {
      logWarn("Invalid product element provided");
      return null;
    }

    try {
      return {
        category: this.getProductCategory(element),
        asin: this.getProductAsin(element),
        title: this.getProductTitle(element),
        prices: getProductPrices(element),
        reviews: this.getProductReviews(element),
        variants: this.getProductVariants(element),
        performance: this.getProductPerformance(element),
        isPrime: this.isPrimeEligible(element),
        isSponsored: this.isProductSponsored(element),
        ...this.getUrls(element),
        element,
      };
    } catch (error) {
      logError("Error getting complete product data:", error);
      return null;
    }
  },

  extractProductDetails(element) {
    if (!element || !(element instanceof HTMLElement)) {
      logWarn("Invalid product details element provided");
      return null;
    }

    try {
      const details = this.getProductDetailsFromTable(element);
      this.getProductDetailsFromList(details, element);
      extractWeightFromDimensions(details);
      return details;
    } catch (error) {
      logError("Error getting complete product data:", error);
      return null;
    }
  },
};
