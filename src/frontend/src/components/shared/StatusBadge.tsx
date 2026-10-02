import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info";

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  label?: string;
  size?: "sm" | "md";
  className?: string;
  // Backward compatibility — old API used `status` string
  status?: string;
}

const variantClasses: Record<StatusBadgeVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-muted text-muted-foreground",
  info: "bg-accent/10 text-accent",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5",
  md: "px-2.5 py-1",
};

function inferVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase();
  if (
    [
      "active",
      "open",
      "paid",
      "signed",
      "won",
      "complete",
      "completed",
      "accepted",
    ].includes(s)
  ) {
    return "success";
  }
  if (
    ["pending", "review", "sent", "draft", "proposal", "submitted"].includes(s)
  ) {
    return "info";
  }
  if (
    ["overdue", "lost", "cancelled", "expired", "closed", "rejected"].includes(
      s,
    )
  ) {
    return "danger";
  }
  if (
    [
      "inactive",
      "paused",
      "archived",
      "on-hold",
      "on_hold",
      "negotiating",
      "qualified",
    ].includes(s)
  ) {
    return "neutral";
  }
  return "info";
}

export function StatusBadge({
  variant,
  label,
  size = "sm",
  className,
  status,
}: StatusBadgeProps) {
  const t = useT();
  const resolvedVariant = variant ?? (status ? inferVariant(status) : "info");
  // If an explicit label is provided, use it as-is. Otherwise, if a status
  // value is provided, translate it via the status.* namespace (falls back to
  // the raw status string if no key exists).
  const resolvedLabel = label ?? (status ? t(`status.${status}`) : "");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-token-xs font-token-semibold",
        sizeClasses[size],
        variantClasses[resolvedVariant],
        className,
      )}
    >
      {resolvedLabel}
    </span>
  );
}

// Alias for backwards compatibility
export const StatusText = StatusBadge;
