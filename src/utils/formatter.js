import moment from "moment";
import numeral from "numeral";

/**
 * Converts a human-readable date like "October 27, 2023" to "2023-10-27"
 * @param dateString - A date string in the format 'MMMM D, YYYY'
 * @returns formatted ISO string e.g. '2023-10-27'
 */
export function formatReadableDateToISO(dateString) {
  if (!dateString) return null;
  return moment(dateString, "MMMM D, YYYY").format("YYYY-MM-DD");
}

/**
 * Converts a static ISO date into a human-friendly relative time
 * e.g. "1 day ago", "2 months ago", etc.
 *
 * @param isoDate - A date string like '2023-10-27'
 * @returns Relative string like '8 months ago'
 */
export function formatRelativeDateToNow(isoDate) {
  if (!isoDate) return null;
  return moment(isoDate).fromNow();
}

/**
 * Shortens a number to a brief, human-readable string
 * e.g. 1000 -> "1K", 10000 -> "10K", etc.
 * @param value - The value to format
 * @returns The formatted string
 */
export function formatShortNumber(value) {
  if (value === null || value === undefined) return "N/A";
  if (typeof value !== "number" || isNaN(value)) return "-";
  return numeral(value).format("0.[0]a").toUpperCase();
}
