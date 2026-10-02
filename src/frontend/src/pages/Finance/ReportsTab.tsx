import { ActionBar } from "@/components/shared/ActionBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useClients, useEngagements, useInvoices } from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency } from "@/lib/formatting";
import type { Invoice } from "@/types";
import { BarChart2 } from "lucide-react";

function getAgeDays(dueDate: bigint): number {
  const ms = Number(dueDate);
  const d = ms > 1e15 ? ms / 1_000_000 : ms;
  return Math.floor((Date.now() - d) / 86_400_000);
}

function arBucket(invoice: Invoice): string {
  if (invoice.status === "paid") return "paid";
  const age = getAgeDays(invoice.dueDate);
  if (age < 0) return "current";
  if (age <= 30) return "1-30";
  if (age <= 60) return "31-60";
  if (age <= 90) return "61-90";
  return "90+";
}

const AR_BUCKETS = ["current", "1-30", "31-60", "61-90", "90+"] as const;

export function ReportsTab() {
  const t = useT();
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const { data: engagements = [] } = useEngagements();

  // Revenue by client
  const revenueByClient: Record<string, number> = {};
  for (const inv of invoices.filter((i) => i.status === "paid")) {
    revenueByClient[inv.clientId] =
      (revenueByClient[inv.clientId] ?? 0) + (inv.totalAmount ?? 0);
  }

  const clientRevenue = clients
    .map((c) => ({ name: c.name, value: revenueByClient[c.id] ?? 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const maxRevenue = Math.max(...clientRevenue.map((c) => c.value), 1);

  // AR aging — outstanding only, uses dueDate
  const outstanding = invoices.filter(
    (inv) => inv.status !== "paid" && inv.status !== "cancelled",
  );
  const arByBucket: Record<string, number> = {};
  for (const inv of outstanding) {
    const bucket = arBucket(inv);
    arByBucket[bucket] = (arByBucket[bucket] ?? 0) + (inv.totalAmount ?? 0);
  }

  // Summary stats
  const totalInvoiced = invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalOutstanding = outstanding.reduce(
    (s, i) => s + (i.totalAmount ?? 0),
    0,
  );
  const activeEngagements = engagements.filter(
    (e) => e.status === "active",
  ).length;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <ActionBar
        title={t("reports.actionBarTitle")}
        icon={<BarChart2 className="w-4 h-4" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 p-page">
        <StatCard
          label={t("common.totalInvoiced")}
          value={formatCurrency(totalInvoiced)}
          loading={isLoading}
        />
        <StatCard
          label={t("common.collected")}
          value={formatCurrency(totalCollected)}
          loading={isLoading}
        />
        <StatCard
          label={t("common.outstanding")}
          value={formatCurrency(totalOutstanding)}
          loading={isLoading}
        />
        <StatCard
          label={t("common.activeEngagements")}
          value={String(activeEngagements)}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 px-page pb-page">
        {/* Revenue by client bar chart */}
        <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
          <SectionHeader title={t("common.revenueByClient")} />
          {isLoading ? (
            <div className="p-page space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : clientRevenue.length === 0 ? (
            <EmptyState
              heading={t("reports.revenueEmpty")}
              message={t("reports.revenueEmptyBody")}
              className="py-8"
            />
          ) : (
            <div className="p-page space-y-2.5">
              {clientRevenue.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground truncate">
                      {c.name}
                    </span>
                    <span className="text-sm tabular-nums font-medium text-foreground flex-shrink-0">
                      {formatCurrency(c.value)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-opacity duration-fast"
                      style={{
                        width: `${Math.round((c.value / maxRevenue) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AR aging table — uses dueDate */}
        <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
          <SectionHeader title={t("common.arAgingByDueDate")} />
          <div className="overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.ageBucket")}
                  </th>
                  <th className="text-right text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {AR_BUCKETS.map((bucket) => {
                  const amount = arByBucket[bucket] ?? 0;
                  return (
                    <tr key={bucket} className="border-b border-border/40">
                      <td className="px-4 py-3 text-sm text-foreground">
                        {t(`arAging.${bucket}`)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm tabular-nums text-right font-medium ${
                          amount > 0 && bucket !== "current"
                            ? "text-warning"
                            : "text-foreground"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">
                    {t("common.totalOutstanding")}
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums text-right font-semibold text-foreground">
                    {formatCurrency(totalOutstanding)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
