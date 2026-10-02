import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TwoPanelProps {
  list?: ReactNode;
  detail?: ReactNode;
  emptyDetail?: ReactNode;
  className?: string;
  // Backward compatibility
  listPanel?: ReactNode;
  detailPanel?: ReactNode;
  listContent?: ReactNode;
  detailContent?: ReactNode;
}

export function TwoPanel({
  list,
  detail,
  emptyDetail,
  className,
  listPanel,
  detailPanel,
  listContent,
  detailContent,
}: TwoPanelProps) {
  const left = list ?? listContent ?? listPanel;
  const right = detail ?? detailContent ?? detailPanel;

  return (
    <div className={cn("flex flex-row gap-0 h-full min-h-0", className)}>
      <div className="flex-shrink-0 overflow-y-auto border-r border-border w-list-panel min-w-list-panel">
        {left}
      </div>
      <div className="flex-1 overflow-y-auto min-w-detail-panel">
        {right ?? emptyDetail ?? null}
      </div>
    </div>
  );
}

export default TwoPanel;
