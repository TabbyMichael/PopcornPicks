import { ArrowLeft, Check, Clock, Play, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatRuntime } from "@/utils/format";
import type { MovieDetails } from "@popcornpicks/types";

interface MovieHeroProps {
  movie: MovieDetails;
  director: string;
  isInWatchlist: boolean;
  canPlayTrailer: boolean;
  onToggleWatchlist: () => void;
  onPlayTrailer: () => void;
}

const FALLBACK_POSTER =
  "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image";

/** Full-bleed backdrop hero: title, key metadata, and primary actions. */
export const MovieHero = ({
  movie,
  director,
  isInWatchlist,
  canPlayTrailer,
  onToggleWatchlist,
  onPlayTrailer,
}: MovieHeroProps) => (
  <section className="relative min-h-[80vh]">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: movie.backdropUrl
          ? `url(${movie.backdropUrl})`
          : "none",
        backgroundColor: "#141414",
      }}
    />
    {/* Netflix-style readability scrim */}
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

    <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-end px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <img
          src={movie.posterUrl ?? FALLBACK_POSTER}
          alt={movie.title}
          className="mx-auto hidden w-56 rounded border border-white/10 lg:mx-0 lg:block"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.src !== FALLBACK_POSTER) t.src = FALLBACK_POSTER;
          }}
        />

        <div>
          <Link
            to="/browse"
            className="mb-4 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to browse
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="mt-2 text-lg italic text-foreground/70">"{movie.tagline}"</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/80">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-netflix-red text-netflix-red" />
              <span className="font-semibold">{movie.voteAverage.toFixed(1)}</span>
            </span>
            <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "N/A"}</span>
            {movie.runtimeMinutes && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatRuntime(movie.runtimeMinutes)}
              </span>
            )}
            {director && <span>Directed by {director}</span>}
          </div>

          {movie.genres?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <Badge key={g.id} variant="secondary" className="bg-white/10 text-white border border-white/20">
                  {g.name}
                </Badge>
              ))}
            </div>
          )}

          <p className="mt-6 max-w-3xl text-foreground/90">
            {movie.overview || "No description available."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="primary-red"
              onClick={onPlayTrailer}
              disabled={!canPlayTrailer}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {canPlayTrailer ? "Watch trailer" : "No trailer available"}
            </Button>
            <Button
              size="lg"
              variant="glass"
              onClick={onToggleWatchlist}
              className="gap-2"
            >
              {isInWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isInWatchlist ? "In watchlist" : "Add to watchlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
