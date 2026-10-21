import { clsx } from "clsx";
import { Crown, Lock } from "lucide-react";

type BadgeVariant = "default" | "primary" | "premium" | "lock" | "free" | "success" | "warning" | "error" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-foreground",
  primary: "bg-primary/20 text-primary border border-primary/30",
  premium: "bg-gradient-to-r from-amber-900/60 to-yellow-900/60 text-amber-400 border border-amber-700/40",
  lock: "bg-slate-800/80 text-slate-300 border border-slate-700/50",
  free: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40",
  success: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40",
  warning: "bg-amber-900/40 text-amber-400 border border-amber-700/40",
  error: "bg-red-900/40 text-red-400 border border-red-700/40",
  muted: "bg-muted/50 text-muted-foreground border border-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", variantClasses[variant], className)}>
      {children}
    </span>
  );
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <Badge variant="premium" className={className}>
      <Crown className="w-3 h-3" /> Premium
    </Badge>
  );
}

export function LockBadge({ price, className }: { price?: number; className?: string }) {
  return (
    <Badge variant="lock" className={className}>
      <Lock className="w-3 h-3" />
      {price !== undefined ? `${price.toLocaleString("vi-VN")} VND` : "Locked"}
    </Badge>
  );
}

export function FreeBadge({ className }: { className?: string }) {
  return (
    <Badge variant="free" className={className}>
      Free
    </Badge>
  );
}

export function WalletBalanceBadge({ balance, className }: { balance: number; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted border border-border text-foreground", className)}>
      Wallet: {balance.toLocaleString("vi-VN")} VND
    </span>
  );
}
