import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { FormField } from "@/components/shared/FormField";
import { InlineForm } from "@/components/shared/InlineForm";
import { StatsBar } from "@/components/shared/StatsBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddUpdateProposal,
  useClients,
  useProposals,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import type { Client, Proposal } from "@/types";
import {
  ArrowRight,
  BarChart2,
  Columns,
  LayoutList,
  Plus,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const PIPELINE_STAGES = ["lead", "qualified", "proposal", "negotiation", "won"];
const ALL_STAGES = [...PIPELINE_STAGES, "lost"];

interface NewProposalDraft {
  clientId: string;
  title: string;
  amount: string;
  stage: string;
  closeDate: string;
}

/** Map a backend stage value to its translation key. */
function stageLabelKey(stage: string): string {
  return `proposalStage.${stage}`;
}

function fmtCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type ViewMode = "board" | "list";

export function PipelineTab() {
  const t = useT();
  const [view, setView] = useState<ViewMode>("board");
  const [showForm, setShowForm] = useState(false);
  const { data: proposals = [], isLoading } = useProposals();
  const { data: clients = [] } = useClients();
  const addUpdateProposal = useAddUpdateProposal();

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const pipelineProposals = proposals.filter(
    (p) => p.status !== "won" && p.status !== "lost",
  );
  const totalValue = pipelineProposals.reduce((s, p) => s + (p.amount ?? 0), 0);
  const wonValue = proposals
    .filter((p) => p.status === "won")
    .reduce((s, p) => s + (p.amount ?? 0), 0);
  const winRate =
    proposals.length > 0
      ? Math.round(
          (proposals.filter((p) => p.status === "won").length /
            proposals.length) *
            100,
        )
      : 0;

  const stats = [
    { label: t("common.pipelineValue"), value: fmtCurrency(totalValue) },
    {
      label: t("pipeline.activeProposals"),
      value: String(pipelineProposals.length),
    },
    {
      label: t("common.wonValue"),
      value: fmtCurrency(wonValue),
      status: "success" as const,
    },
    { label: t("common.winRate"), value: `${winRate}%` },
  ];

  function handleSaveProposal(draft: NewProposalDraft) {
    const record: Proposal = {
      id: "",
      clientId: draft.clientId,
      name: draft.title,
      status: draft.stage,
      amount: Number(draft.amount) || 0,
      notes: "",
      expiryDate: draft.closeDate
        ? BigInt(new Date(draft.closeDate).getTime() * 1_000_000)
        : undefined,
    };
    addUpdateProposal.mutate(record, {
      onSuccess: () => setShowForm(false),
    });
  }

  function handleAdvanceStage(proposal: Proposal) {
    const idx = PIPELINE_STAGES.indexOf(proposal.status);
    const nextStage = PIPELINE_STAGES[idx + 1];
    if (!nextStage) return;
    addUpdateProposal.mutate({ ...proposal, status: nextStage });
  }

  function handleMoveToLost(proposal: Proposal) {
    addUpdateProposal.mutate({ ...proposal, status: "lost" });
  }

  function handleSetStage(proposal: Proposal, stage: string) {
    if (stage === proposal.status) return;
    addUpdateProposal.mutate({ ...proposal, status: stage });
  }

  const columns = [
    {
      key: "name",
      header: t("common.proposal"),
      render: (p: Proposal) => (
        <span className="font-medium text-foreground">{p.name || p.title}</span>
      ),
    },
    {
      key: "client",
      header: t("common.client"),
      render: (p: Proposal) => (
        <span className="text-muted-foreground">
          {clientMap[p.clientId] ?? "—"}
        </span>
      ),
    },
    {
      key: "stage",
      header: t("common.status"),
      render: (p: Proposal) => (
        <select
          className="text-token-xs rounded border border-border bg-surface-elevated px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          value={p.status}
          onChange={(e) => handleSetStage(p, e.target.value)}
          data-ocid={`pipeline.stage_select.${p.id}`}
        >
          {ALL_STAGES.map((s) => (
            <option key={s} value={s}>
              {t(stageLabelKey(s))}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "amount",
      header: t("common.amount"),
      align: "right" as const,
      render: (p: Proposal) => (
        <span className="tabular-nums">{fmtCurrency(p.amount ?? 0)}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <StatsBar stats={stats} className="sticky top-0 z-sticky" />

      <ActionBar
        title={t("tab.bizdev.pipeline")}
        icon={<BarChart2 className="w-4 h-4" />}
        right={
          <div className="flex items-center gap-space-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowForm((v) => !v)}
              data-ocid="pipeline.new_proposal_button"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {t("common.newProposal")}
            </Button>
            <fieldset
              className="flex items-center rounded-md border border-border overflow-hidden"
              aria-label={t("pipeline.viewModeAria")}
            >
              <button
                type="button"
                onClick={() => setView("board")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-opacity duration-fast ${
                  view === "board"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="pipeline.board_view.toggle"
              >
                <Columns className="w-3.5 h-3.5" />
                {t("common.board")}
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-opacity duration-fast ${
                  view === "list"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="pipeline.list_view.toggle"
              >
                <LayoutList className="w-3.5 h-3.5" />
                {t("common.list")}
              </button>
            </fieldset>
          </div>
        }
      />

      <div className="flex-1 overflow-auto">
        <NewProposalForm
          open={showForm}
          clients={clients}
          loading={addUpdateProposal.isPending}
          onSave={handleSaveProposal}
          onCancel={() => setShowForm(false)}
        />

        {view === "board" ? (
          <BoardView
            proposals={proposals}
            clientMap={clientMap}
            loading={isLoading}
            onAdvanceStage={handleAdvanceStage}
            onMoveToLost={handleMoveToLost}
          />
        ) : (
          <DataTable
            columns={columns}
            data={proposals}
            loading={isLoading}
            rowKey={(p) => p.id}
            emptyTitle={t("pipeline.empty")}
            emptyDescription={t("pipeline.emptyBody")}
          />
        )}
      </div>
    </div>
  );
}

function NewProposalForm({
  open,
  clients,
  loading,
  onSave,
  onCancel,
}: {
  open: boolean;
  clients: Client[];
  loading: boolean;
  onSave: (draft: NewProposalDraft) => void;
  onCancel: () => void;
}) {
  const t = useT();
  const [draft, setDraft] = useState<NewProposalDraft>({
    clientId: "",
    title: "",
    amount: "",
    stage: "lead",
    closeDate: "",
  });

  function set(key: keyof NewProposalDraft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSave() {
    if (!draft.clientId || !draft.title) return;
    onSave(draft);
    setDraft({
      clientId: "",
      title: "",
      amount: "",
      stage: "lead",
      closeDate: "",
    });
  }

  return (
    <InlineForm
      isOpen={open}
      title={t("common.newProposal")}
      onClose={onCancel}
      onSubmit={handleSave}
      submitLabel={t("common.saveProposal")}
      loading={loading}
    >
      <div className="grid grid-cols-2 gap-space-3">
        <FormField label={t("common.client")} required>
          <select
            className="w-full rounded border border-input bg-background px-3 py-2 text-token-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            value={draft.clientId}
            onChange={(e) => set("clientId", e.target.value)}
            data-ocid="pipeline.new_proposal.client_select"
          >
            <option value="">{t("common.selectClient")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t("common.status")}>
          <select
            className="w-full rounded border border-input bg-background px-3 py-2 text-token-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            value={draft.stage}
            onChange={(e) => set("stage", e.target.value)}
            data-ocid="pipeline.new_proposal.stage_select"
          >
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>
                {t(stageLabelKey(s))}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t("common.titleDescription")} required>
          <Input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={t("pipeline.placeholderTitle")}
            data-ocid="pipeline.new_proposal.title_input"
          />
        </FormField>
        <FormField label={t("common.valueUSD")}>
          <Input
            type="number"
            min="0"
            value={draft.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="0"
            data-ocid="pipeline.new_proposal.amount_input"
          />
        </FormField>
        <FormField label={t("common.expectedCloseDate")}>
          <Input
            type="date"
            value={draft.closeDate}
            onChange={(e) => set("closeDate", e.target.value)}
            data-ocid="pipeline.new_proposal.close_date_input"
          />
        </FormField>
      </div>
    </InlineForm>
  );
}

function BoardView({
  proposals,
  clientMap,
  loading,
  onAdvanceStage,
  onMoveToLost,
}: {
  proposals: Proposal[];
  clientMap: Record<string, string>;
  loading: boolean;
  onAdvanceStage: (p: Proposal) => void;
  onMoveToLost: (p: Proposal) => void;
}) {
  const t = useT();

  if (loading) {
    return (
      <div className="flex gap-4 p-page overflow-x-auto">
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage}
            className="flex-shrink-0 w-56 rounded-lg bg-surface-elevated border border-border p-3"
          >
            <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const byStage = PIPELINE_STAGES.reduce<Record<string, Proposal[]>>(
    (acc, stage) => {
      acc[stage] = proposals.filter((p) => p.status === stage);
      return acc;
    },
    {},
  );

  return (
    <div className="flex gap-4 p-page overflow-x-auto h-full">
      {PIPELINE_STAGES.map((stage) => {
        const cards = byStage[stage] ?? [];
        const stageValue = cards.reduce((s, p) => s + (p.amount ?? 0), 0);
        return (
          <div
            key={stage}
            className="flex-shrink-0 w-60 flex flex-col"
            data-ocid={`pipeline.column.${stage}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(stageLabelKey(stage))}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {cards.length > 0 ? `$${Math.round(stageValue / 1000)}k` : ""}
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {cards.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground text-center">
                  {t("pipeline.noProposalsInColumn")}
                </div>
              ) : (
                cards.map((p, idx) => {
                  const isLast =
                    PIPELINE_STAGES.indexOf(p.status) >=
                    PIPELINE_STAGES.length - 1;
                  const nextStageKey =
                    PIPELINE_STAGES[PIPELINE_STAGES.indexOf(p.status) + 1];
                  return (
                    <div
                      key={p.id}
                      className="rounded-lg bg-surface-elevated border border-border p-3 space-y-1.5"
                      data-ocid={`pipeline.card.${idx + 1}`}
                    >
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {p.name || p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {clientMap[p.clientId] ?? "—"}
                      </p>
                      <div className="flex items-center justify-between pt-0.5">
                        <p className="text-xs tabular-nums font-semibold text-foreground">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(p.amount ?? 0)}
                        </p>
                      </div>
                      {!isLast && (
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            type="button"
                            onClick={() => onAdvanceStage(p)}
                            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-opacity duration-fast font-medium"
                            title={t("pipeline.advanceTitle", {
                              stage: nextStageKey
                                ? t(stageLabelKey(nextStageKey))
                                : t("pipeline.nextStage"),
                            })}
                            data-ocid={`pipeline.advance_stage.${idx + 1}`}
                          >
                            <ArrowRight className="w-3 h-3" />
                            {t("common.advance")}
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveToLost(p)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-danger transition-opacity duration-fast"
                            title={t("pipeline.moveToLostTitle")}
                            data-ocid={`pipeline.move_to_lost.${idx + 1}`}
                          >
                            <XCircle className="w-3 h-3" />
                            {t("common.lost")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
