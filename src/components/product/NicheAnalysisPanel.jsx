import {
  TrendingUp,
  Star,
  MessageSquare,
  Target,
  DollarSign,
  Flame,
  Award,
  Zap,
} from "lucide-react";
import PropTypes from "prop-types";
import { StrictMode, useEffect, useState } from "react";
import { getAllProductsWithDetails } from "../../lib/amazon/extractAmazonProductDataUtils";
import { DomUtils } from "../../utils";
import { CREATED_ENTITY, QUERY_SELECTORS } from "../../constants/selectors";
import ProductMetadataCard from "./ProductMetadataCard";
import { useNicheAnalysis } from "../../hooks/useNicheAnalysis";

const NicheAnalysisPanel = ({ rawProducts }) => {
  const [products, setProducts] = useState([]);
  const {
    averagePrice,
    averageRating,
    averageReviewCount,
    competitionScore,
    profitPotential,
    badges,
    productCount,
  } = useNicheAnalysis(products);

  useEffect(() => {
    const renderProductData = async (productsData) => {
      await getAllProductsWithDetails(productsData, (product) => {
        injectMetaCard(product);
        setProducts((prev) => [...prev, product]);
      });
    };

    renderProductData(rawProducts);
  }, [rawProducts]);

  const injectMetaCard = (product) => {
    if (!product) return;

    const container = DomUtils.qs(
      QUERY_SELECTORS.PRODUCT_INNER_SECTION,
      product.element
    );
    if (!container) return;

    const metadata = {
      salesRank: product.bestSellersRank?.bsr,
      dateAdded: product.dateFirstAvailable,
      dimensions: product.dimensions,
      weight: product.weight ? `${product.weight}kg` : null,
      asin: product.asin,
      countryOfOrigin: product.countryOfOrigin,
    };

    DomUtils.injectReactComponent(
      <StrictMode>
        <ProductMetadataCard metadata={metadata} />
      </StrictMode>,
      container,
      {
        id: CREATED_ENTITY.PRODUCT_METADATA_CARD_ID,
        className: "amz-product-metadata-card",
        prepend: true,
      }
    );
  };

  const getCompetitionColor = (score) => {
    switch (score) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProfitColor = (potential) => {
    switch (potential) {
      case "High":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "Hot Niche":
        return <Flame size={10} className="text-red-500" />;
      case "High Margin":
        return <Award size={10} className="text-green-500" />;
      case "Emerging Trend":
        return <Zap size={10} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const analysisItems = [
    {
      icon: DollarSign,
      label: "Avg Price",
      value: averagePrice.toFixed(2),
      tooltip: "Average price across analyzed products",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: `${averageRating.toFixed(1)}/5`,
      tooltip: "Average customer rating",
    },
    {
      icon: MessageSquare,
      label: "Avg Reviews",
      value: averageReviewCount,
      tooltip: "Average number of reviews",
    },
    {
      icon: Target,
      label: "Competition",
      value: competitionScore,
      tooltip: "Market competition level",
      className: getCompetitionColor(competitionScore),
    },
  ];

  if (profitPotential) {
    analysisItems.push({
      icon: TrendingUp,
      label: "Profit Potential",
      value: profitPotential,
      tooltip: "Expected profit potential",
      className: getProfitColor(profitPotential),
    });
  }

  //s-flex-full-width
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-3 mb-4 shadow-sm ">
      <div className="flex flex-col space-y-2">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp size={14} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-900">
              Niche Analysis
            </span>
            <span className="text-xs text-gray-500">
              ({rawProducts.length}-[{productCount}] products)
            </span>
          </div>

          {/* Badges - Always visible */}
          {badges && badges.length > 0 && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded text-xs font-medium text-gray-700 border"
                  title={badge}
                >
                  {getBadgeIcon(badge)}
                  <span className="hidden sm:inline">{badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metrics Row - Always visible on separate line */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
          {analysisItems.map(
            ({ icon: Icon, label, value, tooltip, className }, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 group cursor-help flex-shrink-0"
                title={tooltip}
              >
                {Icon && <Icon size={12} className="text-gray-500" />}
                <span className="text-xs text-gray-600">{label}:</span>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded text-center min-w-0 ${
                    className || "text-gray-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

NicheAnalysisPanel.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NicheAnalysisPanel;
