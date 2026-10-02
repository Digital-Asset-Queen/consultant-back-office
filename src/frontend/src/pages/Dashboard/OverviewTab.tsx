import { StatCard } from "@/components/shared/StatCard";
import { StatsBar } from "@/components/shared/StatsBar";
import {
  useAddUpdateReminder,
  useClients,
  useEngagements,
  useInvoices,
  useMarkReminderDone,
  usePendingFollowUps,
  useProposals,
  useRateCards,
  useRemoveReminder,
  useUpcomingReminders,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { dateToNanos, formatCurrency, formatDate } from "@/lib/formatting";
import type { Invoice } from "@/types";
import {
  AlertCircle,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

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

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status?: "neutral" | "success" | "warning" | "danger";
}

function MetricCard({ icon, label, value, status }: MetricCardProps) {
  const valueColor =
    status === "success"
      ? "text-success"
      : status === "warning"
        ? "text-warning"
        : status === "danger"
          ? "text-danger"
          : "text-foreground";

  return (
    <div className="bg-surface-elevated border border-border rounded-lg p-4 flex flex-col gap-2">
      <div className="text-accent">{icon}</div>
      <span
        className={`text-token-2xl font-token-semibold tabular-nums ${valueColor}`}
      >
        {value}
      </span>
      <span className="text-token-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function OverviewTab() {
  const t = useT();
  const { data: clients = [] } = useClients();
  const { data: engagements = [] } = useEngagements();
  const { data: invoices = [] } = useInvoices();
  const { data: proposals = [] } = useProposals();
  const { data: followUps = [] } = usePendingFollowUps();
  const { data: reminders = [] } = useUpcomingReminders();
  const { data: rateCards = [] } = useRateCards();

  const markDone = useMarkReminderDone();
  const addUpdate = useAddUpdateReminder();
  const removeReminder = useRemoveReminder();

  // Add reminder form state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderMessage, setNewReminderMessage] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderEngagement, setNewReminderEngagement] = useState("");
  // Inline remove confirmations: id -> boolean
  const [pendingRemove, setPendingRemove] = useState<Record<string, boolean>>(
    {},
  );

  const totalInvoiced = invoices.reduce(
    (s: number, i: Invoice) => s + (i.totalAmount ?? 0),
    0,
  );
  const outstanding = invoices
    .filter((i: Invoice) => i.status === "sent" || i.status === "draft")
    .reduce((s: number, i: Invoice) => s + (i.totalAmount ?? 0), 0);
  const overdue = invoices
    .filter(
      (i: Invoice) =>
        (i.status === "sent" || i.status === "overdue") &&
        getAgeDays(i.dueDate) > 0,
    )
    .reduce((s: number, i: Invoice) => s + (i.totalAmount ?? 0), 0);
  const collected = totalInvoiced - outstanding;

  const activeEngagements = engagements.filter((e) => e.status === "active");
  const openProposals = proposals.filter(
    (p) => p.status === "draft" || p.status === "sent",
  );
  const winRate =
    proposals.length > 0
      ? Math.round(
          (proposals.filter((p) => p.status === "accepted").length /
            proposals.length) *
            100,
        )
      : 0;

  const statsBarData = [
    { label: t("common.totalInvoiced"), value: formatCurrency(totalInvoiced) },
    {
      label: t("common.collected"),
      value: formatCurrency(collected),
      status: "success" as const,
    },
    {
      label: t("common.outstanding"),
      value: formatCurrency(outstanding),
      status: outstanding > 0 ? ("warning" as const) : undefined,
    },
    {
      label: t("common.overdueAmount"),
      value: formatCurrency(overdue),
      status: overdue > 0 ? ("danger" as const) : undefined,
    },
  ];

  function handleSaveReminder() {
    if (!newReminderMessage.trim() || !newReminderDate) return;
    addUpdate.mutate(
      {
        id: crypto.randomUUID(),
        message: newReminderMessage.trim(),
        dueDate: dateToNanos(newReminderDate),
        engagementId: newReminderEngagement,
        completed: false,
      },
      {
        onSuccess: () => {
          setShowAddReminder(false);
          setNewReminderMessage("");
          setNewReminderDate("");
          setNewReminderEngagement("");
        },
      },
    );
  }

  function handleRemoveClick(id: string) {
    if (pendingRemove[id]) {
      removeReminder.mutate(id, {
        onSuccess: () =>
          setPendingRemove((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          }),
      });
    } else {
      setPendingRemove((prev) => ({ ...prev, [id]: true }));
    }
  }

  return (
    <div className="flex flex-col h-full" data-ocid="dashboard.overview_tab">
      <StatsBar stats={statsBarData} />

      <div className="flex-1 overflow-y-auto p-page">
        {/* Key metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            label={t("common.activeClients")}
            value={clients.length}
          />
          <MetricCard
            icon={<Briefcase className="w-5 h-5" />}
            label={t("common.activeEngagements")}
            value={activeEngagements.length}
          />
          <MetricCard
            icon={<FileText className="w-5 h-5" />}
            label={t("common.openProposals")}
            value={openProposals.length}
          />
          <MetricCard
            icon={<DollarSign className="w-5 h-5" />}
            label={t("common.outstanding")}
            value={formatCurrency(outstanding)}
            status={outstanding > 0 ? "warning" : "neutral"}
          />
          <MetricCard
            icon={<AlertCircle className="w-5 h-5" />}
            label={t("common.overdueAmount")}
            value={formatCurrency(overdue)}
            status={overdue > 0 ? "danger" : "neutral"}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label={t("common.winRate")}
            value={`${winRate}%`}
            status={
              winRate >= 60 ? "success" : winRate >= 30 ? "warning" : "neutral"
            }
          />
        </div>

        {/* Today panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Follow-ups */}
          <div className="bg-surface-elevated border border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                {t("common.followupsDue")}
              </span>
            </div>
            {followUps.length === 0 ? (
              <div className="px-4 py-4 text-token-sm text-muted-foreground">
                {t("dashboard.overview.followupsEmpty")}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {followUps.slice(0, 5).map((note, i) => (
                  <div
                    key={note.id}
                    className="px-4 py-3"
                    data-ocid={`dashboard.followup.item.${i + 1}`}
                  >
                    <p className="text-token-sm text-foreground line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming reminders */}
          <div className="bg-surface-elevated border border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                {t("common.upcomingReminders")}
              </span>
              <button
                type="button"
                onClick={() => setShowAddReminder((v) => !v)}
                className="text-token-xs text-accent hover:text-foreground transition-opacity duration-150 font-token-medium"
                data-ocid="dashboard.reminder.open_modal_button"
              >
                {showAddReminder ? t("common.cancel") : t("common.addWithPlus")}
              </button>
            </div>

            {reminders.length === 0 && !showAddReminder ? (
              <div className="px-4 py-4 text-token-sm text-muted-foreground">
                {t("dashboard.overview.remindersEmpty")}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reminders.slice(0, 5).map((reminder, i) => (
                  <div
                    key={reminder.id}
                    className={`px-4 py-3 flex items-center gap-2 ${
                      reminder.completed ? "opacity-50" : ""
                    }`}
                    data-ocid={`dashboard.reminder.item.${i + 1}`}
                  >
                    <p className="text-token-sm text-foreground truncate flex-1 min-w-0">
                      {reminder.message ?? reminder.text}
                    </p>
                    {reminder.dueDate && (
                      <span className="text-token-xs text-muted-foreground tabular-nums flex-shrink-0">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDate(reminder.dueDate)}
                      </span>
                    )}
                    {!reminder.completed && (
                      <button
                        type="button"
                        onClick={() => markDone.mutate(reminder.id)}
                        disabled={markDone.isPending}
                        className="flex-shrink-0 text-token-xs border border-border rounded px-1.5 py-0.5 text-muted-foreground hover:text-success hover:border-success transition-colors duration-150 disabled:opacity-50"
                        data-ocid={`dashboard.reminder.done_button.${i + 1}`}
                        title={t("common.markAsDone")}
                      >
                        {t("common.markDone")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveClick(reminder.id)}
                      disabled={removeReminder.isPending}
                      className={`flex-shrink-0 text-token-xs px-1.5 py-0.5 rounded transition-colors duration-150 disabled:opacity-50 ${
                        pendingRemove[reminder.id]
                          ? "border border-danger text-danger hover:bg-danger/10"
                          : "text-muted-foreground hover:text-danger"
                      }`}
                      data-ocid={`dashboard.reminder.delete_button.${i + 1}`}
                      title={t("common.removeReminder")}
                    >
                      {pendingRemove[reminder.id]
                        ? t("common.confirmQuestion")
                        : "×"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Inline add form */}
            {showAddReminder && (
              <div
                className="px-4 py-3 border-t border-border flex flex-col gap-2"
                data-ocid="dashboard.reminder.dialog"
              >
                <input
                  type="text"
                  placeholder={t("common.reminderMessage")}
                  value={newReminderMessage}
                  onChange={(e) => setNewReminderMessage(e.target.value)}
                  className="w-full text-token-sm bg-surface border border-border rounded px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-150"
                  data-ocid="dashboard.reminder.input"
                />
                <input
                  type="date"
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  className="w-full text-token-sm bg-surface border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-150"
                  data-ocid="dashboard.reminder.select"
                />
                {engagements.length > 0 && (
                  <select
                    value={newReminderEngagement}
                    onChange={(e) => setNewReminderEngagement(e.target.value)}
                    className="w-full text-token-sm bg-surface border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-150"
                    data-ocid="dashboard.reminder.engagement_select"
                  >
                    <option value="">{t("common.noEngagementOptional")}</option>
                    {engagements.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.title}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveReminder}
                    disabled={
                      !newReminderMessage.trim() ||
                      !newReminderDate ||
                      addUpdate.isPending
                    }
                    className="flex-1 text-token-sm font-token-medium bg-accent text-on-accent rounded px-3 py-1.5 hover:opacity-90 transition-opacity duration-150 disabled:opacity-40"
                    data-ocid="dashboard.reminder.submit_button"
                  >
                    {addUpdate.isPending
                      ? t("common.saving")
                      : t("common.save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddReminder(false);
                      setNewReminderMessage("");
                      setNewReminderDate("");
                      setNewReminderEngagement("");
                    }}
                    className="text-token-sm text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors duration-150"
                    data-ocid="dashboard.reminder.cancel_button"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Cards */}
        <div className="mt-4 bg-surface-elevated border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
              {t("common.rateCardsSection")}
            </span>
            <a
              href="#/admin"
              className="text-token-xs text-accent hover:text-foreground transition-opacity duration-150 font-token-medium"
              data-ocid="dashboard.ratecards.manage_link"
            >
              {t("common.manageRateCards")}
            </a>
          </div>
          {rateCards.length === 0 ? (
            <div className="px-4 py-4 text-token-sm text-muted-foreground">
              {t("dashboard.overview.rateCardsEmpty")}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rateCards.slice(0, 5).map((rc, i) => (
                <div
                  key={rc.id}
                  className="px-4 py-3 flex items-center justify-between"
                  data-ocid={`dashboard.ratecard.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-token-sm text-foreground truncate">
                      {rc.serviceName || rc.name}
                    </span>
                  </div>
                  <span className="text-token-sm font-token-semibold tabular-nums text-foreground flex-shrink-0">
                    {rc.hourlyRate
                      ? `${Number(rc.hourlyRate)}${t("common.perHour")}`
                      : rc.dailyRate
                        ? `${Number(rc.dailyRate)}${t("common.perDay")}`
                        : rc.projectRate
                          ? `${Number(rc.projectRate)}${t("common.perProject")}`
                          : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stat cards row */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label={t("dashboard.overview.statClients")}
            value={String(clients.length)}
          />
          <StatCard
            label={t("dashboard.overview.statEngagements")}
            value={String(activeEngagements.length)}
          />
          <StatCard
            label={t("dashboard.overview.statFollowups")}
            value={String(followUps.length)}
          />
          <StatCard
            label={t("dashboard.overview.statReminders")}
            value={String(reminders.length)}
          />
        </div>
      </div>
    </div>
  );
}
