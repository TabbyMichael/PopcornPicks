/**
 * Pure, client-safe presentation helpers. These touch no API - the TMDB image
 * CDN is public and these are formatting utilities only (ADR-0003 compliant).
 */

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

/** Builds a TMDB CDN URL from a bare path ("/abc.jpg"); placeholder when absent. */
export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

/** "139" -> "2h 19m". */
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
};

/** 63000000 -> "$63,000,000". */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
