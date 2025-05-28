import PropTypes from 'prop-types';

const Temp = () => {
    return (
        <div>
            <div className="relative mb-4 overflow-hidden rounded-lg h-auto bg-gradient-to-br from-slate-900 to-slate-800 transform perspective-1000 group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 opacity-20 bg-grid-white/10"></div>

                {/* Glowing accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>

                {/* Tech circuit pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-8 h-8 border border-white/20 rounded-full"></div>
                    <div className="absolute top-6 left-10 w-20 h-[1px] bg-white/20"></div>
                    <div className="absolute top-12 left-4 w-[1px] h-10 bg-white/20"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 p-4 flex flex-col h-full">
                    <div>
                        <p className="text-xs text-cyan-400 uppercase tracking-widest font-mono">Product Specifications</p>
                    </div>

                    {/* Product Specs Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-400 leading-none">ASIN</p>
                                <p className="text-sm text-white font-mono">{asin}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Weight className="h-3.5 w-3.5 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-400 leading-none">Size</p>
                                <p className="text-sm text-white font-mono">{weight}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-500"></div>
                            <div>
                                <p className="text-xs text-gray-400 leading-none">Era</p>
                                <p className="text-sm text-white font-mono truncate max-w-[100px]">{creationEra}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="h-3.5 w-3.5 rounded-md bg-gradient-to-r from-green-400 to-emerald-500"></div>
                            <div>
                                <p className="text-xs text-gray-400 leading-none">Ranking</p>
                                <p className="text-sm text-white font-mono truncate max-w-[100px]">{bsr}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="h-3.5 w-3.5 rounded-md rotate-45 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                            <div>
                                <p className="text-xs text-gray-400 leading-none">Origin</p>
                                <p className="text-sm text-white font-mono truncate max-w-[100px]">{manufacturer}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Ban className="h-3.5 w-3.5 text-blue-400" />
                            <div>
                                <p className="text-xs text-gray-400 leading-none">Brand</p>
                                <p className="text-sm text-white font-mono truncate max-w-[100px]">{brand}</p>
                            </div>
                        </div>
                    </div>

                    {/* Digital watermark */}
                    <div className="absolute bottom-2 right-2">
                        <div className="text-[8px] text-blue-500/50 font-mono">VERIFIED</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SpecItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400 leading-none">{label}</p>
        <p className="text-sm text-white font-mono truncate max-w-[100px]">
            {value || "N/A"}
        </p>
    </div>
);

SpecItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string
};

const ProductSpecsSection = ({
    asin,
    weight,
    creationEra,
    bsr,
    manufacturer,
    brand
}) => {
    return (
        <div className="
      relative mb-4 overflow-hidden rounded-lg h-auto 
      bg-gradient-to-br from-slate-900 to-slate-800 
      transform perspective-1000 group-hover:scale-105 
      transition-all duration-300
    ">
            {/* Background grid pattern */}
            <div className="
        absolute inset-0 opacity-20
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
        bg-[size:20px_20px]
      "></div>

            {/* Accent line */}
            <div className="
        absolute top-0 left-0 w-full h-1
        bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
      "></div>

            {/* Tech pattern decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border border-white/20 rounded-full"></div>
                <div className="absolute top-6 left-10 w-20 h-px bg-white/20"></div>
                <div className="absolute top-12 left-4 w-px h-10 bg-white/20"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border border-white/20 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 flex flex-col h-full">
                <div>
                    <p className="text-xs text-cyan-400 uppercase tracking-widest font-mono">
                        Product Specifications
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
                    <SpecItem label="ASIN" value={asin} />
                    <SpecItem label="Size" value={weight} />
                    <SpecItem label="Era" value={creationEra} />
                    <SpecItem label="Ranking" value={bsr} />
                    <SpecItem label="Origin" value={manufacturer} />
                    <SpecItem label="Brand" value={brand} />
                </div>

                <div className="absolute bottom-2 right-2">
                    <div className="text-[8px] text-blue-500/50 font-mono">
                        VERIFIED
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductSpecsSection.propTypes = {
    asin: PropTypes.string,
    weight: PropTypes.string,
    creationEra: PropTypes.string,
    bsr: PropTypes.string,
    manufacturer: PropTypes.string,
    brand: PropTypes.string
};

ProductSpecsSection.defaultProps = {
    asin: "N/A",
    weight: "N/A",
    creationEra: "N/A",
    bsr: "N/A",
    manufacturer: "N/A",
    brand: "N/A"
};

export default ProductSpecsSection;