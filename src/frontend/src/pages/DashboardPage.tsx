import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { HealthDot } from "@/components/shared/HealthDot";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatsBar } from "@/components/shared/StatsBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  useAllNotes,
  useAllTimeEntries,
  useClients,
  useEngagements,
  useInvoices,
  useProposals,
} from "@/hooks/useQueries";
import {
  formatCurrency,
  formatDate,
  formatHours,
  formatRelativeDate,
  getInvoiceAgeDays,
} from "@/lib/formatting";
import type {
  Client,
  Engagement,
  Invoice,
  Note,
  Proposal,
  TimeEntry,
} from "@/types";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

function toMs(ts: bigint | number | undefined): number | undefined {
  if (ts === undefined) return undefined;
  if (typeof ts === "bigint") return Number(ts / 1_000_000n);
  return ts;
}

function engagementHealth(
  e: Engagement,
): "active" | "caution" | "at-risk" | "inactive" {
  if (e.status === "closed" || e.status === "on-hold") return "inactive";
  const end = toMs(e.endDate);
  if (end && Date.now() > end) return "at-risk";
  const start = toMs(e.startDate);
  if (start && Date.now() - start > 1000 * 60 * 60 * 24 * 60) return "caution";
  return "active";
}

function OverviewTab() {
  const { data: clients } = useClients();
  const { data: engagements } = useEngagements();
  const { data: invoices } = useInvoices();
  const { data: proposals } = useProposals();

  const totalInvoiced =
    invoices?.reduce((s, i) => s + (i.totalAmount ?? 0), 0) ?? 0;
  const collected = 0;
  const outstanding = totalInvoiced - collected;
  const overdue =
    invoices
      ?.filter((i) => i.status === "sent" && getInvoiceAgeDays(i.dueDate) > 0)
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0) ?? 0;

  const stats = [
    {
      label: "Total Invoiced",
      value: formatCurrency(totalInvoiced),
      status: "neutral" as const,
    },
    {
      label: "Collected",
      value: formatCurrency(collected),
      status: "success" as const,
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstanding),
      status: outstanding > 0 ? ("warning" as const) : ("neutral" as const),
    },
    {
      label: "Overdue",
      value: formatCurrency(overdue),
      status: overdue > 0 ? ("danger" as const) : ("neutral" as const),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <StatsBar stats={stats} />
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-[var(--space-4)] p-[var(--content-padding)]">
          <MetricCard
            icon={<Users className="icon-md" />}
            label="Active Clients"
            value={clients?.length ?? 0}
          />
          <MetricCard
            icon={<Briefcase className="icon-md" />}
            label="Active Engagements"
            value={
              engagements?.filter((e) => e.status === "active").length ?? 0
            }
          />
          <MetricCard
            icon={<FileText className="icon-md" />}
            label="Open Proposals"
            value={
              proposals?.filter(
                (p) => p.status === "draft" || p.status === "sent",
              ).length ?? 0
            }
          />
          <MetricCard
            icon={<DollarSign className="icon-md" />}
            label="Invoices This Month"
            value={
              invoices?.filter((i) => {
                const d = toMs(i.issueDate);
                return d && new Date(d).getMonth() === new Date().getMonth();
              }).length ?? 0
            }
          />
          <MetricCard
            icon={<Clock className="icon-md" />}
            label="Hours Logged This Week"
            value={0}
          />
          <MetricCard
            icon={<TrendingUp className="icon-md" />}
            label="Win Rate"
            value={`${proposals && proposals.length > 0 ? Math.round((proposals.filter((p) => p.status === "accepted").length / proposals.length) * 100) : 0}%`}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-[color:var(--surface-elevated)] border border-[color:var(--border)] rounded-lg p-[var(--space-4)] flex flex-col gap-[var(--space-2)]">
      <div className="text-[color:var(--accent)]">{icon}</div>
      <span className="text-token-2xl font-token-semibold tabular-nums text-[color:var(--foreground)]">
        {value}
      </span>
      <span className="text-token-xs text-[color:var(--muted-foreground)]">
        {label}
      </span>
    </div>
  );
}

function WorkTab() {
  const { data: engagements } = useEngagements();
  const { data: clients } = useClients();
  const active = engagements?.filter((e) => e.status === "active") ?? [];

  return (
    <div className="flex flex-col h-full">
      <ActionBar title="Active Engagements" />
      <div className="flex-1 overflow-y-auto">
        {active.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            heading="No active engagements"
            message="Start a new engagement to see it here."
          />
        ) : (
          <div className="divide-y divide-[color:var(--border)]">
            {active.map((e) => {
              const client = clients?.find((c) => c.id === e.clientId);
              return (
                <div
                  key={e.id}
                  className="px-[var(--content-padding)] py-[var(--space-3)] flex items-center justify-between hover:bg-[color:var(--accent)]/5 transition-opacity-fast"
                >
                  <div className="flex items-center gap-[var(--space-3)]">
                    <HealthDot status={engagementHealth(e)} />
                    <div>
                      <p className="text-token-sm font-token-semibold text-[color:var(--foreground)]">
                        {e.title ?? e.name}
                      </p>
                      <p className="text-token-xs text-[color:var(--muted-foreground)]">
                        {client?.name ?? "—"} · {e.status}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineTab() {
  const { data: proposals } = useProposals();
  const { data: clients } = useClients();
  const stages = [
    "draft",
    "sent",
    "negotiating",
    "accepted",
    "rejected",
  ] as const;
  const stageLabels: Record<string, string> = {
    draft: "Draft",
    sent: "Sent",
    negotiating: "Negotiating",
    accepted: "Won",
    rejected: "Lost",
  };

  return (
    <div className="flex flex-col h-full">
      <ActionBar title="Pipeline & Business Development" />
      <div className="flex-1 overflow-y-auto p-[var(--content-padding)]">
        <div className="grid grid-cols-5 gap-[var(--space-3)]">
          {stages.map((stage) => {
            const items = proposals?.filter((p) => p.status === stage) ?? [];
            const total = items.reduce((s, p) => s + (p.amount ?? 0), 0);
            return (
              <div key={stage} className="flex flex-col gap-[var(--space-2)]">
                <div className="flex items-center justify-between px-[var(--space-2)] py-1">
                  <span className="text-token-xs font-token-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                    {stageLabels[stage]}
                  </span>
                  <span className="text-token-xs tabular-nums text-[color:var(--foreground)]">
                    {items.length}
                  </span>
                </div>
                <div className="text-token-xs text-[color:var(--muted-foreground)] px-[var(--space-2)]">
                  {formatCurrency(total)}
                </div>
                <div className="flex flex-col gap-[var(--space-2)]">
                  {items.map((p) => {
                    const client = clients?.find((c) => c.id === p.clientId);
                    return (
                      <div
                        key={p.id}
                        className="bg-[color:var(--surface-elevated)] border border-[color:var(--border)] rounded-lg p-[var(--space-3)]"
                      >
                        <p className="text-token-sm font-token-semibold text-[color:var(--foreground)]">
                          {p.title ?? p.name}
                        </p>
                        <p className="text-token-xs text-[color:var(--muted-foreground)]">
                          {client?.name ?? "—"}
                        </p>
                        <p className="text-token-sm font-token-semibold tabular-nums text-[color:var(--foreground)] mt-1">
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
    </div>
  );
}

function FinanceTab() {
  const { data: invoices } = useInvoices();

  const columns = [
    {
      key: "number",
      header: "Invoice",
      render: (i: Invoice) => (
        <span className="text-token-sm font-token-semibold text-[color:var(--foreground)]">
          {i.invoiceNumber}
        </span>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (i: Invoice) => (
        <span className="text-token-sm text-[color:var(--foreground)]">
          {i.clientId}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right" as const,
      render: (i: Invoice) => (
        <span className="text-token-sm tabular-nums text-[color:var(--foreground)]">
          {formatCurrency(i.totalAmount ?? 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (i: Invoice) => <StatusBadge status={i.status} />,
    },
    {
      key: "due",
      header: "Due",
      render: (i: Invoice) => {
        const age = getInvoiceAgeDays(i.dueDate);
        return (
          <span
            className={`text-token-sm ${age > 0 ? "text-[color:var(--danger)]" : "text-[color:var(--muted-foreground)]"}`}
          >
            {age > 0 ? `${age}d overdue` : formatDate(toMs(i.dueDate))}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <ActionBar title="Finance Overview" />
      <div className="flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          data={invoices ?? []}
          emptyMessage="No invoices yet."
        />
      </div>
    </div>
  );
}

function ActivityTab() {
  const { data: notes } = useAllNotes();
  const { data: timeEntries } = useAllTimeEntries();

  const activities: {
    type: string;
    text: string;
    date: number;
    icon: React.ReactNode;
  }[] = [];

  if (notes) {
    for (const n of notes) {
      const d = toMs(n.createdAt);
      if (d)
        activities.push({
          type: "note",
          text: n.content.substring(0, 80),
          date: d,
          icon: <FileText className="icon-sm" />,
        });
    }
  }

  if (timeEntries) {
    for (const t of timeEntries) {
      const d = toMs(t.date);
      if (d)
        activities.push({
          type: "time",
          text: `${formatHours(t.hours)} on ${t.description}`,
          date: d,
          icon: <Clock className="icon-sm" />,
        });
    }
  }

  activities.sort((a, b) => b.date - a.date);

  return (
    <div className="flex flex-col h-full">
      <ActionBar title="Recent Activity" />
      <div className="flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <EmptyState
            icon={Calendar}
            heading="No recent activity"
            message="Log time or add notes to see activity here."
          />
        ) : (
          <div className="divide-y divide-[color:var(--border)]">
            {activities.slice(0, 50).map((a, i) => (
              <div
                key={i}
                className="px-[var(--content-padding)] py-[var(--space-3)] flex items-start gap-[var(--space-3)]"
              >
                <div className="text-[color:var(--accent)] mt-0.5">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-token-sm text-[color:var(--foreground)] truncate">
                    {a.text}
                  </p>
                  <p className="text-token-xs text-[color:var(--muted-foreground)]">
                    {formatRelativeDate(a.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ModuleLayout
      title="Dashboard"
      storageKey="dashboard"
      defaultTab="overview"
      tabs={[
        { key: "overview", label: "Overview", content: <OverviewTab /> },
        { key: "work", label: "Work", content: <WorkTab /> },
        { key: "pipeline", label: "Pipeline & BD", content: <PipelineTab /> },
        { key: "finance", label: "Finance", content: <FinanceTab /> },
        { key: "activity", label: "Activity", content: <ActivityTab /> },
      ]}
    />
  );
}
