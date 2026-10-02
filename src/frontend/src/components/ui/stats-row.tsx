import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

interface StatsRowProps {
  stats: StatItem[];
  className?: string;
}

function variantClass(v?: string) {
  if (v === "success") return "text-success";
  if (v === "warning") return "text-warning";
  if (v === "danger") return "text-danger";
  return "text-foreground";
}

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 border-b border-border bg-background",
        className,
      )}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex-1 px-6 py-3 border-r border-border last:border-r-0"
        >
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
            {s.label}
          </div>
          <div
            className={cn(
              "text-lg font-semibold tabular-nums",
              variantClass(s.variant),
            )}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;
