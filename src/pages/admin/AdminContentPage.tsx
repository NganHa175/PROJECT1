import { useState, useMemo } from "react";
import { Search, Edit, Eye, EyeOff, Lock, Unlock, Film, Tv } from "lucide-react";
import { Link } from "react-router";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";
import type { Movie, PublicationStatus, AccessMode } from "@/types";
import { toast } from "sonner";

type ContentItem = { id: string; title: string; type: "MOVIE" | "SERIES"; genres: string[]; releaseYear: number; publicationStatus: PublicationStatus; accessMode: AccessMode; resolvedPrice: number; popularity: number; };

export default function AdminContentPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MOVIE" | "SERIES">("ALL");
  const [pubFilter, setPubFilter] = useState<"ALL" | "PUBLISHED" | "HIDDEN">("ALL");
  const [accessFilter, setAccessFilter] = useState<"ALL" | "FREE" | "LOCKED">("ALL");
  const [statuses, setStatuses] = useState<Record<string, PublicationStatus>>({});
  const [accessModes, setAccessModes] = useState<Record<string, AccessMode>>({});

  const allItems: ContentItem[] = [
    ...MOCK_MOVIES.map((m) => ({ id: m.id, title: m.title, type: "MOVIE" as const, genres: m.genres, releaseYear: m.releaseYear, publicationStatus: statuses[m.id] ?? m.publicationStatus, accessMode: accessModes[m.id] ?? m.accessMode, resolvedPrice: m.resolvedPrice, popularity: m.popularity })),
    ...MOCK_SERIES.map((s) => ({ id: s.id, title: s.title, type: "SERIES" as const, genres: s.genres, releaseYear: s.releaseYear, publicationStatus: statuses[s.id] ?? s.publicationStatus, accessMode: accessModes[s.id] ?? s.defaultAccessMode, resolvedPrice: 0, popularity: s.popularity })),
  ];

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (pubFilter !== "ALL" && item.publicationStatus !== pubFilter) return false;
      if (accessFilter !== "ALL" && item.accessMode !== accessFilter) return false;
      return true;
    }).sort((a, b) => b.popularity - a.popularity);
  }, [search, typeFilter, pubFilter, accessFilter, allItems]);

  function togglePub(id: string, current: PublicationStatus) {
    const next: PublicationStatus = current === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    setStatuses((p) => ({ ...p, [id]: next }));
    toast.success(`Content ${next === "PUBLISHED" ? "published" : "hidden"}`);
  }

  function toggleAccess(id: string, current: AccessMode) {
    const next: AccessMode = current === "FREE" ? "LOCKED" : "FREE";
    setAccessModes((p) => ({ ...p, [id]: next }));
    toast.success(`Access changed to ${next}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-red-700 transition-colors">
          Import from TMDb
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title..." className="pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 w-56" />
        </div>
        {[
          { label: "Type", value: typeFilter, set: setTypeFilter, options: ["ALL", "MOVIE", "SERIES"] },
          { label: "Status", value: pubFilter, set: setPubFilter, options: ["ALL", "PUBLISHED", "HIDDEN"] },
          { label: "Access", value: accessFilter, set: setAccessFilter, options: ["ALL", "FREE", "LOCKED"] },
        ].map(({ label, value, set, options }) => (
          <select key={label} value={value} onChange={(e) => (set as (v: string) => void)(e.target.value)} className="px-3 py-2 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary/50">
            {options.map((o) => <option key={o} value={o}>{o === "ALL" ? `All ${label}s` : o}</option>)}
          </select>
        ))}
        <span className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} items</span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Type", "Genres", "Year", "Status", "Access", "Price", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.type === "MOVIE" ? <Film className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <Tv className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                      <span className="text-foreground font-medium truncate max-w-[180px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.type}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{item.genres.slice(0, 2).join(", ")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.releaseYear}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.publicationStatus === "PUBLISHED" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/30 text-amber-400"}`}>
                      {item.publicationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.accessMode === "FREE" ? "bg-blue-900/30 text-blue-400" : "bg-muted text-muted-foreground"}`}>
                      {item.accessMode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground text-xs">
                    {item.accessMode === "LOCKED" && item.resolvedPrice > 0 ? `${item.resolvedPrice.toLocaleString("vi-VN")} VND` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {item.type === "MOVIE" ? (
                        <Link to={`/admin/movies/${item.id}`} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5 text-foreground" />
                        </Link>
                      ) : (
                        <Link to={`/admin/series/${item.id}`} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5 text-foreground" />
                        </Link>
                      )}
                      <button onClick={() => togglePub(item.id, item.publicationStatus)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title={item.publicationStatus === "PUBLISHED" ? "Hide" : "Publish"}>
                        {item.publicationStatus === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5 text-foreground" /> : <Eye className="w-3.5 h-3.5 text-foreground" />}
                      </button>
                      <button onClick={() => toggleAccess(item.id, item.accessMode)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors" title={item.accessMode === "LOCKED" ? "Make Free" : "Lock"}>
                        {item.accessMode === "LOCKED" ? <Unlock className="w-3.5 h-3.5 text-foreground" /> : <Lock className="w-3.5 h-3.5 text-foreground" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
