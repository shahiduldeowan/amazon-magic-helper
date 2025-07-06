export const PRODUCT_DETAILS_KEYS = [
  "ASIN",
  "Best Sellers Rank",
  "Date First Available",
  "Item model number",
  "UPC",
  "Product Dimensions",
  "Item Dimensions LxWxH",
  "Package Dimensions",
  "Country of Origin",
  "Manufacturer",
  "Item Weight",
  "Brand",
  "Package Weight",
];

export const LABELS = {
  metadataTitle: "Product Details",
  salesRank: "Sales Rank",
  dateAdded: "Date Added",
  dimensions: "Dimensions",
  weight: "Weight",
  asin: "ASIN",
  origin: "Origin",
};

export const SCORES = {
  low: "Low",
  medium: "Medium",
  high: "High",
  na: "N/A",
};

export const BADGES = {
  hotNiche: "Hot Niche",
  highMargin: "High Margin",
  emergingTrend: "Emerging Trend",
};

//---------------------------------------------------
export const mockNicheAnalysis = {
  averagePrice: "$29.99",
  averageRating: 4.3,
  averageReviewCount: "1.2K",
  competitionScore: "Medium",
  profitPotential: "High",
  badges: ["Hot Niche", "High Margin"],
};

export const mockNicheAnalysisLow = {
  averagePrice: "$149.99",
  averageRating: 3.8,
  averageReviewCount: "456",
  competitionScore: "High",
  profitPotential: "Low",
  badges: ["Emerging Trend"],
};

export const mockNicheAnalysisGreen = {
  averagePrice: "$19.99",
  averageRating: 4.7,
  averageReviewCount: "2.5K",
  competitionScore: "Low",
  profitPotential: "High",
  badges: ["Hot Niche", "High Margin", "Emerging Trend"],
};
