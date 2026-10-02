import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-space-4",
        "px-page py-2",
        className,
      )}
    >
      <div>
        <span className="text-token-xs uppercase tracking-wider font-token-semibold text-muted-foreground">
          {title}
        </span>
        {description && (
          <p className="text-token-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
