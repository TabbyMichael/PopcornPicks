import { Filter, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import MovieCard from "@/features/movies/components/MovieCard";
import { useMovieSearch } from "@/features/search/hooks/useMovieSearch";

const SearchPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    ratingRange,
    setRatingRange,
    yearRange,
    setYearRange,
    filteredMovies,
    loading,
    genres,
    handleSearch,
  } = useMovieSearch();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Search movies</h1>
        <p className="mt-2 text-muted-foreground">
          Find a movie by title, filter by genre, rating, or release year.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="mb-6 flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 bg-card border-border"
          />
        </div>
        <Button type="submit" variant="primary-red" size="lg" className="h-10 px-6">
          Search
        </Button>
      </form>

      <Card className="mb-8 border border-white/10 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">Genre</label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g.id} value={g.name}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">
              Rating: {ratingRange[0]} – {ratingRange[1]}
            </label>
            <Slider
              value={ratingRange}
              onValueChange={setRatingRange}
              max={10}
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">
              Year: {yearRange[0]} – {yearRange[1]}
            </label>
            <Slider
              value={yearRange}
              onValueChange={setYearRange}
              max={2024}
              min={2000}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full rounded bg-muted" />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: (movie as { backdrop_path?: string | null }).backdrop_path ?? null,
                vote_average: movie.vote_average || 0,
                release_date: movie.release_date || "",
                genre_ids: movie.genre_ids,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-foreground">No movies found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different query or loosen the filters."
              : "Enter a title above to start searching."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
