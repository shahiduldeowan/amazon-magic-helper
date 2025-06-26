import { PRODUCT_SELECTORS, QUERY_SELECTORS } from "../../constants/selectors";
import { PRODUCT_DETAILS_KEYS } from "../../constants/strings";
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
} from "../../utils";
import {
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
      const methods = [
        () => {
          const el = DomUtils.qs(PRODUCT_SELECTORS.CATEGORIES.M_1, element);
          if (!el) return null;
          return el?.dataset?.csaCProductType;
        },
        () => {
          const text = DomUtils.getTextContent(
            element,
            PRODUCT_SELECTORS.CATEGORIES.M_2
          );
          if (!text) return null;
          return text?.match(/in (.+)/)?.[1]?.trim();
        },
        () => {
          const url = DomUtils.getAttribute(
            element,
            PRODUCT_SELECTORS.CATEGORIES.M_3,
            PRODUCT_SELECTORS.HREF
          );

          if (!url) return null;
          if (!url.includes("keywords=")) return null;

          const match = url.match(/keywords=([^&]+)/);
          if (match) {
            return decodeURIComponent(match[1].replace(/\+/g, " "));
          }
        },
      ];

      for (const method of methods) {
        const category = method();
        if (category) return category;
      }

      return null;
    } catch (error) {
      logError("Error getting product category:", error);
      return null;
    }
  },

  /**
   * Extracts ASIN from product element using multiple fallback methods
   * @param {HTMLElement} element - Product container element
   * @returns {string|null} ASIN or null if not found
   */
  getProductAsin(element) {
    if (!element) return null;

    try {
      const methods = [
        () => {
          const el = DomUtils.qs(PRODUCT_SELECTORS.ASIN, element);
          if (!el) return null;
          return el?.dataset?.componentProps?.match(/"asin":"(.*?)"/);
        },
        () => {
          const el = DomUtils.qs(
            QUERY_SELECTORS.SEARCH_PRODUCT_ATTRIBUTES,
            element
          );
          if (!el) return null;
          return el?.dataset?.asin;
        },
        () => {
          const url = this.getProductUrl(element);
          if (!url) return null;
          return url?.match(/\/dp\/([A-Z0-9]{10})/)?.[1];
        },
      ];

      for (const method of methods) {
        const asin = method();
        if (asin) return asin;
      }

      return null;
    } catch (error) {
      logError("Error extracting ASIN:", error);
      return null;
    }
  },

  getProductTitle(element) {
    if (!element) return null;
    if (!DomUtils.isElement(element)) return null;
    const selectors = [
      PRODUCT_SELECTORS.TITLES.M_1,
      PRODUCT_SELECTORS.TITLES.M_2,
      PRODUCT_SELECTORS.TITLES.M_3,
    ];
    for (const selector of selectors) {
      const text = DomUtils.getTextContent(element, selector);
      if (text) return text;
    }
    return null;
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
      colors: extractColorVariants(element),
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

  /**
   * Gets the product URL from a product container element.
   * @param {HTMLElement} element - The product container element.
   * @returns {string|null} The product URL or null if not found.
   */
  getProductUrl(element) {
    if (!element) return null;
    try {
      // First try: Get the URL from the title link
      const titleLink =
        element.querySelector(PRODUCT_SELECTORS.URLS.M_1)?.href || null;
      if (titleLink) {
        return getGenerateURL(titleLink);
      }

      // Second try: Get the URL from the main product link
      const mainLink = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.URLS.M_2,
        PRODUCT_SELECTORS.HREF
      );
      if (mainLink) {
        return getGenerateURL(mainLink);
      }

      // Third try: Get the URL from the any product link
      const productLink = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.URLS.M_3,
        PRODUCT_SELECTORS.HREF
      );
      if (productLink) {
        return getGenerateURL(productLink);
      }

      // Fourth try: Get the URL from the title recipe link
      const titleRecipeLink = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.URLS.M_4,
        PRODUCT_SELECTORS.HREF
      );
      if (titleRecipeLink) {
        const trackingUrl = getGenerateURL(titleRecipeLink);
        const cleanUrl = getCleanTrackingURL(trackingUrl);
        if (cleanUrl) return cleanUrl;
      }

      // Fifth try: More specific selector targeting the product title link
      const sponsoredLink = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.URLS.M_5,
        PRODUCT_SELECTORS.HREF
      );
      if (sponsoredLink) {
        const trackingUrl = getGenerateURL(sponsoredLink);
        const cleanUrl = getCleanTrackingURL(trackingUrl);
        if (cleanUrl) return cleanUrl;
      }

      // Sixth try: More specific selector targeting the product image link
      const sponsoredImageLink = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.URLS.M_6,
        PRODUCT_SELECTORS.HREF
      );
      if (sponsoredImageLink) {
        const trackingUrl = getGenerateURL(sponsoredImageLink);
        const cleanUrl = getCleanTrackingURL(trackingUrl);
        if (cleanUrl) return cleanUrl;
      }

      return null;
    } catch (error) {
      logError("Error getting product URL:", error);
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
