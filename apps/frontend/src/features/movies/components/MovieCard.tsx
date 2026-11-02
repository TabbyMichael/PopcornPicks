
import { Check, Play, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useToast } from "@/shared/components/ui/use-toast";
import { TrailerPlayButton } from "@/shared/components/TrailerPlayButton";
import { getImageUrl } from "@/utils/format";
import { useWatchlist } from "@/features/watchlist/context/WatchlistContext";

// Updated interface to match TMDB API structure
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  genreName?: string; // For processed genre name
  video?: boolean; // TMDB flag: a trailer is available for this movie
}

interface MovieCardProps {
  movie: Movie;
  showAddToWatchlist?: boolean;
}

const PLACEHOLDER_POSTER =
  "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image";

const MovieCard = ({ movie, showAddToWatchlist = true }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { toast } = useToast();

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast({
        title: "Removed from watchlist",
        description: `${movie.title} has been removed from your watchlist`,
        variant: "default",
      });
      return;
    }
    addToWatchlist(movie);
    toast({
      title: "Added to watchlist",
      description: `${movie.title} has been added to your watchlist`,
      variant: "default",
    });
  };

  return (
    <Card className="group overflow-hidden border border-white/10 bg-card transition-colors hover:border-white/20">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_path ? getImageUrl(movie.poster_path, "w500") : PLACEHOLDER_POSTER}
          alt={movie.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== PLACEHOLDER_POSTER) target.src = PLACEHOLDER_POSTER;
          }}
        />
        {/* Readability scrim for overlays */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Rating pill */}
        <Badge className="absolute right-3 top-3 border border-white/10 bg-black/70 text-white backdrop-blur-sm">
          <Star className="mr-1 h-3 w-3 fill-netflix-red text-netflix-red" />
          {movie.vote_average.toFixed(1)}
        </Badge>

        {/* Genre pill */}
        {movie.genreName && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 border border-white/10 bg-black/60 text-white/90 backdrop-blur-sm"
          >
            {movie.genreName}
          </Badge>
        )}

        {/* Hover actions */}
        <div className="absolute inset-x-4 bottom-4 flex translate-y-2 gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <Link to={`/movie/${movie.id}`} className="flex-1">
            <Button size="sm" variant="glass" className="w-full gap-1">
              <Play className="h-3 w-3" />
              Details
            </Button>
          </Link>
          <TrailerPlayButton
            movieId={movie.id}
            movieTitle={movie.title}
            label=""
            variant="primary-red"
            size="sm"
            className="px-2"
            aria-label={`Play trailer for ${movie.title}`}
          />
          {showAddToWatchlist && (
            <Button
              size="sm"
              variant={inWatchlist ? "primary-red" : "glass"}
              onClick={handleWatchlistClick}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="truncate font-semibold text-foreground transition-colors hover:text-netflix-red">
            {movie.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
