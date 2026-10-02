import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { useT } from "@/i18n/LanguageContext";
import { ActivityTab } from "./ActivityTab";
import { FinanceTab } from "./FinanceTab";
import { OverviewTab } from "./OverviewTab";
import { PipelineTab } from "./PipelineTab";
import { WorkTab } from "./WorkTab";

// NOTE: Tab icon refs are imported from lucide and resolved as local vars INSIDE the
// component function body to prevent React error #31. Do NOT lift the tabs array
// outside the function.

import {
  Activity,
  BarChart2,
  Briefcase,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";

export default function DashboardModule() {
  const t = useT();

  // IMPORTANT: tabs array defined INSIDE component body — icons must be local vars
  const IconDashboard = LayoutDashboard;
  const IconWork = Briefcase;
  const IconPipeline = BarChart2;
  const IconFinance = DollarSign;
  const IconActivity = Activity;

  const tabs = [
    {
      key: "overview",
      label: t("tab.dashboard.overview"),
      icon: IconDashboard,
      content: <OverviewTab />,
    },
    {
      key: "work",
      label: t("tab.dashboard.work"),
      icon: IconWork,
      content: <WorkTab />,
    },
    {
      key: "pipeline",
      label: t("tab.dashboard.pipeline"),
      icon: IconPipeline,
      content: <PipelineTab />,
    },
    {
      key: "finance",
      label: t("tab.dashboard.finance"),
      icon: IconFinance,
      content: <FinanceTab />,
    },
    {
      key: "activity",
      label: t("tab.dashboard.activity"),
      icon: IconActivity,
      content: <ActivityTab />,
    },
  ];

  return (
    <ModuleLayout
      title={t("module.dashboard.title")}
      storageKey="dashboard"
      defaultTab="overview"
      tabs={tabs}
    />
  );
}
