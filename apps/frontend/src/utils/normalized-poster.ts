/**
 * Helpers for working with normalized catalog DTOs (@popcornpicks/types).
 */

/** TMDB CDN path ("/abc.jpg") out of a normalized absolute poster/backdrop URL. */
export function posterPathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = "/t/p/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const rest = url.slice(i + marker.length); // "w500/abc.jpg"
  const slash = rest.indexOf("/");
  return slash === -1 ? null : rest.slice(slash);
}
