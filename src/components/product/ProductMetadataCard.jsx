import PropTypes from "prop-types";
import { Package, MapPin, Ruler, Weight, Hash, Calendar } from "lucide-react";
import MetadataItem from "./MetadataItem";

import { useRelativeDate } from "../../hooks/useRelativeDate";
import { LABELS } from "../../constants/strings";

const ProductMetadataCard = ({ metadata }) => {
  const relativeDate = useRelativeDate(metadata.dateAdded);

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Package size={14} className="text-orange-600" />
        <h3 className="text-xs font-medium text-gray-900">
          {LABELS.metadataTitle}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {!!metadata.salesRank && (
          <MetadataItem
            icon={Hash}
            label={LABELS.salesRank}
            value={metadata.salesRank}
          />
        )}

        {!!relativeDate && (
          <MetadataItem
            icon={Calendar}
            label={LABELS.dateAdded}
            value={relativeDate}
          />
        )}
        {!!metadata.dimensions && (
          <MetadataItem
            icon={Ruler}
            label={LABELS.dimensions}
            value={metadata.dimensions}
          />
        )}
        {!!metadata.weight && (
          <MetadataItem
            icon={Weight}
            label={LABELS.weight}
            value={metadata.weight}
          />
        )}
        {!!metadata.asin && (
          <MetadataItem
            icon={Hash}
            label={LABELS.asin}
            value={metadata.asin}
            className="font-mono"
          />
        )}
        {!!metadata.countryOfOrigin && (
          <MetadataItem
            icon={MapPin}
            label={LABELS.origin}
            value={metadata.countryOfOrigin}
          />
        )}
      </div>
    </div>
  );
};

ProductMetadataCard.propTypes = {
  metadata: PropTypes.shape({
    bsr: PropTypes.string,
    dateAdded: PropTypes.string,
    dimensions: PropTypes.string,
    weight: PropTypes.string,
    asin: PropTypes.string,
    countryOfOrigin: PropTypes.string,
  }),
};

export default ProductMetadataCard;
