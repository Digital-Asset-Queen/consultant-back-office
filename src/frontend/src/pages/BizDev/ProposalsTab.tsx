import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { InlineForm } from "@/components/shared/InlineForm";
import { StatsBar } from "@/components/shared/StatsBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
  useAddUpdateProposal,
  useClients,
  useProposals,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Proposal } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_VALUES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "won") return "success";
  if (s === "lost") return "danger";
  if (s === "negotiation") return "warning";
  if (s === "proposal") return "info";
  return "neutral" as const;
}

type FormState = {
  name: string;
  clientId: string;
  status: string;
  amount: string;
  notes: string;
  startDate: string;
  endDate: string;
};

const today = new Date().toISOString().split("T")[0];
const emptyForm: FormState = {
  name: "",
  clientId: "",
  status: "lead",
  amount: "",
  notes: "",
  startDate: today,
  endDate: "",
};

export function ProposalsTab() {
  const t = useT();
  const { data: proposals = [], isLoading } = useProposals();
  const { data: clients = [] } = useClients();
  const addUpdate = useAddUpdateProposal();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [statusFilter, setStatusFilter] = useState("all");

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const filtered =
    statusFilter === "all"
      ? proposals
      : proposals.filter((p) => p.status === statusFilter);

  const totalValue = proposals.reduce((s, p) => s + (p.amount ?? 0), 0);
  const activeCount = proposals.filter(
    (p) => p.status !== "won" && p.status !== "lost",
  ).length;
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
    { label: t("common.totalValue"), value: formatCurrency(totalValue) },
    { label: t("common.activeCount"), value: String(activeCount) },
    {
      label: t("common.wonValue"),
      value: formatCurrency(wonValue),
      status: "success" as const,
    },
    { label: t("common.winRate"), value: `${winRate}%` },
  ];

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.clientId) {
      toast.error(t("proposals.nameRequired"));
      return;
    }
    const record: Proposal = {
      id: `proposal-${Date.now()}`,
      name: form.name.trim(),
      clientId: form.clientId,
      status: form.status,
      amount: Number.parseFloat(form.amount) || 0,
      notes: form.notes,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      startDate: form.startDate
        ? BigInt(new Date(form.startDate).getTime()) * 1_000_000n
        : BigInt(Date.now()) * 1_000_000n,
      endDate: form.endDate
        ? BigInt(new Date(form.endDate).getTime()) * 1_000_000n
        : undefined,
      sentDate: BigInt(Date.now()) * 1_000_000n,
    };
    try {
      await addUpdate.mutateAsync(record);
      setForm(emptyForm);
      setShowForm(false);
      toast.success(t("proposals.added"));
    } catch {
      toast.error(t("proposals.addFailed"));
    }
  }

  async function handleStatusChange(proposal: Proposal, newStatus: string) {
    try {
      await addUpdate.mutateAsync({ ...proposal, status: newStatus });
      toast.success(t("proposals.statusUpdated"));
    } catch {
      toast.error(t("proposals.statusUpdateFailed"));
    }
  }

  const columns = [
    {
      key: "name",
      header: t("common.proposal"),
      render: (p: Proposal) => (
        <span className="font-semibold text-foreground">
          {p.name || p.title}
        </span>
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
      key: "status",
      header: t("common.status"),
      render: (p: Proposal) => (
        <Select
          value={p.status}
          onValueChange={(v) => handleStatusChange(p, v)}
        >
          <SelectTrigger className="h-7 w-36 text-xs">
            <StatusBadge
              variant={statusVariant(p.status)}
              label={t(`proposalStage.${p.status}`)}
            />
          </SelectTrigger>
          <SelectContent>
            {STATUS_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`proposalStage.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "amount",
      header: t("common.amount"),
      align: "right" as const,
      render: (p: Proposal) => (
        <span className="tabular-nums">{formatCurrency(p.amount ?? 0)}</span>
      ),
    },
    {
      key: "startDate",
      header: t("common.startDate"),
      render: (p: Proposal) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDate(p.startDate)}
        </span>
      ),
    },
    {
      key: "endDate",
      header: t("common.endDate"),
      render: (p: Proposal) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDate(p.endDate)}
        </span>
      ),
    },
    {
      key: "sent",
      header: t("common.sentDate"),
      render: (p: Proposal) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDate(p.sentDate ?? p.createdAt)}
        </span>
      ),
    },
    {
      key: "validUntil",
      header: t("common.validUntil"),
      render: (p: Proposal) => (
        <span className="text-muted-foreground tabular-nums">
          {formatDate(p.expiryDate ?? p.endDate)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <StatsBar stats={stats} />
      <ActionBar
        title={t("tab.bizdev.proposals")}
        right={
          <div className="flex items-center gap-space-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="h-7 w-36 text-xs"
                data-ocid="proposals.status_filter.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
                {STATUS_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`proposalStage.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              data-ocid="proposals.add_button"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {t("common.newProposal")}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-page">
        {showForm && (
          <InlineForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={t("common.newProposal")}
            onSubmit={handleAdd}
            submitLabel={t("common.addProposal")}
            loading={addUpdate.isPending}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label
                  htmlFor="field-proposal-name"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.proposalName")}
                </label>
                <Input
                  id="field-proposal-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={t("proposals.placeholderName")}
                  data-ocid="proposals.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="field-proposal-client"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.client")}
                </label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => set("clientId", v)}
                >
                  <SelectTrigger
                    id="field-proposal-client"
                    data-ocid="proposals.client.select"
                  >
                    <SelectValue placeholder={t("common.selectClient")} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-proposal-status"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.status")}
                </label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v)}
                >
                  <SelectTrigger
                    id="field-proposal-status"
                    data-ocid="proposals.status.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`proposalStage.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-proposal-amount"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.amountUSD")}
                </label>
                <Input
                  id="field-proposal-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  placeholder="0"
                  data-ocid="proposals.amount.input"
                />
              </div>
              <div>
                <label
                  htmlFor="field-proposal-start-date"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.startDate")}
                </label>
                <Input
                  id="field-proposal-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  data-ocid="proposals.start_date.input"
                />
              </div>
              <div>
                <label
                  htmlFor="field-proposal-end-date"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.endDate")}
                </label>
                <Input
                  id="field-proposal-end-date"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                  data-ocid="proposals.end_date.input"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="field-proposal-notes"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.notes")}
                </label>
                <Input
                  id="field-proposal-notes"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder={t("common.optionalNotes")}
                  data-ocid="proposals.notes.input"
                />
              </div>
            </div>
          </InlineForm>
        )}

        <DataTable
          columns={columns}
          data={filtered}
          loading={isLoading}
          rowKey={(p) => p.id}
          emptyTitle={t("proposals.empty")}
          emptyDescription={t("proposals.emptyBody")}
        />
      </div>
    </div>
  );
}
