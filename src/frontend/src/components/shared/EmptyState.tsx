import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ElementType, type ReactNode, isValidElement } from "react";

export interface EmptyStateProps {
  icon?: ReactNode | ElementType;
  heading?: string;
  message?: string;
  action?: ReactNode | { label: string; onClick: () => void };
  className?: string;
  "data-ocid"?: string;
  // Backward compatibility
  title?: string;
  description?: string;
}

export function EmptyState({
  icon,
  heading,
  message,
  action,
  className,
  "data-ocid": dataOcid,
  title,
  description,
}: EmptyStateProps) {
  const resolvedHeading = heading ?? title ?? "";
  const resolvedMessage = message ?? description;

  let iconNode: ReactNode = null;
  if (icon) {
    // React.isValidElement catches already-rendered JSX.
    // Everything else (function components, forwardRef objects, class components)
    // must be called as a JSX element — including Lucide icons which are forwardRef
    // objects (typeof === "object"), NOT functions.
    if (isValidElement(icon)) {
      iconNode = icon;
    } else {
      // icon is a component constructor/forwardRef — render it as JSX
      const Icon = icon as ElementType;
      iconNode = <Icon className="w-10 h-10" />;
    }
  }

  const actionNode =
    action && typeof action === "object" && "label" in action ? (
      <Button
        variant="outline"
        size="sm"
        onClick={(action as { label: string; onClick: () => void }).onClick}
        data-ocid="empty_state.action_button"
      >
        {(action as { label: string; onClick: () => void }).label}
      </Button>
    ) : (
      (action as ReactNode)
    );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "gap-3 py-16 text-center",
        className,
      )}
      data-ocid={dataOcid ?? "empty_state"}
    >
      {iconNode && (
        <div className="text-muted-foreground opacity-40 text-4xl">
          {iconNode}
        </div>
      )}
      <p className="text-token-sm font-token-semibold text-foreground">
        {resolvedHeading}
      </p>
      {resolvedMessage && (
        <p className="text-token-sm text-muted-foreground max-w-sm">
          {resolvedMessage}
        </p>
      )}
      {actionNode && <div className="mt-2">{actionNode}</div>}
    </div>
  );
}
