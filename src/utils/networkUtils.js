import { retryWithBackoff } from "./asyncUtils";

export async function fetchHTML(url) {
  return retryWithBackoff(
    async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch HTML: ${res.status} ${res.statusText}`
        );
      }

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc;
    },
    3,
    500
  );
}
