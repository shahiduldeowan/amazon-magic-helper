import { createRoot } from "react-dom/client";
import { logError, logInfo, logWarn } from "./loggerUtils";

/**
 * DOM Utility Library
 * Provides safe, optimized DOM manipulation methods with comprehensive error handling
 */
export const DomUtils = {
  /**
   * Checks if the provided element is an instance of HTMLElement
   * @param {*} element - The element to check
   * @returns {boolean} True if the element is an HTMLElement, false otherwise
   */
  isElement(element) {
    return element instanceof HTMLElement;
  },
  /**
   * Safely query a single DOM element
   * @param {string} selector - CSS selector
   * @param {ParentNode} [parent=document] - Parent element to query within
   * @returns {Element|null} Found element or null
   */
  qs(selector, parent = document) {
    if (typeof selector !== "string" || !(parent instanceof Node)) {
      logWarn("qs", "Invalid parameters:", { selector, parent });
      return null;
    }

    try {
      return parent.querySelector(selector);
    } catch (error) {
      logError(`[qs] "${selector}":`, error);
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
      logWarn("qsa", "Invalid parameters: ", { selector, parent });
      return [];
    }

    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (error) {
      logError(`[qsa] "${selector}":`, error);
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
      logInfo("createElement", "Invalid tag parameter:", tag);
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
            logError(`Failed to set attribute ${key}:`, attrError);
          }
        });
      }

      if (text) element.textContent = text;
      return element;
    } catch (error) {
      logError("Element creation failed:", error);
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
      logWarn("Invalid parameters:", { element, selector });
      return null;
    }

    try {
      return this.qs(selector, element)?.textContent?.trim() ?? null;
    } catch (error) {
      logError("Text content extraction failed:", error);
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
      logWarn("Invalid parameters:", { element, selector, attr });
      return null;
    }

    try {
      const target = this.qs(selector, element);
      return target?.getAttribute(attr) ?? null;
    } catch (error) {
      logError("Attribute extraction failed:", error);
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
      logError("Failed to get page URL:", error);
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
      logWarn("Invalid container:", container);
      return;
    }

    if (!component) {
      logWarn("No component provided");
      return;
    }

    try {
      const { id, className = "", prepend = false, isRoot = false } = options;
      let wrapper;

      if (!isRoot) {
        wrapper = this.createElement("div", { class: className });
        if (id) wrapper.id = id;
        if (prepend) {
          container.prepend(wrapper);
        } else {
          container.append(wrapper);
        }
      } else {
        wrapper = container;
      }

      const root = createRoot(wrapper);
      root.render(component);
    } catch (error) {
      logError("React component injection failed:", error);
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
