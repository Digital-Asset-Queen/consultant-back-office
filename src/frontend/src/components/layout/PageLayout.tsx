import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function PageLayout({ children, noPadding }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full" data-ocid="page.layout">
      <div
        className={cn("flex-1 overflow-y-auto", !noPadding && "px-page py-4")}
      >
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
