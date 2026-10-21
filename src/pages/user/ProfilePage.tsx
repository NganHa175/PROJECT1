import { Crown, User, Mail, Shield, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PremiumBadge } from "@/components/ui/Badge";
import { Link } from "react-router";

export default function ProfilePage() {
  const { currentUser, isAuthenticated, hasPremium } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold text-foreground mb-4">Sign in to view your Profile</h1></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">My Profile</h1>

      {/* Avatar card */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center mb-4">
          <span className="text-3xl font-black text-primary">{currentUser.name[0]}</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">{currentUser.name}</h2>
        <p className="text-muted-foreground text-sm mb-3">{currentUser.email}</p>
        <div className="flex items-center gap-2">
          {hasPremium && <PremiumBadge />}
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${currentUser.accountStatus === "ACTIVE" ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700/30" : "bg-red-900/40 text-red-400 border border-red-700/30"}`}>
            {currentUser.accountStatus}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { icon: User, label: "Full Name", value: currentUser.name },
          { icon: Mail, label: "Email", value: currentUser.email },
          { icon: Shield, label: "Role", value: currentUser.role },
          { icon: Clock, label: "Member Since", value: new Date(currentUser.createdAt).toLocaleDateString() },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="p-4 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-foreground font-medium text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "My Wallet", href: "/wallet" },
            { label: "Favorites", href: "/favorites" },
            { label: "Watch History", href: "/history" },
            { label: "Premium", href: "/subscription" },
          ].map(({ label, href }) => (
            <Link key={href} to={href} className="px-3 py-2 rounded-xl bg-muted text-sm font-medium text-foreground hover:bg-muted/70 transition-colors text-center">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
