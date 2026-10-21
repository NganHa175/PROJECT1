import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard, Film, DollarSign, Users, Receipt,
  ChevronLeft, ChevronRight, Home, Menu, X, LogOut, ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Content", to: "/admin/content", icon: Film },
  { label: "Pricing", to: "/admin/pricing", icon: DollarSign },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Transactions", to: "/admin/transactions", icon: Receipt },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, setMockState } = useAuth();
  const navigate = useNavigate();

  const sidebar = (
    <aside className={`flex flex-col h-full bg-card border-r border-border transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
      <div className="flex items-center justify-between p-4 border-b border-border min-h-[65px]">
        {!collapsed && (
          <Link to="/admin" className="text-lg font-black">
            <span className="text-primary">Cine</span>
            <span className="text-foreground">Vault</span>
            <span className="text-xs font-medium text-muted-foreground ml-1.5">Admin</span>
          </Link>
        )}
        <button onClick={() => setCollapsed((c) => !c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {ADMIN_NAV.map(({ label, to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"} ${collapsed ? "justify-center" : ""}`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Home className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Back to CineVault</span>}
        </NavLink>
        {currentUser && (
          <button onClick={() => setMockState("GUEST")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-muted transition-colors w-full">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background font-[Manrope,sans-serif] flex flex-col">
      <Toaster position="top-right" theme="dark" richColors />

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 border-b border-border bg-background/90 backdrop-blur-md">
        <Link to="/admin" className="text-lg font-black">
          <span className="text-primary">Cine</span><span className="text-foreground">Vault</span>
          <span className="text-xs text-muted-foreground ml-1">Admin</span>
        </Link>
        <button onClick={() => setMobileOpen((o) => !o)} className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-shrink-0">{sidebar}</div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="w-56 bg-card border-r border-border flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-black text-lg"><span className="text-primary">Cine</span><span className="text-foreground">Vault</span></span>
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {ADMIN_NAV.map(({ label, to, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    <Icon className="w-4 h-4" />{label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-auto">
          {/* Admin header */}
          <header className="h-[65px] border-b border-border px-6 flex items-center justify-end gap-3">
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{currentUser.name[0]}</span>
                </div>
                <span className="font-medium text-foreground">{currentUser.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">Admin</span>
              </div>
            )}
          </header>

          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
