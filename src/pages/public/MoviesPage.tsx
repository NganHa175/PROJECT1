import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import UnlockModal from "@/components/movie/UnlockModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOCK_MOVIES, ALL_GENRES } from "@/mocks/movies";
import type { Movie } from "@/types";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Release Year", value: "year" },
  { label: "Title A–Z", value: "title" },
];

const YEARS = Array.from(new Set(MOCK_MOVIES.map((m) => m.releaseYear))).sort((a, b) => b - a);

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState(searchParams.get("genre") ?? "");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("popularity");
  const [access, setAccess] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [unlockTarget, setUnlockTarget] = useState<Movie | null>(null);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let list = MOCK_MOVIES.filter((m) => m.publicationStatus === "PUBLISHED");
    if (search) list = list.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    if (genre) list = list.filter((m) => m.genres.includes(genre));
    if (year) list = list.filter((m) => m.releaseYear === Number(year));
    if (access === "free") list = list.filter((m) => m.accessMode === "FREE");
    if (access === "locked") list = list.filter((m) => m.accessMode === "LOCKED");
    list = [...list].sort((a, b) => {
      if (sort === "popularity") return b.popularity - a.popularity;
      if (sort === "rating") return b.voteAverage - a.voteAverage;
      if (sort === "year") return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [search, genre, year, sort, access]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  function clearFilters() { setGenre(""); setYear(""); setAccess(""); setSearch(""); }
  const hasFilters = genre || year || access || search;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Movies</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} titles found</p>
        </div>
        <button onClick={() => setFilterOpen((o) => !o)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors md:hidden">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar / drawer */}
        <aside className={`flex-shrink-0 w-56 ${filterOpen ? "block fixed inset-y-0 right-0 z-50 bg-card border-l border-border p-6 overflow-y-auto" : "hidden md:block"}`}>
          {filterOpen && (
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-foreground">Filters</span>
              <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
          )}
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary hover:underline mb-4 block">Clear all filters</button>
          )}
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Title..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((g) => (
                  <button key={g} onClick={() => { setGenre(genre === g ? "" : g); setPage(1); }}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${genre === g ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Year</label>
              <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary/50">
                <option value="">All Years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Access */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Access</label>
              <div className="flex flex-col gap-1.5">
                {[{ label: "All", value: "" }, { label: "Free", value: "free" }, { label: "Locked", value: "locked" }].map((o) => (
                  <button key={o.value} onClick={() => { setAccess(o.value); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${access === o.value ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary/50">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </aside>
        {filterOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setFilterOpen(false)} />}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center gap-4">
              <Search className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">No movies found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="text-primary text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginated.map((m) => (
                  <MovieCard key={m.id} item={m} type="movie" className="w-full" onUnlock={(item) => setUnlockTarget(item as Movie)} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage((p) => p + 1)} className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {unlockTarget && (
        <UnlockModal open={true} onClose={() => setUnlockTarget(null)} contentId={unlockTarget.id} contentType="MOVIE" title={unlockTarget.title} price={unlockTarget.resolvedPrice} durationHours={unlockTarget.unlockDurationHours} />
      )}
    </div>
  );
}
