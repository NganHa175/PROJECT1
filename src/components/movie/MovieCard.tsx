import { Lock, Star, Play, Heart, Clock } from "lucide-react";
import { clsx } from "clsx";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import type { Movie, Series } from "@/types";

interface MovieCardProps {
  item: Movie | Series;
  type: "movie" | "series";
  onUnlock?: (item: Movie | Series) => void;
  showProgress?: boolean;
  progressSeconds?: number;
  totalSeconds?: number;
  className?: string;
}

export default function MovieCard({ item, type, onUnlock, showProgress, progressSeconds = 0, totalSeconds = 1, className }: MovieCardProps) {
  const { canWatch, hasPremium, getAccess, isAuthenticated } = useAuth();

  const isMovie = type === "movie";
  const movie = isMovie ? (item as Movie) : null;
  const series = !isMovie ? (item as Series) : null;

  const accessMode = isMovie ? movie!.accessMode : series!.defaultAccessMode;
  const resolvedPrice = isMovie ? movie!.resolvedPrice : 0;
  const contentId = item.id;

  const access = getAccess(contentId);
  const watchable = canWatch({ accessMode, publicationStatus: item.publicationStatus, contentId });
  const isLocked = accessMode === "LOCKED" && !hasPremium && !access;
  const isFree = accessMode === "FREE";

  const href = isMovie ? `/movie/${item.id}` : `/series/${item.id}`;

  const progressPct = showProgress && totalSeconds > 0 ? Math.min(100, (progressSeconds / totalSeconds) * 100) : 0;

  return (
    <div className={clsx("group relative flex-shrink-0 cursor-pointer", className)} style={{ width: "clamp(130px, 18vw, 180px)" }}>
      <Link to={href} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
          <img
            src={item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

          {/* Locked overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1">
              <Lock className="w-5 h-5 text-white" />
              {resolvedPrice > 0 && (
                <span className="text-white text-xs font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                  {resolvedPrice.toLocaleString("vi-VN")} VND
                </span>
              )}
            </div>
          )}

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isFree && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white">FREE</span>
            )}
            {hasPremium && accessMode === "LOCKED" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-600/90 text-white">PREMIUM</span>
            )}
            {access && !hasPremium && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white">UNLOCKED</span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-[10px] font-semibold">{item.voteAverage.toFixed(1)}</span>
          </div>

          {/* Progress bar */}
          {showProgress && progressPct > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          )}

          {/* Unlock CTA on hover for locked content */}
          {isLocked && isAuthenticated && onUnlock && (
            <div className="absolute bottom-0 inset-x-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button
                onClick={(e) => { e.preventDefault(); onUnlock(item); }}
                className="w-full text-xs font-semibold py-1.5 rounded-lg bg-primary text-white hover:bg-red-700 transition-colors"
              >
                Unlock
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 px-0.5">
          <p className="text-foreground text-sm font-medium truncate leading-tight">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-muted-foreground text-xs">{item.releaseYear}</span>
            {showProgress && progressSeconds > 0 && (
              <span className="text-muted-foreground text-xs flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {Math.round((totalSeconds - progressSeconds) / 60)}m left
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
