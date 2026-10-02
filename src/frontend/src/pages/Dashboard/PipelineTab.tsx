import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useClients, useProposals } from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency } from "@/lib/formatting";
import type { Proposal } from "@/types";
import { TrendingUp } from "lucide-react";

const STAGE_ORDER = [
  "draft",
  "sent",
  "negotiating",
  "accepted",
  "rejected",
] as const;
type Stage = (typeof STAGE_ORDER)[number];

// Map each backend stage to its translation key in the proposalStage.* namespace.
const STAGE_LABEL_KEYS: Record<Stage, string> = {
  draft: "proposalStage.draft",
  sent: "proposalStage.sent",
  negotiating: "proposalStage.negotiating",
  accepted: "proposalStage.accepted",
  rejected: "proposalStage.rejected",
};

export function PipelineTab() {
  const t = useT();
  const { data: proposals = [] } = useProposals();
  const { data: clients = [] } = useClients();

  const activeProposals = proposals.filter(
    (p: Proposal) =>
      p.status === "draft" || p.status === "sent" || p.status === "negotiating",
  );
  const totalPipelineValue = activeProposals.reduce(
    (s: number, p: Proposal) => s + (p.amount ?? 0),
    0,
  );

  return (
    <div className="flex flex-col h-full" data-ocid="dashboard.pipeline_tab">
      <div className="flex-1 overflow-y-auto">
        {/* Summary row */}
        <div className="px-page py-3 border-b border-border flex items-center gap-6">
          <div>
            <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.pipeline.open")}
            </span>
            <p className="text-token-xl font-token-semibold tabular-nums text-foreground">
              {activeProposals.length}
            </p>
          </div>
          <div>
            <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
              {t("common.pipelineValue")}
            </span>
            <p className="text-token-xl font-token-semibold tabular-nums text-foreground">
              {formatCurrency(totalPipelineValue)}
            </p>
          </div>
          <div>
            <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.pipeline.won")}
            </span>
            <p className="text-token-xl font-token-semibold tabular-nums text-success">
              {
                proposals.filter((p: Proposal) => p.status === "accepted")
                  .length
              }
            </p>
          </div>
          <div>
            <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
              {t("dashboard.pipeline.lost")}
            </span>
            <p className="text-token-xl font-token-semibold tabular-nums text-danger">
              {
                proposals.filter((p: Proposal) => p.status === "rejected")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Stage columns */}
        <SectionHeader title={t("dashboard.pipeline.byStage")} />
        {proposals.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            heading={t("dashboard.pipeline.empty")}
            message={t("dashboard.pipeline.emptyBody")}
            data-ocid="dashboard.pipeline.empty_state"
          />
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid gap-3 p-page"
              style={{
                gridTemplateColumns: `repeat(${STAGE_ORDER.length}, minmax(160px, 1fr))`,
              }}
            >
              {STAGE_ORDER.map((stage) => {
                const items = proposals.filter(
                  (p: Proposal) => p.status === stage,
                );
                const stageTotal = items.reduce(
                  (s: number, p: Proposal) => s + (p.amount ?? 0),
                  0,
                );
                return (
                  <div
                    key={stage}
                    className="flex flex-col gap-2"
                    data-ocid={`dashboard.pipeline.stage.${stage}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                        {t(STAGE_LABEL_KEYS[stage])}
                      </span>
                      <span className="text-token-xs tabular-nums text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    {stageTotal > 0 && (
                      <span className="text-token-xs tabular-nums text-foreground">
                        {formatCurrency(stageTotal)}
                      </span>
                    )}
                    <div className="flex flex-col gap-2">
                      {items.map((p: Proposal, i) => {
                        const client = clients.find((c) => c.id === p.clientId);
                        return (
                          <div
                            key={p.id}
                            className="bg-surface-elevated border border-border rounded-lg p-3"
                            data-ocid={`dashboard.proposal.item.${i + 1}`}
                          >
                            <p className="text-token-sm font-token-semibold text-foreground line-clamp-2">
                              {p.title ?? p.name}
                            </p>
                            <p className="text-token-xs text-muted-foreground mt-0.5">
                              {client?.name ?? "—"}
                            </p>
                            <p className="text-token-sm font-token-semibold tabular-nums text-foreground mt-1">
                              {formatCurrency(p.amount ?? 0)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent proposals list */}
        <SectionHeader
          title={t("dashboard.pipeline.recentProposals")}
          className="mt-6"
        />
        <div className="divide-y divide-border">
          {proposals.slice(0, 6).map((p: Proposal, i) => {
            const client = clients.find((c) => c.id === p.clientId);
            return (
              <div
                key={p.id}
                className="px-page py-3 flex items-center justify-between hover:bg-accent/5 transition-opacity duration-fast"
                data-ocid={`dashboard.recent_proposal.item.${i + 1}`}
              >
                <div className="min-w-0">
                  <p className="text-token-sm font-token-semibold text-foreground truncate">
                    {p.title ?? p.name}
                  </p>
                  <p className="text-token-xs text-muted-foreground">
                    {client?.name ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-token-sm tabular-nums font-token-semibold text-foreground">
                    {formatCurrency(p.amount ?? 0)}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
