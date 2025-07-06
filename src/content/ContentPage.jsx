import { StrictMode, useEffect } from "react";
import FloatingActionButton from "../components/FAB/FloatingActionButton";
import { DomUtils, logInfo } from "../utils";
import { CREATED_ENTITY, QUERY_SELECTORS } from "../constants/selectors";
import { getAllProducts } from "../lib/amazon/extractAmazonProductDataUtils";
import NicheAnalysisPanel from "../components/product/NicheAnalysisPanel";

const ContentPage = () => {
  useEffect(() => {
    const renderProductData = async () => {
      try {
        await DomUtils.waitForElement(
          QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS,
          5000
        );

        const rawProducts = getAllProducts();
        injectAnalysisPanel(rawProducts);
      } catch (error) {
        logInfo("Error waiting for products", error);
      }
    };

    renderProductData();
  }, []);

  const injectAnalysisPanel = (rawProducts) => {
    DomUtils.injectReactComponent(
      <StrictMode>
        <NicheAnalysisPanel rawProducts={rawProducts} />
      </StrictMode>,
      DomUtils.qs(QUERY_SELECTORS.ANALYSIS_SECTION),
      {
        id: CREATED_ENTITY.PRODUCT_ANALYTICS_CARD_ID,
        className: "amz-niche-analysis-panel",
        prepend: true,
      }
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <FloatingActionButton onClick={() => {}} />
    </div>
  );
};

export default ContentPage;
