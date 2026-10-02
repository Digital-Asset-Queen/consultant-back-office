import { Skeleton } from "@/components/ui/skeleton";
import { type ReactNode, useEffect, useState } from "react";

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      <div className="h-7 w-28 rounded bg-muted animate-pulse" />
      <div className="h-3 w-16 rounded bg-muted animate-pulse" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 animate-none bg-muted" />
        <Skeleton className="h-4 w-64 animate-none bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-lg animate-none bg-muted" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg animate-none bg-muted" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  const items = Array.from({ length: rows }, (_, i) => i);
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <Skeleton
          key={`sk-row-${i}`}
          className="h-12 w-full rounded animate-none bg-muted"
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-5 bg-card space-y-3">
      <Skeleton className="h-5 w-1/3 animate-none bg-muted" />
      <Skeleton className="h-4 w-2/3 animate-none bg-muted" />
      <Skeleton className="h-4 w-1/2 animate-none bg-muted" />
    </div>
  );
}

// SkeletonFade: renders skeleton while loading, fades to content when loaded.
// Uses opacity transition (150ms) — no layout shift since both occupy the same space.
interface SkeletonFadeProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function SkeletonFade({
  loading,
  skeleton,
  children,
}: SkeletonFadeProps) {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    if (!loading) {
      // Small delay to allow the fade to register
      const t = setTimeout(() => setVisible(false), 160);
      return () => clearTimeout(t);
    }
    setVisible(true);
  }, [loading]);

  return (
    <div className="relative">
      {/* Skeleton layer */}
      <div
        aria-hidden={!loading}
        style={{
          opacity: loading ? 1 : 0,
          transition: "opacity 150ms ease-out",
          pointerEvents: loading ? "auto" : "none",
          position: visible && !loading ? "absolute" : "relative",
          inset: 0,
        }}
      >
        {skeleton}
      </div>
      {/* Content layer */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 150ms ease-out",
          visibility: loading && visible ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
