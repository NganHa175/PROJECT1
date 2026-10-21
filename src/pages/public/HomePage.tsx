import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Play, Compass, Unlock, Crown, Clock, Sparkles, Wallet } from "lucide-react";
import PosterMosaic from "@/components/home/PosterMosaic";
import CategorySection from "@/components/home/CategorySection";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";
import TrailerModal from "@/components/movie/TrailerModal";
import UnlockModal from "@/components/movie/UnlockModal";
import MovieCard from "@/components/movie/MovieCard";
import { HorizontalScroll } from "@/components/movie/HorizontalScroll";
import Button from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_MOVIES, MOCK_SERIES, PREMIUM_PRICE } from "@/mocks/movies";
import { HOME_FEATURES, PREMIUM_BENEFITS, WALLET_BENEFITS } from "@/mocks/homeData";
import { MOCK_WATCH_HISTORY } from "@/mocks/transactions";
import type { Movie, Series } from "@/types";

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass, Unlock, Crown, Play, Sparkles, Wallet,
};

export default function HomePage() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<{ movie: Movie | Series; type: "movie" | "series" } | null>(null);
  const { isAuthenticated, hasPremium, currentUser } = useAuth();
  const navigate = useNavigate();

  const featuredMovies = MOCK_MOVIES.filter((m) => m.isFeatured && m.publicationStatus === "PUBLISHED");
  const watchHistory = isAuthenticated
    ? MOCK_WATCH_HISTORY.filter((h) => h.userId === currentUser?.id).slice(0, 8)
    : [];
  const recentlyUnlocked = isAuthenticated ? MOCK_MOVIES.filter((m) => m.accessMode === "LOCKED").slice(0, 6) : [];

  return (
    <>
      <style>{`
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes scrollRight { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero with Poster Mosaic */}
      <div className="relative">
        <PosterMosaic onPlayTrailer={() => setTrailerOpen(true)} />
        <div className="relative z-10 -mt-32 pb-8 flex flex-col items-center text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4 max-w-3xl">
            Your Next Story<br />Starts Here
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            Discover movies and series selected for every mood. Watch free content, unlock individual titles with your CineVault Wallet, or enjoy unlimited access with Premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/movies")} variant="primary" size="lg">
              Explore Movies
            </Button>
            <Button onClick={() => setTrailerOpen(true)} variant="secondary" size="lg">
              <Play className="w-4 h-4 fill-current" /> Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Category section */}
        <CategorySection />

        {/* Auth-only sections */}
        {isAuthenticated && watchHistory.length > 0 && (
          <section className="py-8">
            <HorizontalScroll title="Continue Watching" subtitle="Pick up where you left off">
              {watchHistory.map((h) => {
                const movie = MOCK_MOVIES.find((m) => m.id === h.contentId);
                if (!movie) return null;
                return (
                  <MovieCard key={h.id} item={movie} type="movie" showProgress progressSeconds={h.progressSeconds} totalSeconds={h.totalSeconds} />
                );
              })}
            </HorizontalScroll>
          </section>
        )}

        {isAuthenticated && (
          <section className="py-8">
            <HorizontalScroll title="Recommended for You" subtitle="Based on your watch history">
              {MOCK_MOVIES.slice(0, 10).map((m) => (
                <MovieCard key={m.id} item={m} type="movie" onUnlock={(item) => setUnlockTarget({ movie: item as Movie, type: "movie" })} />
              ))}
            </HorizontalScroll>
          </section>
        )}

        {isAuthenticated && (
          <section className="py-8">
            <HorizontalScroll title="Recently Unlocked" subtitle="Content you've accessed">
              {recentlyUnlocked.map((m) => (
                <MovieCard key={m.id} item={m} type="movie" />
              ))}
            </HorizontalScroll>
          </section>
        )}

        {/* Features grid */}
        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Everything You Need for a Better Movie Night</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              CineVault combines discovery, flexible access, personal recommendations, and seamless watch progress in one cinematic experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOME_FEATURES.map(({ icon, title, desc }) => {
              const Icon = FEATURE_ICONS[icon] ?? Play;
              return (
                <div key={title} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-foreground font-semibold mb-1.5">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <div id="faq">
          <FAQSection />
        </div>

        {/* Access & Premium section */}
        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose How You Want to Watch</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Unlock only the content you want, or subscribe to Premium for access to all published locked titles.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Wallet card */}
            <div className="rounded-2xl border border-border bg-card p-7 flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-2">Pay as You Watch</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Use your CineVault Wallet to unlock individual movies or episodes for their displayed access duration.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {WALLET_BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-4 h-4 rounded-full bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-black text-foreground mb-4">From 3,000 VND</p>
              <Button onClick={() => navigate("/movies")} variant="secondary" size="lg" fullWidth>
                Explore Movies
              </Button>
            </div>

            {/* Premium card */}
            <div className="rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-950/30 to-card p-7 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4"><PremiumBadge /></div>
              <h3 className="text-xl font-bold text-foreground mb-2">CineVault Premium</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Access all published locked movies and episodes while your Premium subscription remains active.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {PREMIUM_BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-4 h-4 rounded-full bg-amber-900/40 border border-amber-700/40 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-black text-foreground mb-1">{PREMIUM_PRICE.toLocaleString("vi-VN")} VND</p>
              <p className="text-muted-foreground text-xs mb-4">per month · manual renewal</p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate("/subscription")} variant="primary" size="lg" fullWidth>
                  <Crown className="w-4 h-4" /> Get Premium
                </Button>
                <Button onClick={() => navigate("/subscription")} variant="ghost" size="md" fullWidth>
                  View Benefits
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <CTABanner />
      </div>

      {/* Modals */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeId={featuredMovies[0]?.trailerYoutubeId}
        title={featuredMovies[0]?.title}
      />
      {unlockTarget && (
        <UnlockModal
          open={true}
          onClose={() => setUnlockTarget(null)}
          contentId={unlockTarget.movie.id}
          contentType="MOVIE"
          title={unlockTarget.movie.title}
          price={(unlockTarget.movie as Movie).resolvedPrice}
          durationHours={(unlockTarget.movie as Movie).unlockDurationHours}
        />
      )}
    </>
  );
}
