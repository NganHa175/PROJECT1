import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { movies: [], series: [] };
    const q = query.toLowerCase();
    return {
      movies: MOCK_MOVIES.filter((m) => m.publicationStatus === "PUBLISHED" && m.title.toLowerCase().includes(q)),
      series: MOCK_SERIES.filter((s) => s.publicationStatus === "PUBLISHED" && s.title.toLowerCase().includes(q)),
    };
  }, [query]);

  const total = results.movies.length + results.series.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="max-w-xl mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Search</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search movies and series..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-base"
          />
        </div>
      </div>

      {query && (
        <p className="text-muted-foreground text-sm mb-6">{total} result{total !== 1 ? "s" : ""} for "{query}"</p>
      )}

      {results.movies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.movies.map((m) => <MovieCard key={m.id} item={m} type="movie" className="w-full" />)}
          </div>
        </section>
      )}

      {results.series.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">TV Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.series.map((s) => <MovieCard key={s.id} item={s} type="series" className="w-full" />)}
          </div>
        </section>
      )}

      {query && total === 0 && (
        <div className="flex flex-col items-center py-16 text-center gap-4">
          <Search className="w-14 h-14 text-muted-foreground opacity-40" />
          <h3 className="text-lg font-semibold text-foreground">No results found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">Try different keywords or browse our catalog.</p>
        </div>
      )}

      {!query && (
        <div className="flex flex-col items-center py-16 text-center gap-3">
          <Search className="w-14 h-14 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground text-sm">Start typing to search movies and series</p>
        </div>
      )}
    </div>
  );
}
