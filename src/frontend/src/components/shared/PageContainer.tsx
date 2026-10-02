import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("p-page", className)}>{children}</div>;
}
