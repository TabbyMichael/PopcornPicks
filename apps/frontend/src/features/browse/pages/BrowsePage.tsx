import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  Eye,
  Filter,
  Flame,
  Grid,
  List,
  Play,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import MovieCard from "@/features/movies/components/MovieCard";
import { useBrowseMovies } from "@/features/browse/hooks/useBrowseMovies";
import { getImageUrl } from "@/utils/format";

const PLACEHOLDER_POSTER =
  "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image";

const TABS = [
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "popular", label: "Popular", icon: Flame },
  { value: "top-rated", label: "Top Rated", icon: Award },
  { value: "upcoming", label: "Upcoming", icon: Calendar },
];

const BrowsePage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    loading,
    error,
    genres,
    filteredMovies,
  } = useBrowseMovies();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">{error}</p>
        <Button
          variant="primary-red"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Browse movies</h1>
        <p className="mt-2 text-muted-foreground">
          Trending, popular, top rated, and upcoming — filter by genre or search by title.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 bg-card border-border"
          />
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-52 h-10 bg-card border-border">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g.id} value={g.name.toLowerCase()}>
                {g.name}
              </SelectItem>
            ))}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card border border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 data-[state=active]:bg-netflix-red data-[state=active]:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Movies */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full rounded bg-muted" />
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold text-foreground">No movies found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a different search term or clear your filters.
          </p>
          <Button
            variant="glass"
            className="mt-6"
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredMovies
            .filter((m) => m && m.id)
            .map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMovies
            .filter((m) => m && m.id)
            .map((movie) => (
              <Card
                key={movie.id}
                className="flex overflow-hidden border border-white/10 bg-card p-0 hover:border-white/20 transition-colors"
              >
                <div className="h-32 w-24 flex-shrink-0 overflow-hidden">
                  <img
                    src={movie.poster_path ? getImageUrl(movie.poster_path, "w200") : PLACEHOLDER_POSTER}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.src !== PLACEHOLDER_POSTER) t.src = PLACEHOLDER_POSTER;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{movie.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-netflix-red text-netflix-red" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                      {movie.genreName && (
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          {movie.genreName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/movie/${movie.id}`}>
                      <Button size="sm" variant="glass" className="gap-1">
                        <Play className="h-3 w-3" />
                        Details
                      </Button>
                    </Link>
                    <Button size="sm" variant="glass" aria-label="Preview">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
