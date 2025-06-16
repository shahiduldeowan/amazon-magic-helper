import { useEffect } from "react";
import FloatingActionButton from "../components/FAB/FloatingActionButton";
import dom from "../lib/dom";
import { QUERY_SELECTORS } from "../constants/selectors";

const ContentPage = () => {
  useEffect(() => {
    dom
      .waitForElement(QUERY_SELECTORS.SEARCH_PRODUCT_CONTAINERS, 5000)
      .then(() => {
        const productContainers = dom.findAmazonProductContainers();

        console.log("Product containers found:", productContainers.length);

        if (productContainers.length > 0) {
          const products = productContainers.map((element) =>
            dom.getProductData(element)
          );
          console.log("Product data:", products);
          // productContainers.forEach((container, index) => {
          //   if (index < 6) {
          //     const product = dom.getProductData(container);
          //     console.log(
          //       `-->[${index}]Product data: ${JSON.stringify(product)}`
          //     );
          //   }
          // });
        }
      })
      .catch((error) => console.error("Error waiting for products", error));
  }, []);

  const injectProductSpecs = () => {
    console.log("Injecting product specs............");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <FloatingActionButton onClick={injectProductSpecs} />
    </div>
  );
};

export default ContentPage;
