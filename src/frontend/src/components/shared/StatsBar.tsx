import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: string | number;
  trend?: string;
  status?: "success" | "warning" | "danger" | "neutral";
}

export interface StatsBarProps {
  stats: StatItem[];
  className?: string;
}

export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-sticky",
        "flex items-stretch",
        "border-b border-border",
        "bg-surface-elevated",
        "px-page",
        "h-stats-bar",
        className,
      )}
      data-ocid="stats_bar"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex-1 min-w-0 flex flex-col justify-center",
            index < stats.length - 1 && "border-r border-border/60",
          )}
        >
          <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </span>
          <span
            className={cn(
              "text-token-2xl font-token-semibold tabular-nums",
              stat.status === "success" && "text-success",
              stat.status === "warning" && "text-warning",
              stat.status === "danger" && "text-danger",
              !stat.status && "text-foreground",
            )}
          >
            {stat.value}
          </span>
          {stat.trend && (
            <span className="text-token-xs text-muted-foreground">
              {stat.trend}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
