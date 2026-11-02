import { Film, Globe, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/shared/components/ui/card";
import MovieCard from "@/features/movies/components/MovieCard";
import { TrailerModal } from "@/shared/components/TrailerModal";
import { formatCurrency } from "@/utils/format";
import { posterPathFromUrl } from "@/utils/normalized-poster";
import type { Credit, Movie, MovieDetails } from "@popcornpicks/types";

interface MovieDetailsGridProps {
  movie: MovieDetails;
  credits: Credit[] | null;
  userRating: number;
  onRate: (rating: number) => void;
  similarMovies: Movie[];
  recommendations: Movie[];
  showTrailer: boolean;
  trailerKey: string | null;
  onCloseTrailer: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DetailsColumn = ({
  movie,
  credits,
}: {
  movie: MovieDetails;
  credits: Credit[] | null;
}) => {
  // Cast entries carry a `character`; crew carry a `job`.
  const cast = (credits ?? []).filter((c) => c.character);
  return (
    <div className="space-y-6 lg:col-span-2">
      <Card className="border border-white/10 bg-card">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Cast</h3>
          {cast.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="text-center">
                  {actor.profileUrl ? (
                    <img
                      src={actor.profileUrl}
                      alt={actor.name}
                      className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        t.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className="mx-auto mb-2 hidden h-16 w-16 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {initials(actor.name)}
                  </div>
                  <p className="truncate text-sm font-medium text-foreground">{actor.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{actor.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Cast information not available.</p>
          )}
        </CardContent>
      </Card>

      {movie.productionCompanies.length > 0 && (
        <Card className="border border-white/10 bg-card">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Production companies</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {movie.productionCompanies.map((company) => (
                <div key={company.id} className="text-center">
                  {company.logoUrl ? (
                    <div className="mb-2 flex h-16 items-center justify-center rounded bg-white/5 p-2">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-2 flex h-16 items-center justify-center rounded bg-white/5">
                      <Film className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <p className="truncate text-sm text-foreground">{company.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-white/10 bg-card">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Movie information</h3>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="text-foreground">{movie?.status || "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Original language</dt>
              <dd className="text-foreground">
                {movie?.language?.toUpperCase() || "Unknown"}
              </dd>
            </div>
            {movie?.budget ? (
              <div>
                <dt className="text-sm text-muted-foreground">Budget</dt>
                <dd className="text-foreground">{formatCurrency(movie.budget)}</dd>
              </div>
            ) : null}
            {movie?.revenue ? (
              <div>
                <dt className="text-sm text-muted-foreground">Revenue</dt>
                <dd className="text-foreground">{formatCurrency(movie.revenue)}</dd>
              </div>
            ) : null}
            {movie?.homepage && (
              <div>
                <dt className="text-sm text-muted-foreground">Website</dt>
                <dd>
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" /> Visit website
                  </a>
                </dd>
              </div>
            )}
            {movie?.imdbId && (
              <div>
                <dt className="text-sm text-muted-foreground">IMDb</dt>
                <dd>
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Film className="h-4 w-4" /> View on IMDb
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

const SidebarColumn = ({
  movie,
  userRating,
  onRate,
}: {
  movie: MovieDetails;
  userRating: number;
  onRate: (rating: number) => void;
}) => (
  <div className="space-y-6">
    <Card className="border border-white/10 bg-card">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Rate this movie</h3>
        <div className="mb-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(star)}
              className="p-1 transition-colors"
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                className={`h-7 w-7 ${
                  star <= userRating
                    ? "fill-netflix-red text-netflix-red"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            You rated this movie {userRating} star{userRating !== 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>

    {movie.belongsToCollection && (
      <Card className="border border-white/10 bg-card">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Part of a collection</h3>
          <div className="relative overflow-hidden rounded">
            {movie.belongsToCollection.backdropUrl ? (
              <img
                src={movie.belongsToCollection.backdropUrl}
                alt={movie.belongsToCollection.name}
                className="h-32 w-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center bg-secondary">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h4 className="text-sm font-semibold text-white">
                {movie.belongsToCollection.name}
              </h4>
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const RelatedSection = ({
  title,
  movies,
  viewMoreLink = "/browse",
}: {
  title: string;
  movies: Movie[];
  viewMoreLink?: string;
}) => {
  if (!movies || movies.length === 0) return null;
  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Link
          to={viewMoreLink}
          className="text-sm text-foreground/70 hover:text-netflix-red transition-colors"
        >
          View more
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {movies.slice(0, 5).map((m) => (
          <MovieCard
            key={m.id}
            movie={{
              id: m.id,
              title: m.title,
              poster_path: posterPathFromUrl(m.posterUrl),
              backdrop_path: posterPathFromUrl(m.backdropUrl),
              vote_average: m.voteAverage,
              release_date: m.releaseDate,
              genre_ids: m.genreIds,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export const MovieDetailsGrid = ({
  movie,
  credits,
  userRating,
  onRate,
  similarMovies,
  recommendations,
  showTrailer,
  trailerKey,
  onCloseTrailer,
}: MovieDetailsGridProps) => (
  <>
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <DetailsColumn movie={movie} credits={credits} />
        <SidebarColumn movie={movie} userRating={userRating} onRate={onRate} />
      </div>
    </div>

    <RelatedSection title="Similar movies" movies={similarMovies} />
    <RelatedSection title="Recommendations" movies={recommendations} />

    <TrailerModal
      trailerKey={showTrailer ? trailerKey : null}
      onClose={onCloseTrailer}
      title={movie?.title ? `${movie.title} — trailer` : undefined}
    />
  </>
);
