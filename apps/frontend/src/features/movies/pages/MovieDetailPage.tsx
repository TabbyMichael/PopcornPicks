import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { MovieDetailsGrid } from "@/features/movies/components/MovieDetailsGrid";
import { MovieHero } from "@/features/movies/components/MovieHero";
import { useMovieDetails } from "@/features/movies/hooks/useMovieDetails";
import { useWatchlist } from "@/features/watchlist/context/WatchlistContext";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import { useToast } from "@/shared/components/ui/use-toast";

const MovieDetailPage = () => {
  const {
    movie,
    credits,
    similarMovies,
    recommendations,
    loading,
    error,
    getTrailerKey,
    getDirector,
  } = useMovieDetails();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<number>(0);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  const toggleWatchlist = () => {
    if (!movie) return;
    const payload = {
      id: movie.id,
      title: movie.title,
      poster_path: posterPathFromUrl(movie.posterUrl),
      backdrop_path: posterPathFromUrl(movie.backdropUrl),
      vote_average: movie.voteAverage,
      release_date: movie.releaseDate,
      genre_ids: movie.genreIds,
    };
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast({
        title: "Removed from watchlist",
        description: `${movie.title} has been removed from your watchlist`,
      });
    } else {
      addToWatchlist(payload);
      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist`,
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mb-6 aspect-video w-full animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Movie not found</h1>
        <p className="mt-4 text-muted-foreground">
          {error || "The requested movie could not be found."}
        </p>
        <Link to="/">
          <Button variant="primary-red" className="mt-6">
            Back to home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <MovieHero
        movie={movie}
        director={getDirector()}
        isInWatchlist={isInWatchlist(movie.id)}
        canPlayTrailer={!!getTrailerKey()}
        onToggleWatchlist={toggleWatchlist}
        onPlayTrailer={() => setShowTrailer(true)}
      />
      <MovieDetailsGrid
        movie={movie}
        credits={credits}
        userRating={userRating}
        onRate={setUserRating}
        similarMovies={similarMovies || []}
        recommendations={recommendations || []}
        showTrailer={showTrailer}
        trailerKey={getTrailerKey()}
        onCloseTrailer={() => setShowTrailer(false)}
      />
    </div>
  );
};

export default MovieDetailPage;
