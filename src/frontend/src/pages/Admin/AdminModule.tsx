import { ModuleLayout } from "@/components/layout/ModuleLayout";
/**
 * Admin module — Settings and Rate Cards tabs.
 *
 * CRITICAL: `tabs` array MUST be defined INSIDE the component function body.
 * Icon components MUST be assigned to local vars before JSX use.
 * (Avoids React error #31 — component object rendered as child.)
 */
import { useT } from "@/i18n/LanguageContext";
import { RateCardsTab } from "@/pages/Admin/RateCardsTab";
import { SettingsTab } from "@/pages/Admin/SettingsTab";
import { CreditCard, Settings } from "lucide-react";

export function AdminModule() {
  const t = useT();
  const IconSettings = Settings;
  const IconRateCards = CreditCard;

  // ⚠️  Define INSIDE function body — not at module scope.
  const tabs = [
    {
      key: "settings",
      label: t("tab.admin.settings"),
      icon: IconSettings,
      content: <SettingsTab />,
    },
    {
      key: "rate-cards",
      label: t("tab.admin.rateCards"),
      icon: IconRateCards,
      content: <RateCardsTab />,
    },
  ];

  return (
    <ModuleLayout
      title={t("module.admin.title")}
      tabs={tabs}
      defaultTab="settings"
      storageKey="admin-module"
    />
  );
}
