import { createRoot } from "react-dom/client";
import { PRODUCT_SELECTORS, QUERY_SELECTORS } from "../constants/selectors";

const DomUtils = {
  /**
   * Safely queries a single DOM element using a CSS selector.
   * @param {string} selector - The CSS selector to query.
   * @param {HTMLElement} [parent=document] - The parent element to query within. Defaults to the document.
   * @returns {HTMLElement|null} - The first matching element, or null if none found or the selector is invalid.
   */
  qs(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.error("Invalid selector:", selector, error);
      return null;
    }
  },

  /**
   * Safely queries multiple DOM elements using a CSS selector.
   * @param {string} selector - The CSS selector to query.
   * @param {HTMLElement} [parent=document] - The parent element to query within. Defaults to the document.
   * @returns {HTMLElement[]} - An array of matching elements, or an empty array if none found or the selector is invalid.
   */
  qsa(selector, parent = document) {
    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (error) {
      console.error("Invalid selector:", selector, error);
      return [];
    }
  },

  /**
   * Creates an HTML element with specified attributes and text content.
   * @param {string} tag - The tag name of the element to create.
   * @param {Object} [attrs={}] - An object representing the attributes to set on the element.
   * @param {string} [text=''] - The text content to set for the element.
   * @returns {HTMLElement} - The newly created HTML element.
   */
  createElement(tag, attrs = {}, text = "") {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    if (text) element.textContent = text;
    return element;
  },

  /**
   * Injects a React component into the specified container element.
   * @param {React.ReactElement} component - The React component to inject.
   * @param {HTMLElement} container - The HTML element to inject the React component into.
   * @param {Object} [options={}] - An object of options.
   * @param {string} [options.id] - The ID to set on the wrapping element.
   * @param {string} [options.className] - The class name to set on the wrapping element.
   * @param {boolean} [options.prepend=false] - A boolean indicating whether to prepend the wrapping element to the container, or append it.
   * @param {boolean} [options.isRoot=false] - A boolean indicating whether the container is the root element of the React app.
   * If true, the component will be rendered directly into the container, without a wrapping element.
   * @returns {void}
   */
  injectReactComponent(component, container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) return;
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
  },

  /**
   * Waits for an element to exist in the DOM and returns it.
   * @param {string} selector - The CSS selector to query.
   * @param {number} [timeout=5000] - The maximum time to wait in milliseconds.
   * @param {number} [interval=500] - The interval in milliseconds to wait between checks.
   * @returns {Promise<HTMLElement>} - A promise resolving to the element when it exists, or rejecting with an error after the timeout.
   */
  waitForElement(selector, timeout = 5000, interval = 500) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const check = () => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        if (Date.now() - startTime >= timeout) {
          return reject(
            new Error(`Element ${selector} not found within ${timeout}ms`)
          );
        }

        setTimeout(check, interval);
      };

      check();
    });
  },
};

const AmazonDomUtils = {
  /**
   * Finds all Amazon product containers on the current page.
   * @returns {HTMLElement[]} - An array of HTML elements, each representing a product container.
   */
  findAmazonProductContainers() {
    return DomUtils.qsa(QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS);
  },

  /**
   * Retrieves the category of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product category if available, otherwise null.
   */
  getProductCategory(element) {
    return (
      element?.querySelector(PRODUCT_SELECTORS.CATEGORY)?.dataset
        ?.csaCProductType || null
    );
  },

  /**
   * Retrieves the ASIN of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product ASIN if available, otherwise null.
   */
  getProductAsin(element) {
    let asin =
      element
        ?.querySelector(PRODUCT_SELECTORS.ASIN)
        ?.dataset.componentProps.match(/"asin":"(.*?)"/)[1] ||
      element.querySelector(QUERY_SELECTORS.SEARCH_PRODUCT_ATTRIBUTES)?.dataset
        .asin ||
      null;
    if (!asin) {
      const productUrl = this.getProductUrl(element);
      asin = productUrl?.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || null;
    }
    return asin;
  },

  /**
   * Retrieves the title of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product title if available, otherwise null.
   */
  getProductTitle(element) {
    return (
      element?.querySelector(PRODUCT_SELECTORS.TITLE)?.textContent.trim() ||
      null
    );
  },

  /**
   * Retrieves the price of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product price if available, otherwise null.
   */
  getProductPrice(element) {
    return element?.querySelector(PRODUCT_SELECTORS.PRICE)?.textContent || null;
  },

  /**
   * Retrieves the URL of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product URL if available, otherwise null.
   */
  getProductUrl(element) {
    const url = element
      .querySelector(PRODUCT_SELECTORS.URL)
      .getAttribute("href");
    return url ? `${window.location.origin}${url}` : null;
  },

  /**
   * Retrieves the image URL of a product from a given HTML element.
   * @param {HTMLElement} element - The HTML element representing a product.
   * @returns {string|null} - The product image URL if available, otherwise null.
   */
  getProductImageUrl(element) {
    return element?.querySelector(PRODUCT_SELECTORS.IMAGE_URL)?.src || null;
  },

  /**
   * Retrieves the current page URL.
   * @returns {string} - The URL of the current page.
   */
  getPageUrl() {
    return window.location.href;
  },
};

export default {
  ...DomUtils,
  ...AmazonDomUtils,
};
