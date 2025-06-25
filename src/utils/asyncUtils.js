export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBackoff(fn, retries = 3, delayMs = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    const jitter = Math.random() * 300;
    await delay(delayMs + jitter);
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
}
