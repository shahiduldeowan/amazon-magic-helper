import { createRoot } from "react-dom/client";
import { PRODUCT_SELECTORS, QUERY_SELECTORS } from "../constants/selectors";
import {
  getCleanBoughtPastMonth,
  getCleanTrackingURL,
  getGenerateURL,
} from "../utils/helper";

/**
 * DOM Utility Library
 * Provides safe, optimized DOM manipulation methods with comprehensive error handling
 */
const DomUtils = {
  /**
   * Safely query a single DOM element
   * @param {string} selector - CSS selector
   * @param {ParentNode} [parent=document] - Parent element to query within
   * @returns {Element|null} Found element or null
   */
  qs(selector, parent = document) {
    if (typeof selector !== "string" || !(parent instanceof Node)) {
      console.error("Invalid parameters:", { selector, parent });
      return null;
    }

    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.error(`Query failed for selector "${selector}":`, error);
      return null;
    }
  },

  /**
   * Safely query multiple DOM elements
   * @param {string} selector - CSS selector
   * @param {ParentNode} [parent=document] - Parent element to query within
   * @returns {Array<Element>} Array of found elements (empty if none)
   */
  qsa(selector, parent = document) {
    if (typeof selector !== "string" || !(parent instanceof Node)) {
      console.error("Invalid parameters:", { selector, parent });
      return [];
    }

    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (error) {
      console.error(`QueryAll failed for selector "${selector}":`, error);
      return [];
    }
  },

  /**
   * Create a DOM element with attributes and text
   * @param {string} tag - HTML tag name
   * @param {Object} [attrs={}] - Attributes object
   * @param {string} [text=""] - Text content
   * @returns {HTMLElement} Created element
   */
  createElement(tag, attrs = {}, text = "") {
    if (typeof tag !== "string") {
      console.error("Invalid tag parameter:", tag);
      return document.createElement("div"); // Fallback
    }

    try {
      const element = document.createElement(tag);

      // Set attributes safely
      if (attrs && typeof attrs === "object") {
        Object.entries(attrs).forEach(([key, value]) => {
          try {
            if (value !== null && value !== undefined) {
              element.setAttribute(key, String(value));
            }
          } catch (attrError) {
            console.error(`Failed to set attribute ${key}:`, attrError);
          }
        });
      }

      if (text) element.textContent = text;
      return element;
    } catch (error) {
      console.error("Element creation failed:", error);
      return document.createElement("div"); // Fallback
    }
  },

  /**
   * Safely get text content from a descendant element
   * @param {Element} element - Parent element
   * @param {string} selector - CSS selector for target element
   * @returns {string|null} Text content or null
   */
  getTextContent(element, selector) {
    if (!(element instanceof Element) || typeof selector !== "string") {
      console.error("Invalid parameters:", { element, selector });
      return null;
    }

    try {
      return this.qs(selector, element)?.textContent?.trim() ?? null;
    } catch (error) {
      console.error("Text content extraction failed:", error);
      return null;
    }
  },

  /**
   * Safely get an attribute value from a descendant element
   * @param {Element} element - Parent element
   * @param {string} selector - CSS selector for target element
   * @param {string} attr - Attribute name
   * @returns {string|null} Attribute value or null
   */
  getAttribute(element, selector, attr) {
    if (
      !(element instanceof Element) ||
      typeof selector !== "string" ||
      typeof attr !== "string"
    ) {
      console.error("Invalid parameters:", { element, selector, attr });
      return null;
    }

    try {
      const target = this.qs(selector, element);
      return target?.getAttribute(attr) ?? null;
    } catch (error) {
      console.error("Attribute extraction failed:", error);
      return null;
    }
  },

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  getPageUrl() {
    try {
      return window.location.href;
    } catch (error) {
      console.error("Failed to get page URL:", error);
      return "";
    }
  },

  /**
   * Inject a React component into the DOM
   * @param {React.ReactNode} component - React component to render
   * @param {HTMLElement} container - Container element
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.id] - Wrapper element ID
   * @param {string} [options.className=""] - Wrapper element class
   * @param {boolean} [options.prepend=false] - Prepend instead of append
   * @param {boolean} [options.isRoot=false] - Use container as root directly
   */
  injectReactComponent(component, container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      console.error("Invalid container:", container);
      return;
    }

    if (!component) {
      console.error("No component provided");
      return;
    }

    try {
      const { id, className = "", prepend = false, isRoot = false } = options;
      let wrapper;

      if (!isRoot) {
        wrapper = this.createElement("div", { class: className });
        if (id) wrapper.id = id;
        prepend ? container.prepend(wrapper) : container.append(wrapper);
      } else {
        wrapper = container;
      }

      const root = createRoot(wrapper);
      root.render(component);
    } catch (error) {
      console.error("React component injection failed:", error);
    }
  },

  /**
   * Wait for an element to appear in the DOM
   * @param {string} selector - CSS selector
   * @param {number} [timeout=5000] - Timeout in ms
   * @param {number} [interval=500] - Check interval in ms
   * @returns {Promise<Element>} Promise resolving to the element
   */
  waitForElement(selector, timeout = 5000, interval = 500) {
    if (typeof selector !== "string") {
      return Promise.reject(new Error("Invalid selector"));
    }

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const check = () => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            return resolve(element);
          }

          if (Date.now() - startTime >= timeout) {
            return reject(
              new Error(`Element "${selector}" not found within ${timeout}ms`)
            );
          }

          setTimeout(
            check,
            Math.min(interval, timeout - (Date.now() - startTime))
          );
        } catch (error) {
          reject(error);
        }
      };

      check();
    });
  },
};

/**
 * Utility for extracting Amazon product data from DOM elements
 * Follows best practices for error handling, performance, and clean code
 */
const AmazonDomUtils = {
  /**
   * Finds all Amazon product containers on the page
   * @returns {Array<HTMLElement>} Array of product container elements
   */
  findAmazonProductContainers() {
    try {
      return Array.from(
        document.querySelectorAll(QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS)
      );
    } catch (error) {
      console.error("Error finding product containers:", error);
      return [];
    }
  },

  /**
   * Gets product category from element
   * @param {HTMLElement} element - Product container element
   * @returns {string|null} Product category or null if not found
   */
  getProductCategory(element) {
    if (!element) return null;
    try {
      // Method 1: From data-csa-c-product-type attribute
      const csaCProductTypeElement = DomUtils.qs(
        PRODUCT_SELECTORS.CATEGORIES.M_1,
        element
      );
      const csaCProductType = csaCProductTypeElement?.dataset?.csaCProductType;
      if (csaCProductType) return csaCProductType;

      // Method 2: Check badge supplementary text (most reliable)
      const badgeText = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.CATEGORIES.M_2
      );
      const categoryMatch = badgeText?.match(/in (.+)/);
      if (categoryMatch) return categoryMatch[1].trim();

      // Method 3: Infer from URL keywords
      const productUrl = DomUtils.getAttribute(
        element,
        PRODUCT_SELECTORS.CATEGORIES.M_3,
        PRODUCT_SELECTORS.HREF
      );

      if (productUrl) {
        if (productUrl.includes("keywords=")) {
          const match = productUrl.match(/keywords=([^&]+)/);
          if (match) {
            return decodeURIComponent(match[1].replace(/\+/g, " "));
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting product category:", error);
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
      // Method 1: From component props
      const componentProps = element
        .querySelector(PRODUCT_SELECTORS.ASIN)
        ?.dataset?.componentProps?.match(/"asin":"(.*?)"/)[1];
      if (componentProps) return componentProps;

      // Method 2: From data-asin attribute
      const dataAsin = element.querySelector(
        QUERY_SELECTORS.SEARCH_PRODUCT_ATTRIBUTES
      )?.dataset?.asin;
      if (dataAsin) return dataAsin;

      // Method 3: From product URL
      const productUrl = this.getProductUrl(element);
      if (productUrl) {
        const asinMatch = productUrl.match(/\/dp\/([A-Z0-9]{10})/);
        if (asinMatch) return asinMatch[1];
      }

      return null;
    } catch (error) {
      console.error("Error extracting ASIN:", error);
      return null;
    }
  },

  /**
   * Checks if product is sponsored
   * @param {HTMLElement} element - Product container element
   * @returns {boolean} True if sponsored
   */
  isProductSponsored(element) {
    if (!element) return false;
    try {
      // Method 1: From sponsored badge
      if (DomUtils.qs(PRODUCT_SELECTORS.SPONSORS.M_1, element)) {
        return true;
      }

      // Method 2: Check for "Sponsored Ad" text in the title or other elements
      const title = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.SPONSORS.M_2
      );
      if (title && title.includes("Sponsored Ad")) {
        return true;
      }

      // Method 3: check for specific sponsored class or attributes
      const sponsoredElements = DomUtils.qsa(
        PRODUCT_SELECTORS.SPONSORS.M_3,
        element
      );
      if (sponsoredElements.length > 0) {
        return true;
      }

      // Method 4: Another common indicator is the presence of "sspa" in the URL
      const links = DomUtils.qsa(PRODUCT_SELECTORS.SPONSORS.M_4, element);
      if (links.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking sponsored status:", error);
      return false;
    }
  },

  /**
   * Gets product title text
   * @param {HTMLElement} element - Product container element
   * @returns {string|null} Title text or null
   */
  getProductTitle(element) {
    if (!element) return null;
    try {
      // Method 1: From title element
      const title = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.TITLES.M_1
      );
      if (title) return title;

      // Method 2: From title span element
      const titleSpan = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.TITLES.M_2
      );
      if (titleSpan) return titleSpan;

      // Method 3: From title link element
      const titleLink = DomUtils.getTextContent(
        element,
        PRODUCT_SELECTORS.TITLES.M_3
      );
      if (titleLink) return titleLink;

      return null;
    } catch (error) {
      console.error("Error getting product title:", error);
      return null;
    }
  },

  /**
   * Extracts and calculates price information
   * @param {HTMLElement} element - Product container element
   * @returns {Object|null} Price object or null
   */
  getProductPrices(element) {
    if (!element) return null;

    /**
     * Safely extracts and parses price from selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement} [parent=element] - Parent element
     * @returns {number|null} Parsed price or null
     */
    const parsePrice = (selector, parent = element) => {
      try {
        const textContent = parent.querySelector(selector)?.textContent?.trim();
        if (!textContent) return null;

        const price = parseFloat(textContent.replace(/[^\d.-]/g, ""));
        return isNaN(price) ? null : price;
      } catch (error) {
        console.error(`Error parsing price from ${selector}:`, error);
        return null;
      }
    };

    try {
      const currentPrice =
        parsePrice(PRODUCT_SELECTORS.PRICES.CURRENT) ||
        parsePrice(PRODUCT_SELECTORS.PRICES.CURRENT_FALLBACK);

      const listPrice =
        parsePrice(PRODUCT_SELECTORS.PRICES.LIST) ||
        parsePrice(PRODUCT_SELECTORS.PRICES.LIST_1);

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
      console.error("Error getting product prices:", error);
      return null;
    }
  },

  /**
   * Extracts review information including star distribution
   * @param {HTMLElement} element - Product container element
   * @returns {Object} Review data
   */
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
      console.error("Error getting product reviews:", error);
      return { rating: null, count: null };
    }
  },

  /**
   * Extracts product variant information
   * @param {HTMLElement} element - Product container element
   * @returns {Object} Variant data
   */
  getProductVariants(element) {
    if (!element) return { colors: null };

    /**
     * Extracts color variant information
     * @returns {Object|null} Color variant data or null
     */
    const extractColorVariants = () => {
      try {
        const content = element
          .querySelector(PRODUCT_SELECTORS.VARIANTS.COLOR)
          ?.textContent?.trim();
        if (!content) return null;

        const match = content.match(/\+(\d+)/);
        return {
          count: match?.[1] ? parseInt(match[1], 10) : null,
          text: content,
        };
      } catch (error) {
        console.error("Error extracting color variants:", error);
        return null;
      }
    };

    return {
      colors: extractColorVariants(),
    };
  },

  /**
   * Extracts performance metrics from a product container element
   * @param {HTMLElement|null} element - Product container element
   * @returns {Object} Performance data with boughtPastMonth and badge properties
   */
  getProductPerformance(element) {
    // Early return for null/undefined elements
    if (!element) return { boughtPastMonth: null, badge: null };

    try {
      // Use optional chaining and nullish coalescing for cleaner code
      const boughtPastMonthText =
        element.querySelector(PRODUCT_SELECTORS.PERFORMANCE.BOUGHT_PAST_MONTH)
          ?.textContent ?? null;
      const badgeText =
        element
          .querySelector(PRODUCT_SELECTORS.PERFORMANCE.BADGE)
          ?.textContent?.trim() ?? null;

      return {
        boughtPastMonth: getCleanBoughtPastMonth(boughtPastMonthText),
        badge: badgeText,
      };
    } catch (error) {
      console.error("Error getting product performance:", error);
      // Maintain consistent return shape
      return { boughtPastMonth: null, badge: null };
    }
  },

  /**
   * Checks if product is Prime eligible
   * @param {HTMLElement} element - Product container element
   * @returns {boolean} True if Prime eligible
   */
  isPrimeEligible(element) {
    if (!element) return false;
    try {
      return Boolean(
        element.querySelector(PRODUCT_SELECTORS.IS_PRIME_ELIGIBLE)
      );
    } catch (error) {
      console.error("Error checking Prime eligibility:", error);
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

      return null;
    } catch (error) {
      console.error("Error getting product URL:", error);
      return null;
    }
  },

  /**
   * Extracts all relevant URLs for a product
   * @param {HTMLElement} element - Product container element
   * @returns {Object} URL data
   */
  getUrls(element) {
    if (!element) return { productUrl: null, imageUrl: null, nicheUrl: null };

    try {
      const productUrl = this.getProductUrl(element);
      const imageElement = element.querySelector(PRODUCT_SELECTORS.IMAGE_URL);

      return {
        productUrl: productUrl,
        imageUrl:
          imageElement?.src ||
          imageElement?.getAttribute("srcset")?.split(",")[0]?.trim() ||
          null,
        nicheUrl: DomUtils.getPageUrl(),
      };
    } catch (error) {
      console.error("Error getting product URLs:", error);
      return { productUrl: null, imageUrl: null, nicheUrl: null };
    }
  },

  /**
   * Gets complete product data from an element
   * @param {HTMLElement} element - Product container element
   * @returns {Object|null} Complete product data or null
   */
  getProductData(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Invalid product element provided");
      return null;
    }

    try {
      return {
        category: this.getProductCategory(element),
        asin: this.getProductAsin(element),
        title: this.getProductTitle(element),
        prices: this.getProductPrices(element),
        reviews: this.getProductReviews(element),
        variants: this.getProductVariants(element),
        performance: this.getProductPerformance(element),
        isPrime: this.isPrimeEligible(element),
        isSponsored: this.isProductSponsored(element),
        ...this.getUrls(element),
        element,
      };
    } catch (error) {
      console.error("Error getting complete product data:", error);
      return null;
    }
  },
};

export default {
  ...DomUtils,
  ...AmazonDomUtils,
};
