import {
  TrendingUp,
  Star,
  MessageSquare,
  Target,
  DollarSign,
  Award,
} from "lucide-react";
import {
  badges,
  competitionScore,
  profitPotential,
} from "../../constants/strings";

export function NicheAnalysisPanel({ analysis }) {
  const getCompetitionColor = (score) => {
    switch (score) {
      case competitionScore.low:
        return "text-green-600 bg-green-50";
      case competitionScore.medium:
        return "text-yellow-600 bg-yellow-50";
      case competitionScore.high:
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProfitColor = (potential) => {
    switch (potential) {
      case profitPotential.high:
        return "text-green-600 bg-green-50";
      case profitPotential.medium:
        return "text-yellow-600 bg-yellow-50";
      case profitPotential.low:
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case badges.hotNiche:
        return "bg-red-100 text-red-700 border-red-200";
      case badges.highMargin:
        return "bg-green-100 text-green-700 border-green-200";
      case badges.emergingTrend:
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  //mb-4 rounded-md
  return (
    <div className="bg-white border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-orange-600" />
          <h3 className="text-sm font-medium text-gray-900">Niche Analysis</h3>
          <span className="text-xs text-gray-500">
            ({analysis.totalProducts} products)
          </span>
        </div>

        {/* Badges */}
        {analysis.badges && analysis.badges.length > 0 && (
          <div className="flex gap-1">
            {analysis.badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getBadgeStyle(
                  badge
                )}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Average Price */}
        <div
          className="flex items-center gap-2"
          title="Average price across all products"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-full">
            <DollarSign size={14} className="text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Price</div>
            <div className="text-sm font-semibold text-gray-900">
              ${analysis.averagePrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div
          className="flex items-center gap-2"
          title="Average rating across all products"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-50 rounded-full">
            <Star size={14} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Rating</div>
            <div className="text-sm font-semibold text-gray-900">
              {analysis.averageRating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Average Reviews */}
        <div
          className="flex items-center gap-2"
          title="Average review count across all products"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full">
            <MessageSquare size={14} className="text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Avg Reviews</div>
            <div className="text-sm font-semibold text-gray-900">
              {analysis.averageReviewCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Competition Score */}
        <div
          className="flex items-center gap-2"
          title="Market competition level"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-full">
            <Target size={14} className="text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Competition</div>
            <div
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCompetitionColor(
                analysis.competitionScore
              )}`}
            >
              {analysis.competitionScore}
            </div>
          </div>
        </div>

        {/* Profit Potential */}
        {analysis.profitPotential && (
          <div
            className="flex items-center gap-2"
            title="Estimated profit potential"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-full">
              <Award size={14} className="text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Profit</div>
              <div
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${getProfitColor(
                  analysis.profitPotential
                )}`}
              >
                {analysis.profitPotential}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
