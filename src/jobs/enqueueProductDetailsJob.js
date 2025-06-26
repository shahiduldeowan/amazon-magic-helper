import { extractProductDetails } from "../lib/amazon/extractAmazonProductDataUtils";
import { delay, fetchHTML, logInfo } from "../utils";

export async function enqueueProductDetailsJob(products, batchSize = 10) {
  const queue = [...products];
  while (queue.length > 0) {
    const batch = queue.splice(0, batchSize);
    await Promise.all(
      batch.map(async (product) => {
        const doc = await fetchHTML(product.productUrl || "");
        const detailData = extractProductDetails(doc);
        if (detailData) {
          Object.assign(product, detailData);
          logInfo(`[Combined Data] ${product.asin}`);
        }
        await delay(200 + Math.random() * 100);
      })
    );
    await delay(1000 + Math.random() * 500); // batch delay
  }
  return products;
}
