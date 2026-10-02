import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export interface ConfirmDeleteProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export function ConfirmDelete({
  message,
  onConfirm,
  onCancel,
  loading = false,
  className,
}: ConfirmDeleteProps) {
  const t = useT();
  const resolvedMessage = message ?? t("common.deleteThisRecord");

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 bg-danger/5 border border-danger/20 rounded-[var(--radius)] text-sm",
        className,
      )}
      role="alert"
      data-ocid="confirm_delete.dialog"
    >
      <span className="text-foreground flex-1">{resolvedMessage}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={loading}
        data-ocid="confirm_delete.cancel_button"
      >
        {t("common.cancel")}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onConfirm}
        disabled={loading}
        data-ocid="confirm_delete.confirm_button"
      >
        {loading ? t("common.deleting") : t("common.delete")}
      </Button>
    </div>
  );
}
