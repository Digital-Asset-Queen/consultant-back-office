/**
 * BizDev module — Pipeline, Proposals, Communications tabs.
 *
 * CRITICAL: `tabs` array MUST be defined INSIDE the component function body.
 * Icon components MUST be assigned to local vars before JSX use.
 * (Avoids React error #31)
 */
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { useT } from "@/i18n/LanguageContext";
import { BarChart2, FileText, MessageSquare } from "lucide-react";
import { CommunicationsTab } from "./CommunicationsTab";
import { PipelineTab } from "./PipelineTab";
import { ProposalsTab } from "./ProposalsTab";

export function BizDevModule() {
  const t = useT();
  const IconPipeline = BarChart2;
  const IconProposals = FileText;
  const IconCommunications = MessageSquare;

  const tabs = [
    {
      key: "pipeline",
      label: t("tab.bizdev.pipeline"),
      icon: IconPipeline,
      content: <PipelineTab />,
    },
    {
      key: "proposals",
      label: t("tab.bizdev.proposals"),
      icon: IconProposals,
      content: <ProposalsTab />,
    },
    {
      key: "communications",
      label: t("tab.bizdev.communications"),
      icon: IconCommunications,
      content: <CommunicationsTab />,
    },
  ];

  return (
    <ModuleLayout
      title={t("module.bizdev.title")}
      tabs={tabs}
      defaultTab="pipeline"
      storageKey="bizdev-module"
    />
  );
}

export default BizDevModule;
