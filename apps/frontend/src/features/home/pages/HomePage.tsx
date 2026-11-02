import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { TrailerPlayButton } from "@/shared/components/TrailerPlayButton";
import { LiquidGlassPanel } from "@/shared/components/liquid-glass/LiquidGlassPanel";
import MovieCard from "@/features/movies/components/MovieCard";
import { useTrendingMovies } from "@/features/home/hooks/useTrendingMovies";

const DEFAULT_BACKDROP =
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop";

const HomePage = () => {
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);
  const { trendingMovies, loading, error } = useTrendingMovies();

  // Once trending data arrives, use the first movie's backdrop as hero art.
  useEffect(() => {
    const first = trendingMovies[0];
    if (first?.backdrop_path) {
      setBackdropUrl(`https://image.tmdb.org/t/p/original${first.backdrop_path}`);
    }
  }, [trendingMovies]);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <img
          src={backdropUrl ?? DEFAULT_BACKDROP}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_BACKDROP) target.src = DEFAULT_BACKDROP;
          }}
        />
        {/* Netflix-style readability scrim: transparent top, near-black bottom. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-background" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {trendingMovies[0]?.title ?? "Trending now"}
          </h1>

          <LiquidGlassPanel
            mode="prominent"
            borderRadius={20}
            blurAmount={8}
            displacementScale={70}
            aberrationIntensity={10}
            padding="12px 16px"
            className="mt-8 max-w-fit"
          >
            <div className="flex flex-wrap gap-3">
              {trendingMovies[0] && (
                <TrailerPlayButton
                  movieId={trendingMovies[0].id}
                  movieTitle={trendingMovies[0].title}
                  label="Watch trailer"
                  variant="primary-red"
                  size="lg"
                />
              )}
              {trendingMovies[0] && (
                <Link to={`/movies/${trendingMovies[0].id}`}>
                  <Button variant="glass" size="lg">
                    More info
                  </Button>
                </Link>
              )}
            </div>
          </LiquidGlassPanel>
        </div>
      </section>

      {/* Trending row */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Trending now</h2>
          <Link
            to="/browse"
            className="text-sm font-medium text-foreground/70 hover:text-netflix-red transition-colors"
          >
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full rounded bg-muted" />
            ))}
          </div>
        ) : error ? (
          <p className="rounded border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            Failed to load trending movies. Check your connection and try again.
          </p>
        ) : trendingMovies.length === 0 ? (
          <p className="text-foreground/60">No movies available right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trendingMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
