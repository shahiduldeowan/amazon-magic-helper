export function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

export function formatBSRData(input) {
  const matches = [...input.matchAll(/#([\d,]+) in ([\w\s&]+)/g)];
  if (!matches.length) return null;

  return {
    overall: matches[0]
      ? `#${matches[0][1]} in ${matches[0][2]}`.replace(/\s+/g, " ").trim()
      : null,
    category: matches[1]
      ? `#${matches[1][1]} in ${matches[1][2]}`.replace(/\s+/g, " ").trim()
      : null,
    bsr: matches[0] ? parseInt(matches[0][1].replace(/,/g, ""), 10) : null,
  };
}
