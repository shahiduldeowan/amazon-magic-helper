export const SCRAPER_CONFIG = {
  /**
   * Adjustable buffer for purchase frequency calculations to account for "+X" cases,
   * where X is the number of additional items (e.g., "3+" means 10% more than the base value).
   * This buffer is applied as a multiplier (1.1 = 10% increase).
   */
  PURCHASE_FREQUENCY_BUFFER: 1.1,
};
