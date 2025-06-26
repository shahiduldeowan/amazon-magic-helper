import { enqueueProductDetailsJob } from "../../jobs/enqueueProductDetailsJob";
import { getProductPrices, logError, logWarn } from "../../utils";
import { AmazonDomUtils } from "./amazonDomUtils";
import { extractWeightFromDimensions } from "./helpers/extractors";

export function extractProductData(element) {
  if (!element || !(element instanceof HTMLElement)) {
    logWarn("Invalid product element provided");
    return null;
  }

  const urls = AmazonDomUtils.getUrls(element);

  try {
    return {
      category: AmazonDomUtils.getProductCategory(element),
      asin: AmazonDomUtils.getProductAsin(element),
      title: AmazonDomUtils.getProductTitle(element),
      prices: getProductPrices(element),
      reviews: AmazonDomUtils.getProductReviews(element),
      variants: AmazonDomUtils.getProductVariants(element),
      performance: AmazonDomUtils.getProductPerformance(element),
      isPrime: AmazonDomUtils.isPrimeEligible(element),
      isSponsored: AmazonDomUtils.isProductSponsored(element),
      ...urls,
      element,
    };
  } catch (error) {
    logError("Error getting complete product data:", error);
    return null;
  }
}

export function extractProductDetails(element) {
  if (!element) return null;
  try {
    const details = AmazonDomUtils.getProductDetailsFromTable(element);
    AmazonDomUtils.getProductDetailsFromList(details, element);
    extractWeightFromDimensions(details);
    return details;
  } catch (error) {
    logError("Error getting complete product data:", error);
    return null;
  }
}

export async function getAmazonAllProductData() {
  try {
    const productNodes = AmazonDomUtils.findProductContainers();
    if (!productNodes || productNodes.length === 0) {
      logWarn("No product containers found on the page");
      return [];
    }
    const productData = productNodes.map((element) =>
      extractProductData(element)
    );

    if (productData.length === 0) {
      logWarn("No valid product data extracted from the page");
      return [];
    }

    const finalProducts = await enqueueProductDetailsJob(productData);
    return finalProducts;
  } catch (error) {
    logError("Error in getAmazonAllProductData:", error);
    return [];
  }
}
