import { useState } from "react";
import { History, Trash2, Play, Clock } from "lucide-react";
import { Link } from "react-router";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_WATCH_HISTORY } from "@/mocks/transactions";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";

export default function HistoryPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [removed, setRemoved] = useState<string[]>([]);
  const [clearOpen, setClearOpen] = useState(false);
  const [cleared, setCleared] = useState(false);

  const history = isAuthenticated && !cleared
    ? MOCK_WATCH_HISTORY.filter((h) => h.userId === currentUser!.id && !removed.includes(h.id))
    : [];

  function getPoster(h: typeof history[0]) {
    if (h.contentType === "MOVIE") return MOCK_MOVIES.find((m) => m.id === h.contentId)?.posterUrl ?? "";
    return MOCK_SERIES.find((s) => s.seasons.some((season) => season.episodes.some((ep) => ep.id === h.contentId)))?.posterUrl ?? "";
  }

  if (!isAuthenticated) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold text-foreground mb-4">Sign in to view your Watch History</h1></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <History className="w-6 h-6" /> Watch History
        </h1>
        {history.length > 0 && (
          <button onClick={() => setClearOpen(true)} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-4">
          <History className="w-14 h-14 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold text-foreground">No watch history</h3>
          <p className="text-muted-foreground text-sm">Start watching to see your history here.</p>
          <Link to="/movies" className="text-primary hover:underline text-sm">Browse Movies</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((h) => {
            const poster = getPoster(h);
            const progressPct = h.totalSeconds > 0 ? Math.min(100, (h.progressSeconds / h.totalSeconds) * 100) : 0;
            const remaining = Math.round((h.totalSeconds - h.progressSeconds) / 60);
            const watchHref = h.contentType === "MOVIE" ? `/watch/movie/${h.contentId}` : `/watch/episode/${h.contentId}`;

            return (
              <div key={h.id} className="group flex gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex-shrink-0 relative w-28 aspect-video rounded-xl overflow-hidden">
                  {poster ? (
                    <img src={poster} alt={h.contentTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-black/40">
                    <div className="h-full bg-primary" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm mb-0.5 truncate">{h.contentTitle}</p>
                  {h.episodeInfo && (
                    <p className="text-muted-foreground text-xs mb-1">{h.episodeInfo.seriesTitle} · S{h.episodeInfo.season}E{h.episodeInfo.episode}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{Math.round(progressPct)}% watched</span>
                    {remaining > 0 && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{remaining}m remaining</span>}
                    <span>{new Date(h.lastWatchedAt).toLocaleDateString()}</span>
                  </div>
                  <Link to={watchHref} className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                    <Play className="w-3 h-3 fill-white" /> Continue
                  </Link>
                </div>

                <button onClick={() => setRemoved((r) => [...r, h.id])} className="self-start w-7 h-7 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/70 flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={() => { setCleared(true); setClearOpen(false); }}
        title="Clear Watch History"
        description="Are you sure you want to clear your entire watch history? This action cannot be undone."
        confirmLabel="Clear All"
        variant="danger"
      />
    </div>
  );
}
