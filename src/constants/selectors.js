export const CREATED_ENTITY = {
  ROOT_ID: "__amz-root-id",
  PRODUCT_METADATA_CARD_ID: "__amz-product-metadata-card-id",
  PRODUCT_ANALYTICS_CARD_ID: "__amz-product-analytics-card-id",
};

export const QUERY_SELECTORS = {
  SEARCH_PRODUCT_CONTAINERS: "div.puis-card-container.s-card-container",
  SEARCH_PRODUCT_ATTRIBUTES: "[data-asin]",
  PRODUCT_DETAILS_TABLE: "table.a-keyvalue.prodDetTable tr",
  INNER_SECTION: {
    S_1: "div.a-section.a-spacing-base",
  },
};

export const PRODUCT_SELECTORS = {
  SPONSORS: {
    M_1: ".puis-sponsored-label-text",
    M_2: "h2.a-size-base-plus",
    M_3: `[aria-label*="Sponsored"], [data-cy*="sponsored"]`,
    M_4: `a[href*="sspa"]`,
  },
  ASIN: "[data-component-props*='asin']",
  DATA_ASIN: "[data-asin]",
  TITLES: {
    M_1: "div[data-cy='title-recipe'] h2.a-size-base-plus span",
    M_2: "h2.a-size-medium span",
    M_3: `a[href*="/dp/"] h2, a[href*="/product/"] h2`,
  },
  PRICES: {
    CURRENT: "div[data-cy='price-recipe'] span.a-price span.a-offscreen",
    LIST: ".a-price.a-text-price .a-offscreen",
    LIST_1: ".a-price.a-text-price",
  },
  CATEGORIES: {
    M_1: "[data-csa-c-product-type]",
    M_2: ".a-badge-supplementary-text",
    M_3: `a[href*="/dp/"], a[href*="/product/"]`,
  },
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

  URLS: {
    M_1: "a.a-link-normal[href*='/dp/']",
    M_2: `a.a-link-normal.s-no-outline[href*="/dp/"], a.a-link-normal.s-no-outline[href*="/product/"]`,
    M_3: `a[href*="/dp/"][href*="ref="], a[href*="/product/"][href*="ref="]`,
    M_4: "div[data-cy='title-recipe'] a",
    M_5: "a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal[href]",
    M_6: "div.s-product-image-container a.a-link-normal[href]",
  },
  IMAGE_URL: "div[data-cy='image-container'] img.s-image",
  HREF: "href",
};
