import { cn } from "@/lib/utils";
import * as React from "react";
import { useId } from "react";

export interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  help?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  children,
  help,
  error,
  required,
  className,
}: FormFieldProps) {
  const fieldId = useId();

  const labelledChildren = React.Children.map(children, (child, i) =>
    i === 0 && React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<{ id?: string }>, {
          id: fieldId,
        })
      : child,
  );

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={fieldId}
        className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
        {required && (
          <span className="text-danger ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {labelledChildren}
      {error && <p className="text-token-xs text-danger">{error}</p>}
      {!error && help && (
        <p className="text-token-xs text-muted-foreground">{help}</p>
      )}
    </div>
  );
}
