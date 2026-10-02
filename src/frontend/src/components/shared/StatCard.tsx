import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string;
  note?: string;
  trend?: "up" | "down" | "flat";
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  note,
  trend,
  loading,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col gap-space-1 px-padding-card py-space-3",
          className,
        )}
      >
        <span className="text-section-heading uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-xl font-semibold text-foreground tabular-nums">
          &mdash;
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-space-1 px-padding-card py-space-3",
        className,
      )}
    >
      <span className="text-section-heading uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-space-2">
        <span className="text-xl font-semibold text-foreground tabular-nums">
          {value ?? "\u2014"}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center",
              trend === "up" && "text-success",
              trend === "down" && "text-danger",
              trend === "flat" && "text-muted-foreground",
            )}
          >
            {trend === "up" && <ArrowUpRight className="icon-sm" />}
            {trend === "down" && <ArrowDownRight className="icon-sm" />}
            {trend === "flat" && <Minus className="icon-sm" />}
          </span>
        )}
      </div>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
