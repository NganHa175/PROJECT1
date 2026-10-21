import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router";
import { Star, Lock } from "lucide-react";
import { MOCK_SERIES, ALL_GENRES } from "@/mocks/movies";
import { useAuth } from "@/hooks/useAuth";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Release Year", value: "year" },
  { label: "Title A–Z", value: "title" },
];

export default function SeriesPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity");
  const [access, setAccess] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { hasPremium } = useAuth();
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let list = MOCK_SERIES.filter((s) => s.publicationStatus === "PUBLISHED");
    if (search) list = list.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    if (genre) list = list.filter((s) => s.genres.includes(genre));
    if (access === "free") list = list.filter((s) => s.defaultAccessMode === "FREE");
    if (access === "locked") list = list.filter((s) => s.defaultAccessMode === "LOCKED");
    list = [...list].sort((a, b) => {
      if (sort === "popularity") return b.popularity - a.popularity;
      if (sort === "rating") return b.voteAverage - a.voteAverage;
      if (sort === "year") return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [search, genre, sort, access]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;
  const hasFilters = genre || access || search;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">TV Series</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} series found</p>
        </div>
        <button onClick={() => setFilterOpen((o) => !o)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors md:hidden">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`flex-shrink-0 w-56 ${filterOpen ? "block fixed inset-y-0 right-0 z-50 bg-card border-l border-border p-6 overflow-y-auto" : "hidden md:block"}`}>
          {filterOpen && (
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">Filters</span>
              <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5" /></button>
            </div>
          )}
          {hasFilters && <button onClick={() => { setGenre(""); setAccess(""); setSearch(""); }} className="text-xs text-primary hover:underline mb-4 block">Clear all</button>}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Series title..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((g) => (
                  <button key={g} onClick={() => setGenre(genre === g ? "" : g)} className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${genre === g ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Access</label>
              {[{ label: "All", value: "" }, { label: "Free", value: "free" }, { label: "Locked", value: "locked" }].map((o) => (
                <button key={o.value} onClick={() => setAccess(o.value)} className={`block w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium mb-1 transition-colors ${access === o.value ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"}`}>{o.label}</button>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </aside>
        {filterOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setFilterOpen(false)} />}

        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center gap-4">
              <Search className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">No series found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginated.map((s) => {
                  const isLocked = s.defaultAccessMode === "LOCKED" && !hasPremium;
                  return (
                    <Link key={s.id} to={`/series/${s.id}`} className="group relative">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
                        <img src={s.posterUrl} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                        {isLocked && (
                          <div className="absolute top-2 left-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          </div>
                        )}
                        {s.defaultAccessMode === "FREE" && (
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white">FREE</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                          <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-[10px] font-semibold">{s.voteAverage.toFixed(1)}</span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-md font-medium">
                            {s.seasons.length} Season{s.seasons.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 px-0.5">
                        <p className="text-foreground text-sm font-medium truncate">{s.title}</p>
                        <p className="text-muted-foreground text-xs">{s.releaseYear} · {s.genres[0]}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage((p) => p + 1)} className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors">Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
