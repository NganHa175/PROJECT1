import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Play, Star, Clock, Heart, Share2, Lock, Check, Crown, ChevronLeft, Calendar, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/Badge";
import TrailerModal from "@/components/movie/TrailerModal";
import UnlockModal from "@/components/movie/UnlockModal";
import MovieCard from "@/components/movie/MovieCard";
import { HorizontalScroll } from "@/components/movie/HorizontalScroll";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_MOVIES } from "@/mocks/movies";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const { canWatch, isAuthenticated, hasPremium, getAccess, isAdmin } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();

  const movie = MOCK_MOVIES.find((m) => m.id === movieId);
  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Movie not found</h1>
        <Link to="/movies" className="text-primary hover:underline">Browse all movies</Link>
      </div>
    );
  }

  const access = getAccess(movie.id);
  const watchable = canWatch({ accessMode: movie.accessMode, publicationStatus: movie.publicationStatus, contentId: movie.id });
  const isLocked = movie.accessMode === "LOCKED" && !hasPremium && !access;
  const hasExpired = !access && movie.accessMode === "LOCKED";

  const similar = MOCK_MOVIES.filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g))).slice(0, 8);

  function handleWatch() {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (watchable) navigate(`/watch/movie/${movie.id}`);
    else setUnlockOpen(true);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: "520px" }}>
        <img src={movie.backdropUrl ?? movie.posterUrl} alt="" className="w-full h-[520px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 px-4 md:px-8 pb-8 max-w-7xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-40 md:w-52 rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              {movie.genres.map((g) => (
                <span key={g} className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{g}</span>
              ))}
              {hasPremium && movie.accessMode === "LOCKED" && <PremiumBadge />}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-1">{movie.title}</h1>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-muted-foreground text-sm mb-3 italic">{movie.originalTitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{movie.voteAverage.toFixed(1)}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{movie.releaseYear}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{movie.runtimeMinutes} min</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{movie.director}</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            {/* Access status */}
            {isLocked ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border mb-6 w-fit">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-semibold text-sm">
                    Unlock for {movie.resolvedPrice.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Access for {movie.unlockDurationHours >= 24 ? `${movie.unlockDurationHours / 24} day${movie.unlockDurationHours / 24 !== 1 ? "s" : ""}` : `${movie.unlockDurationHours}h`}
                  </p>
                </div>
              </div>
            ) : access ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 mb-6 w-fit">
                <Check className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-300 text-sm font-medium">Unlocked until {new Date(access.expiresAt).toLocaleDateString()}</p>
              </div>
            ) : hasPremium && movie.accessMode === "LOCKED" ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 mb-6 w-fit">
                <Crown className="w-4 h-4 text-amber-400" />
                <p className="text-amber-300 text-sm font-medium">Included with Premium</p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleWatch} variant="primary" size="lg">
                <Play className="w-4 h-4 fill-current" />
                {watchable ? "Watch Now" : isLocked ? `Unlock for ${movie.resolvedPrice.toLocaleString("vi-VN")} VND` : "Sign In to Watch"}
              </Button>
              {movie.trailerYoutubeId && (
                <Button onClick={() => setTrailerOpen(true)} variant="secondary" size="lg">
                  <Play className="w-4 h-4" /> Trailer
                </Button>
              )}
              <Button onClick={() => setFavorited((f) => !f)} variant="ghost" size="lg" className={favorited ? "text-red-400" : ""}>
                <Heart className={`w-4 h-4 ${favorited ? "fill-red-400 text-red-400" : ""}`} />
                {favorited ? "Saved" : "Favorite"}
              </Button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {movie.cast.map((c) => (
                <div key={c.name} className="flex-shrink-0 text-center" style={{ width: "clamp(80px, 10vw, 110px)" }}>
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} className="w-full aspect-square object-cover rounded-full border-2 border-border mb-2" />
                  ) : (
                    <div className="w-full aspect-square rounded-full bg-muted border-2 border-border flex items-center justify-center mb-2">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-foreground text-xs font-semibold truncate">{c.name}</p>
                  <p className="text-muted-foreground text-xs truncate">{c.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-12">
            <HorizontalScroll title="Similar Movies">
              {similar.map((m) => <MovieCard key={m.id} item={m} type="movie" onUnlock={() => setUnlockOpen(true)} />)}
            </HorizontalScroll>
          </section>
        )}
      </div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} youtubeId={movie.trailerYoutubeId} title={movie.title} />
      {unlockOpen && (
        <UnlockModal open={true} onClose={() => setUnlockOpen(false)} contentId={movie.id} contentType="MOVIE" title={movie.title} price={movie.resolvedPrice} durationHours={movie.unlockDurationHours} />
      )}
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { scrollbar-width: none; }`}</style>
    </>
  );
}
