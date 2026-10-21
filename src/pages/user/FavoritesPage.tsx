import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_FAVORITES } from "@/mocks/transactions";
import { MOCK_MOVIES, MOCK_SERIES } from "@/mocks/movies";

export default function FavoritesPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [removed, setRemoved] = useState<string[]>([]);

  const favorites = isAuthenticated
    ? MOCK_FAVORITES.filter((f) => f.userId === currentUser!.id && !removed.includes(f.id))
    : [];

  function getPoster(fav: typeof favorites[0]) {
    if (fav.contentType === "MOVIE") return MOCK_MOVIES.find((m) => m.id === fav.contentId)?.posterUrl ?? "";
    return MOCK_SERIES.find((s) => s.id === fav.contentId)?.posterUrl ?? "";
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to view your Favorites</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-400 fill-red-400" /> My Favorites
      </h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-4">
          <Heart className="w-14 h-14 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold text-foreground">No favorites yet</h3>
          <p className="text-muted-foreground text-sm">Browse movies and series and save what you love.</p>
          <Link to="/movies" className="text-primary hover:underline text-sm">Explore Movies</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((fav) => {
            const href = fav.contentType === "MOVIE" ? `/movie/${fav.contentId}` : `/series/${fav.contentId}`;
            const poster = getPoster(fav);
            return (
              <div key={fav.id} className="relative group">
                <Link to={href}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
                    {poster ? (
                      <img src={poster} alt={fav.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  </div>
                  <p className="text-foreground text-sm font-medium mt-2 truncate px-0.5">{fav.title}</p>
                  <p className="text-muted-foreground text-xs px-0.5">{fav.contentType === "MOVIE" ? "Movie" : "Series"}</p>
                </Link>
                <button
                  onClick={() => setRemoved((r) => [...r, fav.id])}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/80"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
