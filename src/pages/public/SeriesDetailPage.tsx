import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Play, Star, Heart, Lock, Check, Crown, ChevronLeft, Calendar, User, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/Badge";
import TrailerModal from "@/components/movie/TrailerModal";
import UnlockModal from "@/components/movie/UnlockModal";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_SERIES } from "@/mocks/movies";
import type { Episode } from "@/types";

export default function SeriesDetailPage() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const { canWatch, isAuthenticated, hasPremium, getAccess } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [unlockEp, setUnlockEp] = useState<Episode | null>(null);
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();

  const series = MOCK_SERIES.find((s) => s.id === seriesId);
  if (!series) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Series not found</h1>
        <Link to="/series" className="text-primary hover:underline">Browse all series</Link>
      </div>
    );
  }

  const season = series.seasons[selectedSeason];

  function handleEpWatch(ep: Episode) {
    if (!isAuthenticated) { navigate("/login"); return; }
    const watchable = canWatch({ accessMode: ep.accessMode, publicationStatus: ep.publicationStatus, contentId: ep.id });
    if (watchable) navigate(`/watch/episode/${ep.id}`);
    else setUnlockEp(ep);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="relative w-full" style={{ maxHeight: "480px" }}>
        <img src={series.backdropUrl ?? series.posterUrl} alt="" className="w-full h-[480px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0 w-40 md:w-52 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <img src={series.posterUrl} alt={series.title} className="w-full aspect-[2/3] object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {series.genres.map((g) => <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{g}</span>)}
              {hasPremium && series.defaultAccessMode === "LOCKED" && <PremiumBadge />}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-1">{series.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{series.voteAverage.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{series.releaseYear}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{series.director}</span>
              <span>{series.seasons.length} Season{series.seasons.length !== 1 ? "s" : ""}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">{series.overview}</p>
            <div className="flex flex-wrap gap-3">
              {series.trailerYoutubeId && (
                <Button onClick={() => setTrailerOpen(true)} variant="secondary" size="lg">
                  <Play className="w-4 h-4" /> Watch Trailer
                </Button>
              )}
              <Button onClick={() => setFavorited((f) => !f)} variant="ghost" size="lg" className={favorited ? "text-red-400" : ""}>
                <Heart className={`w-4 h-4 ${favorited ? "fill-red-400 text-red-400" : ""}`} />
                {favorited ? "Saved" : "Favorite"}
              </Button>
            </div>
          </div>
        </div>

        {/* Season selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {series.seasons.map((s, i) => (
            <button key={s.id} onClick={() => setSelectedSeason(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${i === selectedSeason ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {s.title}
            </button>
          ))}
        </div>

        {/* Episode list */}
        {season && (
          <div className="space-y-3">
            {season.episodes.map((ep) => {
              const epAccess = getAccess(ep.id);
              const watchable = canWatch({ accessMode: ep.accessMode, publicationStatus: ep.publicationStatus, contentId: ep.id });
              const isLocked = ep.accessMode === "LOCKED" && !hasPremium && !epAccess;

              return (
                <div key={ep.id} className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                  {ep.thumbnailUrl && (
                    <div className="flex-shrink-0 relative w-32 aspect-video rounded-xl overflow-hidden">
                      <img src={ep.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Episode {ep.episodeNumber}</p>
                        <p className="text-foreground font-semibold text-sm">{ep.title}</p>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{ep.overview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-muted-foreground text-xs">{ep.durationMinutes} min</span>
                        {isLocked ? (
                          <button onClick={() => handleEpWatch(ep)} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-red-700 transition-colors">
                            Unlock · {ep.resolvedPrice.toLocaleString("vi-VN")} VND
                          </button>
                        ) : epAccess ? (
                          <div className="flex items-center gap-1 text-xs text-emerald-400">
                            <Check className="w-3 h-3" /> Unlocked
                          </div>
                        ) : hasPremium && ep.accessMode === "LOCKED" ? (
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <Crown className="w-3 h-3" /> Premium
                          </div>
                        ) : (
                          <button onClick={() => handleEpWatch(ep)} className="text-xs px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground font-semibold hover:bg-muted/70 transition-colors">
                            <Play className="w-3 h-3 inline mr-1" /> Watch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} youtubeId={series.trailerYoutubeId} title={series.title} />
      {unlockEp && (
        <UnlockModal open={true} onClose={() => setUnlockEp(null)} contentId={unlockEp.id} contentType="EPISODE" title={unlockEp.title} price={unlockEp.resolvedPrice} durationHours={unlockEp.unlockDurationHours} />
      )}
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { scrollbar-width: none; }`}</style>
    </>
  );
}
