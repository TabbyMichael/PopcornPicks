import {
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Filter,
  Grid,
  List,
  Play,
  Search,
  SortAsc,
  Star,
  Target,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useWatchlistPage } from "@/features/watchlist/hooks/useWatchlistPage";

const WatchlistPage = () => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    viewMode,
    setViewMode,
    loading,
    activeTab,
    setActiveTab,
    filteredAndSortedMovies,
    watchedMovies,
    unwatchedMovies,
    totalWatchTime,
    averageRating,
    handleRemoveFromWatchlist,
    updateRating,
    toggleWatched,
  } = useWatchlistPage();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">My Watchlist</h1>
        <p className="mt-2 text-muted-foreground">
          Your curated collection — track what to watch next.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total movies" value={String(movies.length)} icon={Bookmark} />
          <StatCard label="Watched" value={String(watchedMovies.length)} icon={Eye} />
          <StatCard
            label="Watch time"
            value={`${Math.round(totalWatchTime / 60)}h`}
            icon={Clock}
          />
          <StatCard
            label="Avg rating"
            value={averageRating.toFixed(1)}
            icon={Star}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/search">
            <Button variant="primary-red" className="gap-2">
              <Search className="h-4 w-4" />
              Discover more movies
            </Button>
          </Link>
          <Link to="/recommendations">
            <Button variant="glass" className="gap-2">
              <Target className="h-4 w-4" />
              Get recommendations
            </Button>
          </Link>
        </div>
      </header>

      {/* Filters */}
      <section className="mb-8 rounded-lg border border-white/10 bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 bg-background border-border"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-10 bg-background border-border">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Date added</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
                <SelectItem value="year">Release year</SelectItem>
                <SelectItem value="rating">TMDB rating</SelectItem>
                <SelectItem value="userRating">My rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40 h-10 bg-background border-border">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All movies</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="unwatched">Not watched</SelectItem>
                <SelectItem value="rated">Rated by me</SelectItem>
              </SelectContent>
            </Select>

            <div className="inline-flex rounded-md border border-border bg-card p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full max-w-lg grid-cols-3 bg-background border border-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              All ({movies.length})
            </TabsTrigger>
            <TabsTrigger value="unwatched" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              To watch ({unwatchedMovies.length})
            </TabsTrigger>
            <TabsTrigger value="watched" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">
              Watched ({watchedMovies.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Content */}
      {filteredAndSortedMovies.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No movies found" : "Your watchlist is empty"}
          description={
            searchQuery
              ? "Try adjusting your search terms or filters."
              : "Add movies from Browse or Search to build your collection."
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedMovies.map((movie) => (
            <Card
              key={movie.id}
              className="group overflow-hidden border border-white/10 bg-card transition-colors hover:border-white/20"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <button
                  onClick={() => handleRemoveFromWatchlist(movie.id)}
                  aria-label="Remove from watchlist"
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-netflix-red group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>

                <Badge
                  className="absolute left-2 top-2 border border-white/10 bg-black/70 text-white backdrop-blur-sm"
                >
                  {movie.watched ? (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      Watched
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-3 w-3" />
                      To watch
                    </>
                  )}
                </Badge>

                <div className="absolute inset-x-4 bottom-4 flex translate-y-2 gap-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <Link to={`/movie/${movie.id}`} className="flex-1">
                    <Button size="sm" variant="glass" className="w-full gap-1">
                      <Play className="h-3 w-3" />
                      Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={movie.watched ? "glass" : "primary-red"}
                    onClick={() => toggleWatched(movie.id)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="truncate text-lg font-semibold text-foreground">{movie.title}</h3>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {movie.year}
                  </span>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {movie.genre}
                  </Badge>
                </div>
                {movie.runtime && (
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {movie.runtime} min
                  </p>
                )}
                <RatingRow
                  value={movie.userRating}
                  onChange={(v) => updateRating(movie.id, v === movie.userRating ? 0 : v)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedMovies.map((movie) => (
            <Card
              key={movie.id}
              className="border border-white/10 bg-card transition-colors hover:border-white/20"
            >
              <div className="flex">
                <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden">
                  <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                  <Badge className="absolute left-1 top-1 border-white/10 bg-black/70 text-xs text-white">
                    {movie.watched ? "Watched" : "To watch"}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-foreground">{movie.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {movie.year}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-4 w-4 fill-netflix-red text-netflix-red" />
                            {movie.rating}
                          </span>
                          {movie.runtime && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {movie.runtime} min
                            </span>
                          )}
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                            {movie.genre}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWatchlist(movie.id)}
                        aria-label="Remove from watchlist"
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {movie.overview && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {movie.overview}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <RatingRow
                      value={movie.userRating}
                      onChange={(v) => updateRating(movie.id, v === movie.userRating ? 0 : v)}
                      inline
                    />
                    <div className="flex gap-2">
                      <Link to={`/movie/${movie.id}`}>
                        <Button size="sm" variant="glass" className="gap-1">
                          <Play className="h-3 w-3" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant={movie.watched ? "glass" : "primary-red"}
                        onClick={() => toggleWatched(movie.id)}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        {movie.watched ? "Watched" : "Mark watched"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="rounded-lg border border-white/10 bg-card p-4">
    <div className="mb-1 text-2xl font-bold text-foreground">{value}</div>
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </div>
  </div>
);

const RatingRow = ({
  value,
  onChange,
  inline,
}: {
  value: number;
  onChange: (v: number) => void;
  inline?: boolean;
}) => (
  <div className={`mt-3 flex ${inline ? "items-center gap-2" : "items-center justify-between"}`}>
    <span className="text-xs text-muted-foreground">Your rating:</span>
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="p-0.5"
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={`h-4 w-4 ${
              star <= value
                ? "fill-netflix-red text-netflix-red"
                : "text-muted-foreground hover:text-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  </div>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="py-16 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
      <Bookmark className="h-8 w-8 text-muted-foreground" />
    </div>
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-muted-foreground">{description}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link to="/search">
        <Button variant="primary-red" className="gap-2">
          <Search className="h-4 w-4" />
          Browse movies
        </Button>
      </Link>
      <Link to="/recommendations">
        <Button variant="glass" className="gap-2">
          <Target className="h-4 w-4" />
          Get recommendations
        </Button>
      </Link>
    </div>
  </div>
);

export default WatchlistPage;
