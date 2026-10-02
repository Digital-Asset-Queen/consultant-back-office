import { EmptyState } from "@/components/shared/EmptyState";
import { HealthDot } from "@/components/shared/HealthDot";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  useAllTimeEntries,
  useClients,
  useEngagements,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatHours, formatRelativeDate } from "@/lib/formatting";
import type { Engagement, TimeEntry } from "@/types";
import { Briefcase, Clock } from "lucide-react";

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

export function WorkTab() {
  const t = useT();
  const { data: engagements = [] } = useEngagements();
  const { data: clients = [] } = useClients();
  const { data: timeEntries = [] } = useAllTimeEntries();

  const active = engagements.filter((e) => e.status === "active");
  const recentTime = [...timeEntries]
    .sort((a: TimeEntry, b: TimeEntry) => {
      const aMs = toMs(a.date) ?? 0;
      const bMs = toMs(b.date) ?? 0;
      return bMs - aMs;
    })
    .slice(0, 8);

  return (
    <div className="flex flex-col h-full" data-ocid="dashboard.work_tab">
      <div className="flex-1 overflow-y-auto">
        {/* Active engagements */}
        <SectionHeader
          title={t("dashboard.work.activeEngagements")}
          description={t("dashboard.work.activeCount", {
            count: active.length,
          })}
        />
        {active.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            heading={t("dashboard.work.emptyEngagements")}
            message={t("dashboard.work.emptyEngagementsBody")}
            data-ocid="dashboard.engagements.empty_state"
          />
        ) : (
          <div className="divide-y divide-border">
            {active.map((e, i) => {
              const client = clients.find((c) => c.id === e.clientId);
              return (
                <div
                  key={e.id}
                  className="px-page py-3 flex items-center justify-between hover:bg-accent/5 transition-opacity duration-fast"
                  data-ocid={`dashboard.engagement.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HealthDot status={engagementHealth(e)} />
                    <div className="min-w-0">
                      <p className="text-token-sm font-token-semibold text-foreground truncate">
                        {e.title ?? e.name}
                      </p>
                      <p className="text-token-xs text-muted-foreground">
                        {client?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={e.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent time entries */}
        <SectionHeader
          title={t("dashboard.work.recentTime")}
          description={t("dashboard.work.recentTimeCount", {
            count: recentTime.length,
          })}
          className="mt-6"
        />
        {recentTime.length === 0 ? (
          <EmptyState
            icon={Clock}
            heading={t("dashboard.work.emptyTime")}
            message={t("dashboard.work.emptyTimeBody")}
            data-ocid="dashboard.time.empty_state"
          />
        ) : (
          <div className="divide-y divide-border">
            {recentTime.map((t: TimeEntry, i) => {
              const eng = engagements.find((e) => e.id === t.engagementId);
              const dateMs = toMs(t.date);
              return (
                <div
                  key={t.id}
                  className="px-page py-3 flex items-center justify-between"
                  data-ocid={`dashboard.time_entry.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-token-sm text-foreground truncate">
                        {t.description}
                      </p>
                      <p className="text-token-xs text-muted-foreground">
                        {eng?.title ?? eng?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-right">
                    <span className="text-token-sm font-token-semibold tabular-nums text-foreground">
                      {formatHours(t.hours)}
                    </span>
                    {dateMs && (
                      <span className="text-token-xs text-muted-foreground w-20 text-right">
                        {formatRelativeDate(dateMs)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
