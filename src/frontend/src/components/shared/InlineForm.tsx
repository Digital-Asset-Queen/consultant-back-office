import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import type { ReactNode } from "react";

export interface InlineFormProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  onSubmit?: () => void | Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export function InlineForm({
  open,
  isOpen,
  onClose,
  children,
  title,
  onSubmit,
  submitLabel,
  loading,
}: InlineFormProps) {
  const t = useT();
  const visible = isOpen ?? open ?? false;
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg",
        "form-padding mb-[var(--space-3)]",
        "transition-opacity-fast",
      )}
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      {title && (
        <div className="flex items-center justify-between mb-[var(--space-3)]">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
            data-ocid="inline_form.close_button"
          >
            <X className="icon-sm" />
            <span className="sr-only">{t("shared.closeSr")}</span>
          </Button>
        </div>
      )}
      <div className="space-y-[var(--space-3)]">{children}</div>
      {onSubmit && (
        <div className="flex justify-end gap-[var(--space-2)] mt-[var(--space-3)]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="inline_form.cancel_button"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={loading}
            data-ocid="inline_form.submit_button"
          >
            {loading && <Loader2 className="icon-sm mr-1 animate-spin" />}
            {submitLabel ?? t("common.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
