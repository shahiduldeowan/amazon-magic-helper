export function hasKeyAndValue(obj, key) {
  return key in obj && Boolean(obj[key]);
}
