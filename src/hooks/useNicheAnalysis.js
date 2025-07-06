import { useMemo } from "react";
import { formatShortNumber } from "../utils";
import { BADGES, SCORES } from "../constants/strings";

export function useNicheAnalysis(products) {
  return useMemo(() => {
    if (!products || products.length === 0) {
      return {
        averagePrice: 0,
        averageRating: 0,
        averageReviewCount: 0,
        competitionScore: SCORES.na,
        profitPotential: SCORES.na,
        badges: [],
        productCount: 0,
      };
    }

    const totalProducts = products.length;
    const totalPrice = products.reduce(
      (sum, p) => sum + (p.prices?.current || 0),
      0
    );
    const totalRating = products.reduce(
      (sum, p) => sum + (p.reviews?.rating || 0),
      0
    );
    const totalReviews = products.reduce(
      (sum, p) => sum + (p.reviews?.count || 0),
      0
    );

    const averageReviewCount = formatShortNumber(totalReviews / totalProducts);

    return {
      averagePrice: totalPrice / totalProducts,
      averageRating: totalRating / totalProducts,
      averageReviewCount,
      competitionScore: SCORES.low,
      profitPotential: SCORES.medium,
      badges: [BADGES.hotNiche, BADGES.highMargin, BADGES.emergingTrend],
      productCount: totalProducts,
    };
  }, [products]);
}
