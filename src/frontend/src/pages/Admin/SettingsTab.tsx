import type { PracticeProfile } from "@/backend";
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
import { useSaveSettings, useSettings } from "@/hooks/useSettings";
import { useT } from "@/i18n/LanguageContext";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CURRENCY_CODES = ["USD", "EUR", "GBP", "CAD", "AUD", "SGD", "CHF"];

const MONTH_VALUES = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

type SettingsForm = {
  name: string;
  email: string;
  currency: string;
  fiscalYearStart: string;
  hourlyRate: string;
  practiceName: string;
};

function profileToForm(profile: PracticeProfile | null): SettingsForm {
  return {
    name: profile?.ownerName ?? profile?.name ?? "",
    email: profile?.email ?? "",
    currency: profile?.currency ?? "USD",
    fiscalYearStart: "1",
    hourlyRate:
      profile?.hourlyRate != null
        ? String(Number(profile.hourlyRate) / 100)
        : "",
    practiceName: profile?.practiceName ?? "",
  };
}

export function SettingsTab() {
  const t = useT();
  const { data: profile, isLoading } = useSettings();
  const save = useSaveSettings();

  const [form, setForm] = useState<SettingsForm>(profileToForm(null));
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(profileToForm(profile));
      setIsDirty(false);
    }
  }, [profile]);

  function set(field: keyof SettingsForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  async function handleSave() {
    const hourlyRateNum = Number.parseFloat(form.hourlyRate);
    const payload: PracticeProfile = {
      id: profile?.id ?? "practice-profile-default",
      name: form.name,
      ownerName: form.name,
      practiceName: form.practiceName || form.name,
      email: form.email,
      currency: form.currency,
      hourlyRate: Number.isNaN(hourlyRateNum)
        ? undefined
        : BigInt(Math.round(hourlyRateNum * 100)),
      billingAddress: profile?.billingAddress ?? "",
      workStyle: profile?.workStyle ?? "solo",
      hasExistingClients: profile?.hasExistingClients ?? false,
      contactId: profile?.contactId ?? "",
      createdAt: profile?.createdAt ?? BigInt(Date.now()) * 1_000_000n,
    };
    try {
      await save.mutateAsync(payload);
      setIsDirty(false);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveFailed"));
    }
  }

  if (isLoading) {
    return (
      <div className="p-page max-w-2xl">
        <div className="bg-surface-elevated rounded-lg border border-border p-4 space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-page">
      <div className="max-w-2xl">
        <div className="bg-surface-elevated rounded-lg border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4 text-token-xl">
            {t("common.generalSettings")}
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label={t("common.yourName")} required>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={t("settings.placeholderName")}
                data-ocid="settings.name.input"
              />
            </FormField>

            <FormField label={t("common.email")}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={t("settings.placeholderEmail")}
                data-ocid="settings.email.input"
              />
            </FormField>

            <FormField label={t("common.practiceName")} required>
              <Input
                value={form.practiceName}
                onChange={(e) => set("practiceName", e.target.value)}
                placeholder={t("settings.placeholderPractice")}
                data-ocid="settings.practice_name.input"
              />
            </FormField>

            <FormField label={t("common.defaultHourlyRate")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.hourlyRate}
                onChange={(e) => set("hourlyRate", e.target.value)}
                placeholder={t("settings.placeholderHourly")}
                data-ocid="settings.hourly_rate.input"
              />
            </FormField>

            <FormField label={t("common.defaultCurrency")}>
              <Select
                value={form.currency}
                onValueChange={(v) => set("currency", v)}
              >
                <SelectTrigger data-ocid="settings.currency.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {t(`currency.${code}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label={t("common.fiscalYearStart")}>
              <Select
                value={form.fiscalYearStart}
                onValueChange={(v) => set("fiscalYearStart", v)}
              >
                <SelectTrigger data-ocid="settings.fiscal_year.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_VALUES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {t(`month.${m}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={handleSave}
              disabled={save.isPending || !isDirty}
              data-ocid="settings.save_button"
            >
              <Save className="w-4 h-4 mr-2" />
              {save.isPending ? t("common.saving") : t("common.saveSettings")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
