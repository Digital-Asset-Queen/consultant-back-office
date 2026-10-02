/**
 * Finance module — Invoicing, Contracts, Documents, Reports tabs.
 *
 * CRITICAL: `tabs` array MUST be defined INSIDE the component function body.
 * Icon components MUST be assigned to local vars before JSX use.
 * (Avoids React error #31)
 */
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { useT } from "@/i18n/LanguageContext";
import { BarChart2, FileSignature, FolderOpen, Receipt } from "lucide-react";
import { ContractsTab } from "./ContractsTab";
import { DocumentsTab } from "./DocumentsTab";
import { InvoicingTab } from "./InvoicingTab";
import { ReportsTab } from "./ReportsTab";

export function FinanceModule() {
  const t = useT();
  const IconInvoicing = Receipt;
  const IconContracts = FileSignature;
  const IconDocuments = FolderOpen;
  const IconReports = BarChart2;

  const tabs = [
    {
      key: "invoicing",
      label: t("tab.finance.invoicing"),
      icon: IconInvoicing,
      content: <InvoicingTab />,
    },
    {
      key: "contracts",
      label: t("tab.finance.contracts"),
      icon: IconContracts,
      content: <ContractsTab />,
    },
    {
      key: "documents",
      label: t("tab.finance.documents"),
      icon: IconDocuments,
      content: <DocumentsTab />,
    },
    {
      key: "reports",
      label: t("tab.finance.reports"),
      icon: IconReports,
      content: <ReportsTab />,
    },
  ];

  return (
    <ModuleLayout
      title={t("module.finance.title")}
      tabs={tabs}
      defaultTab="invoicing"
      storageKey="finance-module"
    />
  );
}

export default FinanceModule;
