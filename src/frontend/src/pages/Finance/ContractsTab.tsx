import { ActionBar } from "@/components/shared/ActionBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsBar } from "@/components/shared/StatsBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TwoPanel } from "@/components/shared/TwoPanel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContracts, useEngagements } from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/formatting";
import type { Contract } from "@/types";
import { FileSignature, Plus } from "lucide-react";
import { useState } from "react";

function daysUntil(ts: bigint): number {
  const ms = Number(ts);
  const d = ms > 1e15 ? ms / 1_000_000 : ms;
  return Math.ceil((d - Date.now()) / 86_400_000);
}

/** Variant for the existing contract status badge (unchanged). */
function contractStatusVariant(
  status: string,
): "success" | "warning" | "danger" | "neutral" | "info" {
  const s = status.toLowerCase();
  if (s === "active") return "success";
  if (s === "draft") return "info";
  if (s === "expired" || s === "cancelled") return "danger";
  return "neutral";
}

/** Returns 'overdue' | 'expiring' | null for the additive overlay badge. */
function expiryOverlay(contract: Contract): "overdue" | "expiring" | null {
  if (!contract.endDate) return null;
  const days = daysUntil(contract.endDate);
  if (days <= 0) return "overdue";
  if (days <= 30) return "expiring";
  return null;
}

export function ContractsTab() {
  const t = useT();
  const { data: contracts = [], isLoading } = useContracts();
  const { data: engagements = [] } = useEngagements();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    { value: "all", label: t("contractStatus.all") },
    { value: "active", label: t("contractStatus.active") },
    { value: "draft", label: t("contractStatus.draft") },
    { value: "expired", label: t("contractStatus.expired") },
    { value: "cancelled", label: t("contractStatus.cancelled") },
  ];

  const engMap = Object.fromEntries(engagements.map((e) => [e.id, e.name]));

  const filtered =
    statusFilter === "all"
      ? contracts
      : contracts.filter((c) => c.status === statusFilter);

  const expiringCount = contracts.filter(
    (c) => expiryOverlay(c) === "expiring",
  ).length;
  const expiredCount = contracts.filter(
    (c) => expiryOverlay(c) === "overdue",
  ).length;

  const stats = [
    { label: t("contracts.total"), value: contracts.length },
    {
      label: t("common.expiringSoon"),
      value: expiringCount,
      status: expiringCount > 0 ? ("warning" as const) : undefined,
    },
    {
      label: t("common.expiredCount"),
      value: expiredCount,
      status: expiredCount > 0 ? ("danger" as const) : undefined,
    },
  ];

  const selected = contracts.find((c) => c.id === selectedId) ?? null;

  const listPanel = (
    <div className="flex flex-col h-full">
      <div className="p-page border-b border-border">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="h-7 w-full text-xs"
            data-ocid="contracts.status_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-1 p-page">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            heading={t("contracts.empty")}
            message={t("contracts.emptyBody")}
            data-ocid="contracts.empty_state"
          />
        ) : (
          <div>
            {filtered.map((contract, idx) => (
              <button
                key={contract.id}
                type="button"
                onClick={() => setSelectedId(contract.id)}
                className={`w-full text-left px-page py-3 border-b border-border/40 transition-opacity duration-fast ${
                  selectedId === contract.id
                    ? "bg-accent/10 border-l-2 border-l-accent"
                    : expiryOverlay(contract) === "overdue"
                      ? "bg-danger-subtle hover:bg-danger/10"
                      : expiryOverlay(contract) === "expiring"
                        ? "bg-warning-subtle hover:bg-warning/10"
                        : "hover:bg-accent/5"
                }`}
                data-ocid={`contracts.contract.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {engMap[contract.engagementId] ?? contract.engagementId}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <StatusBadge
                      variant={contractStatusVariant(contract.status)}
                      label={t(`contractStatus.${contract.status}`)}
                    />
                    {expiryOverlay(contract) === "overdue" && (
                      <StatusBadge
                        variant="danger"
                        label={t("common.overdue")}
                      />
                    )}
                    {expiryOverlay(contract) === "expiring" && (
                      <StatusBadge
                        variant="warning"
                        label={t("common.expiring")}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(contract.startDate)} —{" "}
                    {formatDate(contract.endDate)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const detailPanel = selected ? (
    <ContractDetail
      contract={selected}
      engName={engMap[selected.engagementId]}
    />
  ) : (
    <EmptyState
      heading={t("contracts.selectContract")}
      message={t("contracts.selectContractBody")}
      data-ocid="contracts.detail.empty_state"
    />
  );

  return (
    <div className="flex flex-col h-full">
      <StatsBar stats={stats} />
      <ActionBar
        title={t("contracts.actionBarTitle")}
        actions={
          <Button
            type="button"
            size="sm"
            data-ocid="contracts.new_contract.button"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("common.newContract")}
          </Button>
        }
      />
      <div className="flex-1 min-h-0">
        <TwoPanel list={listPanel} detail={detailPanel} />
      </div>
    </div>
  );
}

function ContractDetail({
  contract,
  engName,
}: {
  contract: Contract;
  engName: string | undefined;
}) {
  const t = useT();
  const overlay = expiryOverlay(contract);

  return (
    <div className="p-page space-y-4 overflow-auto h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground text-token-xl">
            {engName ?? contract.engagementId}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("contracts.contractNumber", { id: contract.id.slice(-6) })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge
            variant={contractStatusVariant(contract.status)}
            label={t(`contractStatus.${contract.status}`)}
            size="md"
          />
          {overlay === "overdue" && (
            <StatusBadge
              variant="danger"
              label={t("common.overdue")}
              size="md"
            />
          )}
          {overlay === "expiring" && (
            <StatusBadge
              variant="warning"
              label={t("common.expiring")}
              size="md"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ContractRow
          label={t("common.startDate")}
          value={formatDate(contract.startDate)}
        />
        <ContractRow
          label={t("common.endDate")}
          value={formatDate(contract.endDate)}
        />
        <ContractRow
          label={t("common.renewalDate")}
          value={formatDate(contract.renewalDate)}
        />
        <ContractRow
          label={t("common.status")}
          value={t(`contractStatus.${contract.status}`)}
        />
      </div>

      {contract.endDate &&
        (() => {
          const days = daysUntil(contract.endDate);
          if (days > 0 && days <= 30) {
            return (
              <div className="flex items-center gap-2 p-3 bg-warning-subtle border border-warning/30 rounded-lg">
                <span className="text-sm font-medium text-warning">
                  {t("contracts.expiringIn", {
                    count: days,
                    plural: days !== 1 ? "s" : "",
                  })}
                </span>
              </div>
            );
          }
          if (days <= 0) {
            return (
              <div className="flex items-center gap-2 p-3 bg-danger-subtle border border-danger/30 rounded-lg">
                <span className="text-sm font-medium text-danger">
                  {t("contracts.hasExpired")}
                </span>
              </div>
            );
          }
          return null;
        })()}

      {contract.notes && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {t("common.notes")}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {contract.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function ContractRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground mt-0.5">{value}</p>
    </div>
  );
}
