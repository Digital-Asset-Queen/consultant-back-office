import type { RateCard } from "@/backend";
import { ConfirmDelete } from "@/components/shared/ConfirmDelete";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddUpdateRateCard,
  useRateCards,
  useRemoveRateCard,
} from "@/hooks/useRateCards";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency } from "@/lib/formatting";
import { CreditCard, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "SGD", "CHF"];

function fmtRate(val: bigint | undefined, currency: string): string {
  if (val == null || val === 0n) return "—";
  return formatCurrency(val, currency);
}

type FormState = {
  name: string;
  hourlyRate: string;
  dailyRate: string;
  projectRate: string;
  currency: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  hourlyRate: "",
  dailyRate: "",
  projectRate: "",
  currency: "USD",
  notes: "",
};

function rateCardToForm(rc: RateCard): FormState {
  return {
    name: rc.name,
    hourlyRate: rc.hourlyRate ? String(Number(rc.hourlyRate) / 100) : "",
    dailyRate: rc.dailyRate ? String(Number(rc.dailyRate) / 100) : "",
    projectRate: rc.projectRate ? String(Number(rc.projectRate) / 100) : "",
    currency: rc.currency ?? "USD",
    notes: rc.notes ?? "",
  };
}

function parseRate(val: string): bigint | undefined {
  const n = Number.parseFloat(val);
  if (Number.isNaN(n) || n <= 0) return undefined;
  return BigInt(Math.round(n * 100));
}

export function RateCardsTab() {
  const t = useT();
  const { data: rateCards = [], isLoading } = useRateCards();
  const addUpdate = useAddUpdateRateCard();
  const remove = useRemoveRateCard();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(true);
  }

  function openEdit(rc: RateCard) {
    setForm(rateCardToForm(rc));
    setEditingId(rc.id);
    setIsAdding(true);
  }

  function closeForm() {
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
  }

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error(t("rateCards.nameRequired"));
      return;
    }
    const payload: RateCard = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name.trim(),
      serviceName: form.name?.trim() ?? "",
      hourlyRate: parseRate(form.hourlyRate),
      dailyRate: parseRate(form.dailyRate),
      projectRate: parseRate(form.projectRate),
      currency: form.currency,
      notes: form.notes,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };
    try {
      await addUpdate.mutateAsync(payload);
      toast.success(editingId ? t("rateCards.updated") : t("rateCards.added"));
      closeForm();
    } catch {
      toast.error(t("rateCards.saveFailed"));
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      await remove.mutateAsync(deletingId);
      toast.success(t("rateCards.deleted"));
      setDeletingId(null);
    } catch {
      toast.error(t("rateCards.deleteFailed"));
    }
  }

  return (
    <div className="overflow-auto p-page">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-foreground text-token-xl">
          {t("common.rateCards")}
        </h2>
        <Button
          type="button"
          size="sm"
          onClick={openAdd}
          disabled={isAdding}
          data-ocid="rate_cards.add_button"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {t("common.addRateCard")}
        </Button>
      </div>

      {/* Inline add / edit form */}
      {isAdding && (
        <div
          className="bg-surface-elevated rounded-lg border border-border mb-3 p-4"
          data-ocid="rate_cards.inline_form"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {editingId ? t("common.editRateCard") : t("common.newRateCard")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={t("common.name")} required>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder={t("rateCards.placeholderName")}
                data-ocid="rate_cards.name.input"
              />
            </FormField>

            <FormField label={t("common.currency")}>
              <Select
                value={form.currency}
                onValueChange={(v) => setField("currency", v)}
              >
                <SelectTrigger data-ocid="rate_cards.currency.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label={t("common.hourlyRate")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.hourlyRate}
                onChange={(e) => setField("hourlyRate", e.target.value)}
                placeholder={t("rateCards.placeholderHourly")}
                data-ocid="rate_cards.hourly_rate.input"
              />
            </FormField>

            <FormField label={t("common.dailyRate")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.dailyRate}
                onChange={(e) => setField("dailyRate", e.target.value)}
                placeholder={t("rateCards.placeholderDaily")}
                data-ocid="rate_cards.daily_rate.input"
              />
            </FormField>

            <FormField label={t("common.projectRate")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.projectRate}
                onChange={(e) => setField("projectRate", e.target.value)}
                placeholder={t("rateCards.placeholderProject")}
                data-ocid="rate_cards.project_rate.input"
              />
            </FormField>

            <FormField label={t("common.notes")}>
              <Input
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder={t("common.optionalNotes")}
                data-ocid="rate_cards.notes.input"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeForm}
              data-ocid="rate_cards.cancel_button"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={addUpdate.isPending}
              data-ocid="rate_cards.save_button"
            >
              {addUpdate.isPending
                ? t("common.saving")
                : editingId
                  ? t("common.update")
                  : t("common.add")}
            </Button>
          </div>
        </div>
      )}

      {/* Rate card list */}
      {isLoading ? (
        <div className="space-y-[var(--space-2)]">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-14 bg-surface-elevated rounded-lg border border-border animate-pulse"
            />
          ))}
        </div>
      ) : rateCards.length === 0 && !isAdding ? (
        <EmptyState
          heading={t("rateCards.empty")}
          message={t("rateCards.emptyBody")}
          icon={CreditCard}
          action={{ label: t("common.addRateCard"), onClick: openAdd }}
          data-ocid="rate_cards.empty_state"
        />
      ) : (
        <div
          className="bg-surface-elevated rounded-lg border border-border overflow-hidden"
          data-ocid="rate_cards.list"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="text-token-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-3">
                  {t("common.name")}
                </th>
                <th className="text-token-xs font-semibold uppercase tracking-wider text-muted-foreground text-right tabular-nums py-2 px-3">
                  {t("common.hourly")}
                </th>
                <th className="text-token-xs font-semibold uppercase tracking-wider text-muted-foreground text-right tabular-nums hidden sm:table-cell py-2 px-3">
                  {t("common.daily")}
                </th>
                <th className="text-token-xs font-semibold uppercase tracking-wider text-muted-foreground text-right tabular-nums hidden md:table-cell py-2 px-3">
                  {t("common.project")}
                </th>
                <th className="text-token-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-3">
                  {t("common.currency")}
                </th>
                <th className="w-20 py-2 px-3" />
              </tr>
            </thead>
            <tbody>
              {rateCards.map((rc, index) => (
                <tr
                  key={rc.id}
                  className="border-b border-border/40 last:border-0 hover:bg-accent/5 h-row"
                  data-ocid={`rate_cards.item.${index + 1}`}
                >
                  <td className="text-sm font-medium text-foreground py-2 px-3">
                    {rc.name}
                    {rc.notes && (
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {rc.notes}
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-right tabular-nums text-foreground py-2 px-3">
                    {fmtRate(rc.hourlyRate, rc.currency)}
                  </td>
                  <td className="text-sm text-right tabular-nums text-foreground hidden sm:table-cell py-2 px-3">
                    {fmtRate(rc.dailyRate, rc.currency)}
                  </td>
                  <td className="text-sm text-right tabular-nums text-foreground hidden md:table-cell py-2 px-3">
                    {fmtRate(rc.projectRate, rc.currency)}
                  </td>
                  <td className="text-xs text-muted-foreground py-2 px-3">
                    {rc.currency}
                  </td>
                  <td className="text-right py-2 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(rc)}
                        aria-label={t("rateCards.ariaEdit")}
                        data-ocid={`rate_cards.edit_button.${index + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-danger hover:text-danger"
                        onClick={() =>
                          setDeletingId(rc.id === deletingId ? null : rc.id)
                        }
                        aria-label={t("rateCards.ariaDelete")}
                        data-ocid={`rate_cards.delete_button.${index + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Confirm delete — inline below the row */}
          {deletingId && (
            <div className="border-t border-border py-3 px-3">
              <ConfirmDelete
                message={t("common.deleteThisRateCard")}
                onConfirm={handleDelete}
                onCancel={() => setDeletingId(null)}
                loading={remove.isPending}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
