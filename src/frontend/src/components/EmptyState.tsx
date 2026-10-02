import { cn } from "@/lib/utils";
import { type ElementType, type ReactNode, isValidElement } from "react";

interface EmptyStateProps {
  /** Primary message — takes priority over `title` */
  message?: string;
  /** Backwards-compatible alias for `message` */
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  /** @deprecated use className instead */
  size?: "default" | "sm";
  className?: string;
}

export function EmptyState({
  message,
  title,
  description,
  icon,
  action,
  size = "default",
  className,
}: EmptyStateProps) {
  const heading = message ?? title ?? "";

  let iconNode: ReactNode = null;
  if (icon) {
    if (isValidElement(icon)) {
      iconNode = icon;
    } else {
      const Icon = icon as ElementType;
      iconNode = <Icon className="w-8 h-8" />;
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 gap-3 text-center px-4",
        size === "sm" && "py-8",
        className,
      )}
    >
      {iconNode && (
        <div className="w-8 h-8 flex items-center justify-center text-muted-foreground">
          {iconNode}
        </div>
      )}
      {heading && (
        <p className="text-sm font-medium text-muted-foreground">{heading}</p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground opacity-70 max-w-xs">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
