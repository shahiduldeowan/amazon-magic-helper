import { PRODUCT_INFO_SELECTORS } from '../constants/selectors.js';

export function extractProductData(productElement) {
  // Helper function to safely get text/content
  const getText = (selector, parent = productElement) =>
    parent.querySelector(selector)?.textContent?.trim() || null;

  const getAttribute = (selector, attr, parent = productElement) =>
    parent.querySelector(selector)?.getAttribute(attr) || null;

  // Extract all available data
  return {
    asin: productElement.getAttribute(PRODUCT_INFO_SELECTORS.ASIN_ATTRIBUTE),
    title: getText(PRODUCT_INFO_SELECTORS.TITLE),
    price: {
      current: getText(PRODUCT_INFO_SELECTORS.PRICE + ' .a-offscreen'),
      whole: getText(PRODUCT_INFO_SELECTORS.PRICE + ' .a-price-whole'),
      fraction: getText(PRODUCT_INFO_SELECTORS.PRICE + ' .a-price-fraction'),
      symbol: getText(PRODUCT_INFO_SELECTORS.PRICE + ' .a-price-symbol'),
      old: getText(PRODUCT_INFO_SELECTORS.OLD_PRICE + ' .a-offscreen')
    },
    image: {
      src: getAttribute(PRODUCT_INFO_SELECTORS.IMAGE, 'src'),
      alt: getAttribute(PRODUCT_INFO_SELECTORS.IMAGE, 'alt'),
      srcset: getAttribute(PRODUCT_INFO_SELECTORS.IMAGE, 'srcset')
    },
    rating: {
      stars: getText(PRODUCT_INFO_SELECTORS.RATING + ' .a-icon-alt'),
      count: getText(PRODUCT_INFO_SELECTORS.REVIEW_COUNT)
    },
    coupon: getText(PRODUCT_INFO_SELECTORS.COUPON),
    delivery: getText(PRODUCT_INFO_SELECTORS.DELIVERY),
    url: productElement.querySelector('a.a-link-normal')?.href || null,
    rawElement: productElement // Optional: keep reference to original element
  };
}

export function extractAllProducts() {
  return Array.from(document.querySelectorAll(SELECTORS.PRODUCT))
    .map(extractProductData)
    .filter(product => product.asin); // Filter out null ASINs
}