export const CREATED_ENTITY = {
  ROOT_ID: "__amz-root-id",
  PRODUCT_METADATA_CARD_ID: "__amz-product-metadata-card-id",
  PRODUCT_ANALYTICS_CARD_ID: "__amz-product-analytics-card-id",
};

export const QUERY_SELECTORS = {
  SEARCH_PRODUCT_CONTAINERS: "div.puis-card-container.s-card-container",
  SEARCH_PRODUCT_ATTRIBUTES: "[data-asin]",
};

export const PRODUCT_SELECTORS = {
  INNER_SECTION: "div.a-section.a-spacing-base",
  SPONSORED: ".puis-sponsored-label-text",
  ASIN: "[data-component-props*='asin']",
  DATA_ASIN: "[data-asin]",
  TITLE: "div[data-cy='title-recipe'] h2.a-size-base-plus span",
  TITLE_1: "h2.a-size-medium span",
  TITLE_2: `a[href*="/dp/"] h2, a[href*="/product/"] h2`,
  PRICES: {
    CURRENT: "div[data-cy='price-recipe'] span.a-price span.a-offscreen",
    LIST: ".a-price.a-text-price .a-offscreen",
    LIST_1: ".a-price.a-text-price",
  },

  CATEGORY: "[data-csa-c-product-type]",
  RATINGS: {
    RATING: "div[data-cy='reviews-block'] i.a-icon-star-small span.a-icon-alt",
    COUNT: `div[data-cy="reviews-block"] span[data-component-type="s-client-side-analytics"] a span.a-size-base`,
    STAR: ".a-popover-content",
  },
  VARIANTS: {
    COLOR: ".s-color-swatch-link",
    SIZE: "",
  },
  PERFORMANCE: {
    BOUGHT_PAST_MONTH: `div[data-cy="reviews-block"] > .a-row.a-size-base > span.a-size-base.a-color-secondary`,
    BADGE: ".a-badge-text",
  },
  IS_PRIME_ELIGIBLE: `i.a-icon-prime`,
  URL: "a.a-link-normal[href*='/dp/']",
  MAIN_URL: `a.a-link-normal.s-no-outline[href*="/dp/"], a.a-link-normal.s-no-outline[href*="/product/"]`,
  PRODUCT_URL: `a[href*="/dp/"][href*="ref="], a[href*="/product/"][href*="ref="]`,
  IMAGE_URL: "div[data-cy='image-container'] img.s-image",
  HREF: "href",
};
