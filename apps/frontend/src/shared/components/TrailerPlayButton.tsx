import { useState } from "react";
import { Loader2, Play } from "lucide-react";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { TrailerModal } from "@/shared/components/TrailerModal";
import { catalogApi } from "@popcornpicks/api-client";

interface TrailerPlayButtonProps extends Omit<ButtonProps, "onClick"> {
  movieId: number;
  movieTitle?: string;
  label?: string;
}

/**
 * Self-contained "▶ Play trailer" button.
 * Fetches the YouTube key from our backend on click (never on mount),
 * then opens the shared TrailerModal. Prefers official Trailer > Teaser > first video.
 */
export const TrailerPlayButton = ({
  movieId,
  movieTitle,
  label = "Play trailer",
  variant = "primary-red",
  size = "default",
  className,
  ...rest
}: TrailerPlayButtonProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { videos } = await catalogApi.movies.videos(movieId);
      const results = videos ?? [];
      const pick =
        results.find((v) => v.type === "Trailer" && v.site === "YouTube" && v.official) ??
        results.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
        results.find((v) => v.type === "Teaser" && v.site === "YouTube") ??
        results.find((v) => v.site === "YouTube") ??
        null;
      if (!pick) {
        setError("No trailer available.");
        return;
      }
      setTrailerKey(pick.key);
    } catch {
      setError("Could not load the trailer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={loading}
        aria-label={label}
        {...rest}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className={rest.children ? undefined : "ml-2"}>{label}</span>
      </Button>

      {error && !trailerKey && (
        <span className="ml-2 text-xs text-destructive">{error}</span>
      )}

      <TrailerModal
        trailerKey={trailerKey}
        onClose={() => setTrailerKey(null)}
        title={movieTitle ? `${movieTitle} — trailer` : undefined}
      />
    </>
  );
};

export default TrailerPlayButton;
