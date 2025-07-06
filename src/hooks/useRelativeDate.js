import { useMemo } from "react";
import { formatRelativeDateToNow } from "../utils";

/**
 * Memoized hook for computing relative date text
 * @param date - ISO string or any parsable date
 * @returns Relative string like "2 months ago"
 */
export function useRelativeDate(date) {
  return useMemo(() => formatRelativeDateToNow(date), [date]);
}
