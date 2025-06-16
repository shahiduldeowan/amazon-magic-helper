import PropTypes from "prop-types";
import { Package, MapPin, Ruler, Weight, Hash, Calendar } from "lucide-react";
import MetadataItem from "./MetadataItem";
import { labels } from "../../constants/strings";

const ProductMetadataCard = ({ metadata }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Package size={16} className="text-orange-600" />
        <h3 className="text-sm font-medium text-gray-900">
          {labels.metadataTitle}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <MetadataItem
          icon={Hash}
          label={labels.salesRank}
          value={metadata.salesRank}
        />
        <MetadataItem
          icon={Calendar}
          label={labels.dateAdded}
          value={metadata.dateAdded}
        />
        <MetadataItem
          icon={Ruler}
          label={labels.dimensions}
          value={metadata.dimensions}
        />
        <MetadataItem
          icon={Weight}
          label={labels.weight}
          value={metadata.weight}
        />
        <MetadataItem
          icon={Hash}
          label={labels.asin}
          value={metadata.asin}
          className="font-mono"
        />
        <MetadataItem
          icon={MapPin}
          label={labels.origin}
          value={metadata.countryOfOrigin}
        />
      </div>
    </div>
  );
};

ProductMetadataCard.propTypes = {
  product: PropTypes.shape({
    bsr: PropTypes.string,
    dateAdded: PropTypes.string,
    dimensions: PropTypes.string,
    weight: PropTypes.string,
    asin: PropTypes.string,
    countryOfOrigin: PropTypes.string,
  }),
};

export default ProductMetadataCard;
