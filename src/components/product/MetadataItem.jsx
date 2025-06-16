import PropTypes from "prop-types";

const MetadataItem = ({ icon: Icon, label, value, className = "" }) => {
  if (!value) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`} title={label}>
      {Icon && <Icon size={14} className="text-gray-500 flex-shrink-0" />}
      <span className="text-xs text-gray-600 font-medium min-w-0">
        <span className="text-gray-800">{label}:</span> {value}
      </span>
    </div>
  );
};

MetadataItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
};

export default MetadataItem;
