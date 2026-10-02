import { cn } from "@/lib/utils";

export type HealthStatus = "active" | "caution" | "at-risk" | "inactive";

export interface HealthDotProps {
  status: HealthStatus | string;
  size?: "sm" | "md";
  className?: string;
}

const statusColorMap: Record<string, string> = {
  active: "bg-success",
  caution: "bg-warning",
  "at-risk": "bg-danger",
  inactive: "bg-muted-foreground",
  // Backward compatibility mappings
  paused: "bg-muted-foreground",
  closed: "bg-muted-foreground",
  pending: "bg-accent",
};

const sizeMap: Record<string, string> = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
};

export function HealthDot({ status, size = "sm", className }: HealthDotProps) {
  const colorClass = statusColorMap[status] ?? statusColorMap.inactive;

  return (
    <span
      className={cn(
        "inline-block rounded-full flex-shrink-0",
        sizeMap[size],
        colorClass,
        className,
      )}
      aria-hidden="true"
    />
  );
}

export default HealthDot;
