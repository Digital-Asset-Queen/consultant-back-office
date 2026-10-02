import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TwoPanelLayoutProps {
  list: ReactNode;
  detail: ReactNode;
  listWidth?: string;
  className?: string;
}

export function TwoPanelLayout({
  list,
  detail,
  listWidth = "w-80",
  className,
}: TwoPanelLayoutProps) {
  return (
    <div className={cn("flex flex-1 overflow-hidden", className)}>
      <div
        className={cn(
          "shrink-0 border-r border-border overflow-y-auto",
          listWidth,
        )}
      >
        {list}
      </div>
      <div className="flex-1 overflow-y-auto">{detail}</div>
    </div>
  );
}

export default TwoPanelLayout;
