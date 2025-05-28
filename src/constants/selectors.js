export const CONTAINER_SELECTORS = {
    PRODUCT_ASIN_ATTRIBUTE: 'div[data-asin]',
    PRODUCT_CONTAINER: 'div.puis-card-container.s-card-container',
    PRODUCT_SECTION: 'div.a-section.a-spacing-base',
}

export const PRODUCT_INFO_SELECTORS = {
    TITLE: 'h2.a-size-base-plus', // Product title
    PRICE: 'span.a-price[data-a-size]', // Main price
    OLD_PRICE: 'span.a-price.a-text-price', // Strikethrough price
    IMAGE: 'img.s-image', // Product image
    RATING: 'i.a-icon-star-small', // Star rating
    REVIEW_COUNT: 'span.a-size-base.s-underline-text', // Review count
    COUPON: 'span.s-coupon-unclipped', // Coupon text
    DELIVERY: 'div.udm-primary-delivery-message', // Delivery info
    ASIN_ATTRIBUTE: 'data-asin', // ASIN
};

export const CREATED_SELECTORS = {
    ROOT: '__amz-magic-container',
    PRODUCT_SPECS_SECTION: '__amz-magic-product-specs',
}