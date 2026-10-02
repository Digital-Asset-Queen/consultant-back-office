import { EmptyState } from "@/components/shared/EmptyState";
import {
  useAllNotes,
  useAllTimeEntries,
  useInvoices,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatHours, formatRelativeDate } from "@/lib/formatting";
import type { Invoice, Note, TimeEntry } from "@/types";
import { Briefcase, Calendar, Clock, DollarSign, FileText } from "lucide-react";
import type React from "react";

function toMs(ts: bigint | number | undefined): number | undefined {
  if (ts === undefined) return undefined;
  if (typeof ts === "bigint") return Number(ts / 1_000_000n);
  return ts;
}

interface ActivityItem {
  id: string;
  type: "note" | "time" | "invoice";
  text: string;
  subtext?: string;
  date: number;
  icon: React.ReactNode;
}

export function ActivityTab() {
  const t = useT();
  const { data: notes = [] } = useAllNotes();
  const { data: timeEntries = [] } = useAllTimeEntries();
  const { data: invoices = [] } = useInvoices();

  const activities: ActivityItem[] = [];

  for (const n of notes as Note[]) {
    const d = toMs(n.createdAt);
    if (d) {
      activities.push({
        id: `note-${n.id}`,
        type: "note",
        text: n.content.substring(0, 100),
        subtext: n.followUp ? t("common.followUpRequired") : undefined,
        date: d,
        icon: <FileText className="w-3.5 h-3.5" />,
      });
    }
  }

  for (const t of timeEntries as TimeEntry[]) {
    const d = toMs(t.date);
    if (d) {
      activities.push({
        id: `time-${t.id}`,
        type: "time",
        text: t.description,
        subtext: formatHours(t.hours),
        date: d,
        icon: <Clock className="w-3.5 h-3.5" />,
      });
    }
  }

  for (const inv of invoices as Invoice[]) {
    const d = toMs(inv.createdAt ?? inv.issueDate);
    if (d) {
      activities.push({
        id: `invoice-${inv.id}`,
        type: "invoice",
        text: t("dashboard.activity.invoiceLine", {
          number: inv.invoiceNumber,
          status: inv.status,
        }),
        date: d,
        icon: <DollarSign className="w-3.5 h-3.5" />,
      });
    }
  }

  activities.sort((a, b) => b.date - a.date);
  const displayed = activities.slice(0, 60);

  const iconColorMap: Record<ActivityItem["type"], string> = {
    note: "text-accent",
    time: "text-success",
    invoice: "text-warning",
  };

  return (
    <div className="flex flex-col h-full" data-ocid="dashboard.activity_tab">
      <div className="flex-1 overflow-y-auto">
        {displayed.length === 0 ? (
          <EmptyState
            icon={Calendar}
            heading={t("dashboard.activity.empty")}
            message={t("dashboard.activity.emptyBody")}
            data-ocid="dashboard.activity.empty_state"
          />
        ) : (
          <div className="divide-y divide-border">
            {displayed.map((a, i) => (
              <div
                key={a.id}
                className="px-page py-3 flex items-start gap-3"
                data-ocid={`dashboard.activity.item.${i + 1}`}
              >
                <div className={`mt-0.5 flex-shrink-0 ${iconColorMap[a.type]}`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-token-sm text-foreground line-clamp-2">
                    {a.text}
                  </p>
                  {a.subtext && (
                    <p className="text-token-xs text-muted-foreground mt-0.5">
                      {a.subtext}
                    </p>
                  )}
                </div>
                <span className="text-token-xs text-muted-foreground flex-shrink-0 tabular-nums whitespace-nowrap">
                  {formatRelativeDate(a.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
