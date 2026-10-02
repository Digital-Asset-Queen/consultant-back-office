import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatsBar } from "@/components/shared/StatsBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useClients, useInvoices } from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Invoice } from "@/types";
import { DollarSign } from "lucide-react";

function toMs(ts: bigint | number | undefined): number | undefined {
  if (ts === undefined) return undefined;
  if (typeof ts === "bigint") return Number(ts / 1_000_000n);
  return ts;
}

function getAgeDays(dueDate: bigint | number | undefined): number {
  const ms = toMs(dueDate);
  if (!ms) return 0;
  return Math.max(0, Math.floor((Date.now() - ms) / 86_400_000));
}

function arBucket(
  ageDays: number,
): "current" | "1-30" | "31-60" | "61-90" | "90+" {
  if (ageDays <= 0) return "current";
  if (ageDays <= 30) return "1-30";
  if (ageDays <= 60) return "31-60";
  if (ageDays <= 90) return "61-90";
  return "90+";
}

// Map each AR aging bucket to its translation key in the arAging.* namespace.
const AR_BUCKET_KEYS: Record<string, string> = {
  current: "arAging.current",
  "1-30": "arAging.1-30",
  "31-60": "arAging.31-60",
  "61-90": "arAging.61-90",
  "90+": "arAging.90+",
};

export function FinanceTab() {
  const t = useT();
  const { data: invoices = [] } = useInvoices();
  const { data: clients = [] } = useClients();

  const outstanding = invoices.filter(
    (i: Invoice) => i.status === "sent" || i.status === "overdue",
  );
  const totalOutstanding = outstanding.reduce(
    (s: number, i: Invoice) => s + (i.totalAmount ?? 0),
    0,
  );
  const overdue = outstanding.filter((i: Invoice) => getAgeDays(i.dueDate) > 0);
  const totalOverdue = overdue.reduce(
    (s: number, i: Invoice) => s + (i.totalAmount ?? 0),
    0,
  );
  const totalInvoiced = invoices.reduce(
    (s: number, i: Invoice) => s + (i.totalAmount ?? 0),
    0,
  );
  const totalPaid = invoices
    .filter((i: Invoice) => i.status === "paid")
    .reduce((s: number, i: Invoice) => s + (i.totalAmount ?? 0), 0);

  // AR aging buckets (based on due date)
  const agingBuckets: Record<string, number> = {
    current: 0,
    "1-30": 0,
    "31-60": 0,
    "61-90": 0,
    "90+": 0,
  };
  for (const inv of outstanding) {
    const age = getAgeDays(inv.dueDate);
    const bucket = arBucket(age);
    agingBuckets[bucket] = (agingBuckets[bucket] ?? 0) + (inv.totalAmount ?? 0);
  }

  const statsBarData = [
    { label: t("common.totalInvoiced"), value: formatCurrency(totalInvoiced) },
    {
      label: t("common.collected"),
      value: formatCurrency(totalPaid),
      status: "success" as const,
    },
    {
      label: t("common.outstanding"),
      value: formatCurrency(totalOutstanding),
      status: totalOutstanding > 0 ? ("warning" as const) : undefined,
    },
    {
      label: t("common.overdueAmount"),
      value: formatCurrency(totalOverdue),
      status: totalOverdue > 0 ? ("danger" as const) : undefined,
    },
  ];

  return (
    <div className="flex flex-col h-full" data-ocid="dashboard.finance_tab">
      <StatsBar stats={statsBarData} />
      <div className="flex-1 overflow-y-auto">
        {/* Outstanding invoices */}
        <SectionHeader
          title={t("dashboard.finance.outstandingInvoices")}
          description={
            outstanding.length > 0
              ? t("dashboard.finance.unpaidCount", {
                  count: outstanding.length,
                })
              : t("dashboard.finance.allPaid")
          }
        />
        {outstanding.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            heading={t("dashboard.finance.empty")}
            message={t("dashboard.finance.emptyBody")}
            data-ocid="dashboard.finance.empty_state"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border">
                  <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-2">
                    {t("common.invoice")}
                  </th>
                  <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-2">
                    {t("common.client")}
                  </th>
                  <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-right px-row py-2">
                    {t("common.amount")}
                  </th>
                  <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-2">
                    {t("common.status")}
                  </th>
                  <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-right px-row py-2">
                    {t("common.dueDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {outstanding.map((inv: Invoice, i) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  const age = getAgeDays(inv.dueDate);
                  const dueMs = toMs(inv.dueDate);
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-border/40 hover:bg-accent/5 h-row"
                      data-ocid={`dashboard.outstanding_invoice.item.${i + 1}`}
                    >
                      <td className="px-row py-row">
                        <span className="text-token-sm font-token-semibold text-foreground tabular-nums">
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-row py-row">
                        <span className="text-token-sm text-foreground">
                          {client?.name ?? inv.clientId}
                        </span>
                      </td>
                      <td className="px-row py-row text-right">
                        <span className="text-token-sm font-token-semibold tabular-nums text-foreground">
                          {formatCurrency(inv.totalAmount ?? 0)}
                        </span>
                      </td>
                      <td className="px-row py-row">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-row py-row text-right">
                        <span
                          className={`text-token-sm tabular-nums ${
                            age > 0 ? "text-danger" : "text-muted-foreground"
                          }`}
                        >
                          {age > 0
                            ? t("dashboard.finance.daysOverdue", { count: age })
                            : dueMs
                              ? formatDate(dueMs)
                              : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* AR aging summary */}
        <SectionHeader title={t("common.arAgingByDueDate")} className="mt-6" />
        <div className="grid grid-cols-5 gap-3 px-page pb-4">
          {Object.entries(agingBuckets).map(([bucket, amount]) => (
            <div
              key={bucket}
              className="bg-surface-elevated border border-border rounded-lg p-3"
              data-ocid={`dashboard.ar_aging.${bucket.replace("+", "plus")}`}
            >
              <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
                {t(AR_BUCKET_KEYS[bucket])}
              </span>
              <p
                className={`text-token-sm font-token-semibold tabular-nums mt-1 ${
                  amount > 0 && bucket !== "current"
                    ? "text-danger"
                    : "text-foreground"
                }`}
              >
                {formatCurrency(amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
