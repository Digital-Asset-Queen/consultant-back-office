import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ActionBarProps {
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  search?: ReactNode;
  children?: ReactNode;
  className?: string;
  // Backward compatibility
  left?: ReactNode;
  right?: ReactNode;
}

export function ActionBar({
  title,
  icon,
  actions,
  search,
  children,
  className,
  left,
  right,
}: ActionBarProps) {
  const leftContent = left ?? (
    <>
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {title && (
        <span className="text-token-sm font-token-semibold text-foreground">
          {title}
        </span>
      )}
    </>
  );
  const rightContent = right ?? (
    <>
      {search && <div className="flex items-center">{search}</div>}
      {actions && (
        <div className="flex items-center gap-space-2">{actions}</div>
      )}
      {children && (
        <div className="flex items-center gap-space-2">{children}</div>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "px-page",
        "border-b border-border",
        "action-bar",
        className,
      )}
      data-ocid="action_bar"
    >
      <div className="flex items-center gap-space-3">{leftContent}</div>
      <div className="flex items-center gap-space-3">{rightContent}</div>
    </div>
  );
}
