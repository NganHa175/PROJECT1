import { useParams, useNavigate, Link } from "react-router";
import { ChevronLeft, Lock, Play, Crown, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";
import type { Movie, Episode } from "@/types";

function findEpisode(episodeId: string) {
  for (const series of MOCK_SERIES) {
    for (const season of series.seasons) {
      const ep = season.episodes.find((e) => e.id === episodeId);
      if (ep) return { ep, series };
    }
  }
  return null;
}

export default function WatchPage() {
  const { movieId, episodeId } = useParams();
  const { canWatch, hasPremium, getAccess } = useAuth();
  const navigate = useNavigate();

  let content: Movie | Episode | null = null;
  let title = "";
  let contentType: "MOVIE" | "EPISODE" = "MOVIE";
  let accessMode: "FREE" | "LOCKED" = "FREE";
  let resolvedPrice = 0;
  let durationHours = 0;
  let backHref = "/movies";

  if (movieId) {
    content = MOCK_MOVIES.find((m) => m.id === movieId) ?? null;
    if (content) {
      const m = content as Movie;
      title = m.title;
      accessMode = m.accessMode;
      resolvedPrice = m.resolvedPrice;
      durationHours = m.unlockDurationHours;
      backHref = `/movie/${movieId}`;
    }
  } else if (episodeId) {
    const found = findEpisode(episodeId);
    if (found) {
      content = found.ep;
      const ep = found.ep;
      title = `${found.series.title} – ${ep.title}`;
      contentType = "EPISODE";
      accessMode = ep.accessMode;
      resolvedPrice = ep.resolvedPrice;
      durationHours = ep.unlockDurationHours;
      backHref = `/series/${found.series.id}`;
    }
  }

  if (!content) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Content not found.</p>
        <Link to="/" className="text-primary hover:underline mt-4 block">Go Home</Link>
      </div>
    );
  }

  const access = getAccess(content.id);
  const watchable = canWatch({ accessMode, publicationStatus: "PUBLISHED", contentId: content.id });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <button onClick={() => navigate(backHref)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to details
      </button>

      {watchable ? (
        <div className="rounded-2xl overflow-hidden border border-border bg-black aspect-video flex items-center justify-center relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
            <p className="text-white font-semibold text-lg">{title}</p>
            <p className="text-white/50 text-sm">Video playback placeholder</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card aspect-video flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-6 max-w-sm px-4">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
              <p className="text-muted-foreground text-sm mb-2">This content is locked.</p>
              <p className="text-foreground font-semibold">{resolvedPrice.toLocaleString("vi-VN")} VND</p>
              <p className="text-muted-foreground text-xs">
                Access for {durationHours >= 24 ? `${durationHours / 24} day${durationHours / 24 !== 1 ? "s" : ""}` : `${durationHours}h`}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => navigate(backHref)} variant="primary" fullWidth>
                Unlock Content
              </Button>
              <Button onClick={() => navigate("/subscription")} variant="ghost" fullWidth>
                <Crown className="w-4 h-4" /> Or get Premium
              </Button>
              <Button onClick={() => navigate("/wallet")} variant="outline" fullWidth>
                <Plus className="w-4 h-4" /> Add Wallet Funds
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-card border border-border">
        <h3 className="text-foreground font-semibold mb-1">{title}</h3>
        {access && (
          <p className="text-emerald-400 text-sm">Unlocked until {new Date(access.expiresAt).toLocaleDateString()}</p>
        )}
        {hasPremium && accessMode === "LOCKED" && !access && (
          <p className="text-amber-400 text-sm flex items-center gap-1"><Crown className="w-3 h-3" /> Included with Premium</p>
        )}
      </div>
    </div>
  );
}
