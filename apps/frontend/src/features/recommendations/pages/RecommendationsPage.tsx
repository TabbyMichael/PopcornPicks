import { RefreshCw } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import MovieCard from "@/features/movies/components/MovieCard";
import { useRecommendations } from "@/features/recommendations/hooks/useRecommendations";

const RecommendationsPage = () => {
  const { recommendationSections, loading, error, refreshing, handleRefresh } =
    useRecommendations();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="space-y-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="aspect-[2/3] rounded bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">{error}</p>
        <Button variant="primary-red" className="mt-6" onClick={handleRefresh}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">For you</h1>
          <p className="mt-2 text-muted-foreground">
            Curated picks based on trending, popularity, and rating signals.
          </p>
        </div>
        <Button
          variant="glass"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </header>

      {recommendationSections.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No recommendations available right now.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {recommendationSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-netflix-red">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                    <Badge variant="secondary" className="mt-1 bg-secondary text-secondary-foreground">
                      {section.reason}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {section.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
