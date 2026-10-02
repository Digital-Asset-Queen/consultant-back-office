import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ListItemProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function ListItem({
  active,
  onClick,
  children,
  className,
}: ListItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full text-left px-4 py-3 cursor-pointer border-b border-border text-sm",
        "transition-opacity duration-150",
        active ? "bg-primary/10 text-primary" : "hover:bg-muted/30",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ListItem;
