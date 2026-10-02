import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

export default PageShell;
