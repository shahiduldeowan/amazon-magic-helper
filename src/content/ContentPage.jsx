import { StrictMode, useEffect } from "react";
import FloatingActionButton from "../components/FAB/FloatingActionButton";
import { DomUtils, logInfo } from "../utils";
import { CREATED_ENTITY, QUERY_SELECTORS } from "../constants/selectors";
import { getAmazonAllProductData } from "../lib/amazon/extractAmazonProductDataUtils";
import ProductMetadataCard from "../components/product/ProductMetadataCard";
import { NicheAnalysisPanel } from "../components/product/NicheAnalysisPanel";
import { sampleAnalysis } from "../constants/strings";

const ContentPage = () => {
  // Function to inject the React component into the page
  function injectAnalysisPanel() {
    DomUtils.injectReactComponent(
      <StrictMode>
        <NicheAnalysisPanel analysis={sampleAnalysis} />
      </StrictMode>,
      document.querySelector("#nav-main"),
      {
        id: CREATED_ENTITY.PRODUCT_ANALYTICS_CARD_ID,
        className: "amz-niche-analysis-panel",
        afterend: true,
      }
    );
  }

  useEffect(() => {
    DomUtils.waitForElement(QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS, 5000)
      .then(async () => {
        injectAnalysisPanel();
        const products = await getAmazonAllProductData();
        logInfo("Products found: ", products.length);
        logInfo("Products: ", products);
        if (products.length > 0) {
          products.forEach((product) => {
            const el = DomUtils.qs(
              QUERY_SELECTORS.INNER_SECTION.S_1,
              product.element
            );
            if (el) {
              const metadata = {
                salesRank: product.bestSellersRank?.bsr || "N/A",
                dateAdded: product.dateFirstAvailable || "N/A",
                dimensions: product.dimensions || "N/A",
                weight: product.weight || "N/A",
                asin: product.asin || "N/A",
                countryOfOrigin: product.countryOfOrigin || "N/A",
              };
              DomUtils.injectReactComponent(
                <StrictMode>
                  <ProductMetadataCard metadata={metadata} />
                </StrictMode>,
                el,
                {
                  id: CREATED_ENTITY.PRODUCT_METADATA_CARD_ID,
                  className: "amz-product-metadata-card",
                  prepend: true,
                }
              );
            }
          });
        }
      })
      .catch((error) => console.error("Error waiting for products", error));
  }, []);

  const injectProductSpecs = () => {};

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <FloatingActionButton onClick={injectProductSpecs} />
    </div>
  );
};

export default ContentPage;
