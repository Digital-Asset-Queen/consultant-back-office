import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Align = "left" | "center" | "right";

export interface TableColumn<T> {
  key: string;
  header?: string;
  align?: Align;
  width?: string;
  render?: (row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data?: T[];
  onRowClick?: (row: T) => void;
  selectedId?: string | number;
  emptyMessage?: string;
  className?: string;
  rowKey?: (row: T) => string | number;
  // Backward compatibility
  rows?: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  compact?: boolean;
}

const alignClass: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  selectedId,
  emptyMessage,
  className,
  rowKey,
  rows,
  loading,
  emptyState,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const t = useT();
  const effectiveEmptyMessage = emptyMessage ?? t("common.noRecords");
  const effectiveEmptyTitle = emptyTitle ?? t("common.noItems");
  const resolvedData = data ?? rows ?? [];

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-token-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap bg-background px-3 py-2",
                    alignClass[col.align ?? "left"],
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header ?? col.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={`skel-${i}`} className="border-b border-border/40">
                {columns.map((col) => (
                  <td key={col.key} className="h-row px-3 py-2">
                    <Skeleton className="h-[0.875rem] w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (resolvedData.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        {emptyState ?? (
          <EmptyState
            title={effectiveEmptyTitle}
            description={emptyDescription ?? effectiveEmptyMessage}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-background z-sticky">
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-token-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap px-3 py-2",
                  alignClass[col.align ?? "left"],
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resolvedData.map((row, index) => {
            const key = rowKey ? rowKey(row) : index;
            const isSelected =
              selectedId !== undefined && String(key) === String(selectedId);
            return (
              <tr
                key={key}
                className={cn(
                  "border-b border-border/40 h-row transition-opacity-fast",
                  onRowClick && "cursor-pointer",
                  isSelected
                    ? "bg-accent/10 border-l-2 border-l-accent"
                    : "hover:bg-accent/5",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                data-ocid={`table.item.${index + 1}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "text-token-sm text-foreground px-3 py-2",
                      alignClass[col.align ?? "left"],
                      col.align === "right" && "tabular-nums",
                    )}
                  >
                    {col.render ? col.render(row, index) : null}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
