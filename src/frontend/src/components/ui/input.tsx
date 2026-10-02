import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-input w-full min-w-0 rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground transition-opacity outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
