import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { Search, Bell, Menu, X, Sun, Moon, Crown, ChevronDown, LogOut, User, Wallet, History, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { WalletBalanceBadge, PremiumBadge } from "@/components/ui/Badge";
import type { MockUserState } from "@/types";
import { Toaster } from "sonner";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "TV Series", to: "/series" },
  { label: "Premium", to: "/subscription" },
  { label: "FAQ", to: "/#faq" },
];

export default function PublicLayout() {
  const { currentUser, isAuthenticated, hasPremium, mockState, setMockState } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMobileOpen(false);
  }, [location.pathname]);

  const DEV_STATES: { label: string; value: MockUserState }[] = [
    { label: "Guest", value: "GUEST" },
    { label: "User (Normal)", value: "USER" },
    { label: "User (Premium)", value: "PREMIUM" },
    { label: "Admin", value: "ADMIN" },
  ];

  function handleNavFaq(e: React.MouseEvent) {
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-background font-[Manrope,sans-serif]">
      <Toaster position="top-right" theme={isDark ? "dark" : "light"} richColors />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-4">
            <span className="text-xl font-black tracking-tight">
              <span className="text-primary">Cine</span>
              <span className="text-foreground">Vault</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              link.to === "/#faq" ? (
                <a key={link.to} href="/#faq" onClick={handleNavFaq}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.to} to={link.to} end={link.to === "/"}
                  className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {link.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => navigate("/search")} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => setIsDark((d) => !d)} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <>
                {hasPremium && <PremiumBadge className="hidden md:flex" />}
                <WalletBalanceBadge balance={currentUser!.walletBalance} className="hidden md:flex" />
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                </button>
                {/* User menu */}
                <div className="relative hidden md:block">
                  <button onClick={() => setUserMenuOpen((o) => !o)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-muted border border-border hover:bg-muted/70 transition-colors text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">{currentUser!.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium max-w-20 truncate">{currentUser!.name}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-2xl py-1 z-50">
                      {currentUser?.role === "ADMIN" && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <User className="w-4 h-4 text-primary" /> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/wallet" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <Wallet className="w-4 h-4" /> Wallet
                      </Link>
                      <Link to="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <Heart className="w-4 h-4" /> Favorites
                      </Link>
                      <Link to="/history" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <History className="w-4 h-4" /> Watch History
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button onClick={() => { setMockState("GUEST"); setUserMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-muted transition-colors w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => setMockState("USER")} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Sign In
                </button>
                <button onClick={() => setMockState("USER")} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-red-700 transition-colors">
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen((o) => !o)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              link.to === "/#faq" ? (
                <a key={link.to} href="/#faq" onClick={(e) => { handleNavFaq(e); setMobileOpen(false); }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {link.label}
                </NavLink>
              )
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/wallet" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                  Wallet · {currentUser!.walletBalance.toLocaleString("vi-VN")} VND
                </Link>
                <button onClick={() => { setMockState("GUEST"); setMobileOpen(false); }} className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-muted text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setMockState("USER"); setMobileOpen(false); }} className="px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-white">
                  Sign In / Create Account
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Dev switcher */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="relative">
          <button onClick={() => setDevMenuOpen((o) => !o)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border shadow-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Dev: {mockState}
            <ChevronDown className="w-3 h-3" />
          </button>
          {devMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-44 rounded-xl bg-card border border-border shadow-2xl py-1">
              {DEV_STATES.map((s) => (
                <button key={s.value} onClick={() => { setMockState(s.value); setDevMenuOpen(false); }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${mockState === s.value ? "text-primary" : "text-foreground hover:bg-muted"}`}>
                  {mockState === s.value && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-black mb-3">
                <span className="text-primary">Cine</span>
                <span className="text-foreground">Vault</span>
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">Your next story starts here.</p>
              <div className="flex gap-3 mt-4">
                {[{ icon: "F", label: "Facebook" }, { icon: "T", label: "Twitter" }, { icon: "I", label: "Instagram" }].map((s) => (
                  <button key={s.label} aria-label={s.label} className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-xs font-bold">
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: "Home", links: ["Categories", "Trending", "Popular", "New Releases"] },
              { title: "Movies", links: ["Genres", "Recently Added", "Recommended"] },
              { title: "TV Series", links: ["Genres", "Seasons", "New Episodes"] },
              { title: "Account", links: ["Wallet", "Favorites", "Watch History", "Premium"] },
              { title: "Support", links: ["FAQ", "Contact", "Terms of Use", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-foreground font-semibold text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>© 2026 CineVault. All rights reserved.</span>
            <div className="flex gap-4">
              {["Terms of Use", "Privacy Policy", "Cookie Policy"].map((t) => (
                <a key={t} href="#" className="hover:text-foreground transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
