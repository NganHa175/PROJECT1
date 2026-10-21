import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-lg bg-muted", className)} />;
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 md:w-44">
      <Skeleton className="aspect-[2/3] rounded-xl mb-2" />
      <Skeleton className="h-3 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function EmptyState({ title, desc, icon: Icon }: { title: string; desc?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      {Icon && <Icon className="w-12 h-12 text-muted-foreground" />}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {desc && <p className="text-muted-foreground text-sm max-w-sm">{desc}</p>}
    </div>
  );
}
