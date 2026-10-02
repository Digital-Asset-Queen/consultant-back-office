import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormField } from "@/components/shared/FormField";
import { InlineForm } from "@/components/shared/InlineForm";
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
  useAddUpdateExpense,
  useAddUpdateTimeEntry,
  useAllExpenses,
  useAllTimeEntries,
  useClients,
  useEngagements,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency, formatDate, formatHours } from "@/lib/formatting";
import type { Expense, TimeEntry } from "@/types";
import { Clock, DollarSign, Plus } from "lucide-react";
import { useState } from "react";

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function weekKey(d: Date): string {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

function nanoToMs(ts: bigint | number | undefined): number | undefined {
  if (ts === undefined) return undefined;
  if (typeof ts === "bigint") return Number(ts / 1_000_000n);
  return ts > 1e12 ? ts / 1_000_000 : ts;
}

export default function TimeExpensesTab() {
  const t = useT();
  const [view, setView] = useState<"time" | "expenses">("time");

  return (
    <div className="flex flex-col h-full">
      <ActionBar
        title={t("tab.work.time")}
        actions={
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView("time")}
              className={`flex items-center gap-1 px-3 py-1.5 text-token-sm font-token-semibold transition-opacity-fast ${
                view === "time"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background text-foreground hover:bg-accent/5"
              }`}
              data-ocid="time_expenses.view.time"
            >
              <Clock className="icon-sm" />
              {t("common.hours")}
            </button>
            <button
              type="button"
              onClick={() => setView("expenses")}
              className={`flex items-center gap-1 px-3 py-1.5 text-token-sm font-token-semibold border-l border-border transition-opacity-fast ${
                view === "expenses"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background text-foreground hover:bg-accent/5"
              }`}
              data-ocid="time_expenses.view.expenses"
            >
              <DollarSign className="icon-sm" />
              {t("common.expenses")}
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto">
        {view === "time" ? <TimeView /> : <ExpensesView />}
      </div>
    </div>
  );
}

function TimeView() {
  const t = useT();
  const { data: timeEntries, isLoading } = useAllTimeEntries();
  const { data: engagements } = useEngagements();
  const { data: clients } = useClients();
  const [showAdd, setShowAdd] = useState(false);
  const [engagementFilter, setEngagementFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const mutation = useAddUpdateTimeEntry();
  const [lastEngId, setLastEngId] = useState(() => {
    try {
      const stored = localStorage.getItem("lastEngagementId");
      return stored ?? "";
    } catch {
      return "";
    }
  });
  const [engId, setEngId] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [optimisticRows, setOptimisticRows] = useState<
    {
      tempId: string;
      engId: string;
      desc: string;
      hours: string;
      date: string;
    }[]
  >([]);
  const [formError, setFormError] = useState("");

  const clientMap = Object.fromEntries(
    (clients ?? []).map((c) => [c.id, c.name]),
  );

  // Sort engagements: last-used first, then by name
  const sortedEngagements = [...(engagements ?? [])].sort((a, b) => {
    if (a.id === lastEngId) return -1;
    if (b.id === lastEngId) return 1;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });

  const filteredEngagements = sortedEngagements.filter((e) =>
    clientFilter ? e.clientId === clientFilter : true,
  );

  const filteredEntries = (timeEntries ?? []).filter((t) => {
    if (engagementFilter && t.engagementId !== engagementFilter) return false;
    if (clientFilter) {
      const eng = engagements?.find((e) => e.id === t.engagementId);
      if (!eng || eng.clientId !== clientFilter) return false;
    }
    return true;
  });

  // Group by week
  const grouped = new Map<string, TimeEntry[]>();
  for (const t of filteredEntries) {
    const ms = nanoToMs(t.date);
    if (!ms) continue;
    const key = weekKey(new Date(ms));
    const list = grouped.get(key) ?? [];
    list.push(t);
    grouped.set(key, list);
  }
  const weeks = Array.from(grouped.entries()).sort((a, b) => {
    const da = nanoToMs(a[1][0]?.date) ?? 0;
    const db = nanoToMs(b[1][0]?.date) ?? 0;
    return db - da;
  });

  function handleOpenForm() {
    setEngId(lastEngId);
    setFormError("");
    setShowAdd(true);
  }

  const handleAdd = async () => {
    if (!engId || !desc.trim() || !hours) return;
    setFormError("");
    const tempId = `optimistic-${Date.now()}`;
    setOptimisticRows((prev) => [
      ...prev,
      { tempId, engId, desc, hours, date },
    ]);
    setShowAdd(false);
    const savedEngId = engId;
    setLastEngId(savedEngId);
    try {
      localStorage.setItem("lastEngagementId", savedEngId);
    } catch {
      // ignore
    }
    setDesc("");
    setHours("");
    setEngId(savedEngId);
    try {
      await mutation.mutateAsync({
        id: crypto.randomUUID(),
        engagementId: savedEngId,
        description: desc.trim(),
        hours: BigInt(Math.round(Number.parseFloat(hours) * 100)),
        date: BigInt(new Date(date).getTime()) * 1_000_000n,
        createdAt: BigInt(Date.now()) * 1_000_000n,
        rateCardId: "",
        deliverableId: "",
        billable: false,
      });
      setOptimisticRows((prev) => prev.filter((r) => r.tempId !== tempId));
    } catch {
      setOptimisticRows((prev) => prev.filter((r) => r.tempId !== tempId));
      setFormError(t("timeExpenses.time.saveFailed"));
      setShowAdd(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-page py-3 border-b border-border">
        <Select
          value={clientFilter}
          onValueChange={(v) => {
            setClientFilter(v);
            setEngagementFilter("");
          }}
        >
          <SelectTrigger
            className="h-8 w-40 border-border text-foreground text-token-xs"
            data-ocid="time_expenses.client.select"
          >
            <SelectValue placeholder={t("common.allClients")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("common.allClients")}</SelectItem>
            {clients?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={engagementFilter}
          onValueChange={(v) => setEngagementFilter(v)}
        >
          <SelectTrigger
            className="h-8 w-48 border-border text-foreground text-token-xs"
            data-ocid="time_expenses.engagement.select"
          >
            <SelectValue placeholder={t("common.allEngagements")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("common.allEngagements")}</SelectItem>
            {filteredEngagements?.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button
            size="sm"
            type="button"
            onClick={handleOpenForm}
            data-ocid="time_expenses.time.add_button"
          >
            <Plus className="icon-sm mr-1" />
            {t("common.logTime")}
          </Button>
        </div>
      </div>
      {/* Inline add form */}
      {showAdd && (
        <div className="px-page py-3 border-b border-border bg-surface-elevated">
          {formError && (
            <p
              className="text-danger text-token-xs mb-2"
              data-ocid="time_expenses.time.error_state"
            >
              {formError}
            </p>
          )}
          <InlineForm
            isOpen
            onClose={() => {
              setShowAdd(false);
              setFormError("");
            }}
            title={t("common.logTime")}
            onSubmit={handleAdd}
            submitLabel={t("common.save")}
            loading={mutation.isPending}
          >
            <div className="grid grid-cols-4 gap-3">
              <FormField label={t("common.engagement")} required>
                <Select value={engId} onValueChange={(v) => setEngId(v)}>
                  <SelectTrigger
                    className="w-full h-9 border-border text-foreground text-token-sm"
                    data-ocid="time_expenses.time.engagement_select"
                  >
                    <SelectValue placeholder={t("common.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("common.select")}</SelectItem>
                    {filteredEngagements.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {clientMap[e.clientId]
                          ? `${clientMap[e.clientId]} — ${e.name}`
                          : e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label={t("common.date")} required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormField>
              <FormField label={t("common.hours")} required>
                <Input
                  type="number"
                  step="0.25"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0.00"
                  data-ocid="time_expenses.time.hours_input"
                />
              </FormField>
              <FormField label={t("common.description")} required>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={t("common.whatYouWorkedOn")}
                  data-ocid="time_expenses.time.desc_input"
                />
              </FormField>
            </div>
          </InlineForm>
        </div>
      )}
      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-page space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-row bg-muted/30 rounded" />
            ))}
          </div>
        ) : weeks.length === 0 && optimisticRows.length === 0 ? (
          <EmptyState
            icon={Clock}
            heading={t("timeExpenses.time.empty")}
            message={t("timeExpenses.time.emptyBody")}
            data-ocid="time_expenses.time.empty_state"
          />
        ) : (
          <div>
            {/* Optimistic rows */}
            {optimisticRows.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-page py-2 bg-muted/20 border-b border-border">
                  <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                    {t("timeExpenses.saving")}
                  </span>
                </div>
                <div className="border-b border-border/40">
                  {optimisticRows.map((row) => (
                    <div
                      key={row.tempId}
                      className="flex items-center gap-4 px-page py-2 opacity-50"
                      data-ocid="time_expenses.time.loading_state"
                    >
                      <span className="text-token-sm text-muted-foreground w-24">
                        {row.date}
                      </span>
                      <span className="text-token-sm text-muted-foreground flex-1">
                        {clientMap[
                          (engagements ?? []).find((e) => e.id === row.engId)
                            ?.clientId ?? ""
                        ] ?? ""}
                        {clientMap[
                          (engagements ?? []).find((e) => e.id === row.engId)
                            ?.clientId ?? ""
                        ]
                          ? " — "
                          : ""}
                        {(engagements ?? []).find((e) => e.id === row.engId)
                          ?.name ?? ""}
                      </span>
                      <span className="text-token-sm text-muted-foreground flex-1">
                        {row.desc}
                      </span>
                      <span className="text-token-sm tabular-nums text-muted-foreground w-16 text-right">
                        {row.hours}h
                      </span>
                      <div className="w-3 h-3 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {weeks.map(([week, entries]) => {
              const totalHrs =
                entries.reduce(
                  (s, t) =>
                    s +
                    (typeof t.hours === "bigint"
                      ? Number(t.hours)
                      : (t.hours ?? 0)),
                  0,
                ) / 100;
              return (
                <div key={week}>
                  <div className="flex items-center gap-2 px-page py-2 bg-muted/20 border-b border-border">
                    <span className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                      {week}
                    </span>
                    <span className="text-token-xs tabular-nums text-foreground ml-auto">
                      {formatHours(totalHrs)}
                    </span>
                  </div>
                  <DataTable
                    columns={[
                      {
                        key: "date",
                        header: t("common.date"),
                        width: "100px",
                        render: (t: TimeEntry) => (
                          <span className="text-token-sm text-foreground">
                            {formatDate(t.date)}
                          </span>
                        ),
                      },
                      {
                        key: "engagement",
                        header: t("common.engagement"),
                        render: (t: TimeEntry) => {
                          const eng = engagements?.find(
                            (e) => e.id === t.engagementId,
                          );
                          const client = eng ? clientMap[eng.clientId] : "";
                          return (
                            <span className="text-token-sm text-foreground">
                              {client
                                ? `${client} — ${eng?.name ?? ""}`
                                : (eng?.name ?? "")}
                            </span>
                          );
                        },
                      },
                      {
                        key: "desc",
                        header: t("common.description"),
                        render: (t: TimeEntry) => (
                          <span className="text-token-sm text-foreground">
                            {t.description}
                          </span>
                        ),
                      },
                      {
                        key: "hours",
                        header: t("common.hrs"),
                        align: "right" as const,
                        width: "60px",
                        render: (t: TimeEntry) => (
                          <span className="text-token-sm tabular-nums text-foreground">
                            {formatHours(
                              typeof t.hours === "bigint"
                                ? Number(t.hours) / 100
                                : t.hours,
                            )}
                          </span>
                        ),
                      },
                    ]}
                    data={entries}
                    emptyMessage={t("timeExpenses.noEntries")}
                    rowKey={(t) => t.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpensesView() {
  const t = useT();
  const { data: expenses, isLoading } = useAllExpenses();
  const { data: engagements } = useEngagements();
  const { data: clients } = useClients();
  const [showAdd, setShowAdd] = useState(false);
  const [engagementFilter, setEngagementFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const mutation = useAddUpdateExpense();
  const [lastEngId, setLastEngId] = useState("");
  const [engId, setEngId] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [optimisticRows, setOptimisticRows] = useState<
    {
      tempId: string;
      engId: string;
      desc: string;
      amount: string;
      date: string;
    }[]
  >([]);
  const [formError, setFormError] = useState("");

  const clientMap = Object.fromEntries(
    (clients ?? []).map((c) => [c.id, c.name]),
  );

  // Sort engagements: last-used first, then by name
  const sortedEngagements = [...(engagements ?? [])].sort((a, b) => {
    if (a.id === lastEngId) return -1;
    if (b.id === lastEngId) return 1;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });

  const filteredEngagements = sortedEngagements.filter((e) =>
    clientFilter ? e.clientId === clientFilter : true,
  );

  const filteredExpenses = (expenses ?? []).filter((e) => {
    if (engagementFilter && e.engagementId !== engagementFilter) return false;
    if (clientFilter) {
      const eng = engagements?.find((en) => en.id === e.engagementId);
      if (!eng || eng.clientId !== clientFilter) return false;
    }
    return true;
  });

  function handleOpenForm() {
    setEngId(lastEngId);
    setFormError("");
    setShowAdd(true);
  }

  const handleAdd = async () => {
    if (!engId || !desc.trim() || !amount) return;
    setFormError("");
    const tempId = `optimistic-${Date.now()}`;
    setOptimisticRows((prev) => [
      ...prev,
      { tempId, engId, desc, amount, date },
    ]);
    setShowAdd(false);
    const savedEngId = engId;
    setLastEngId(savedEngId);
    setDesc("");
    setAmount("");
    setEngId(lastEngId);
    try {
      await mutation.mutateAsync({
        id: crypto.randomUUID(),
        engagementId: savedEngId,
        description: desc.trim(),
        amount: BigInt(Math.round(Number.parseFloat(amount) * 100)),
        date: BigInt(new Date(date).getTime()) * 1_000_000n,
        createdAt: BigInt(Date.now()) * 1_000_000n,
        billable: false,
        category: "Other",
      });
      setOptimisticRows((prev) => prev.filter((r) => r.tempId !== tempId));
    } catch {
      setOptimisticRows((prev) => prev.filter((r) => r.tempId !== tempId));
      setFormError(t("timeExpenses.expense.saveFailed"));
      setShowAdd(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-page py-3 border-b border-border">
        <Select
          value={clientFilter}
          onValueChange={(v) => {
            setClientFilter(v);
            setEngagementFilter("");
          }}
        >
          <SelectTrigger
            className="h-8 w-40 border-border text-foreground text-token-xs"
            data-ocid="time_expenses.expense.client_select"
          >
            <SelectValue placeholder={t("common.allClients")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("common.allClients")}</SelectItem>
            {clients?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={engagementFilter}
          onValueChange={(v) => setEngagementFilter(v)}
        >
          <SelectTrigger
            className="h-8 w-48 border-border text-foreground text-token-xs"
            data-ocid="time_expenses.expense.engagement_select"
          >
            <SelectValue placeholder={t("common.allEngagements")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("common.allEngagements")}</SelectItem>
            {filteredEngagements?.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button
            size="sm"
            type="button"
            onClick={handleOpenForm}
            data-ocid="time_expenses.expense.add_button"
          >
            <Plus className="icon-sm mr-1" />
            {t("common.addExpense")}
          </Button>
        </div>
      </div>
      {/* Inline add form */}
      {showAdd && (
        <div className="px-page py-3 border-b border-border bg-surface-elevated">
          {formError && (
            <p
              className="text-danger text-token-xs mb-2"
              data-ocid="time_expenses.expense.error_state"
            >
              {formError}
            </p>
          )}
          <InlineForm
            isOpen
            onClose={() => {
              setShowAdd(false);
              setFormError("");
            }}
            title={t("common.addExpense")}
            onSubmit={handleAdd}
            submitLabel={t("common.add")}
            loading={mutation.isPending}
          >
            <div className="grid grid-cols-4 gap-3">
              <FormField label={t("common.engagement")} required>
                <Select value={engId} onValueChange={(v) => setEngId(v)}>
                  <SelectTrigger
                    className="w-full h-9 border-border text-foreground text-token-sm"
                    data-ocid="time_expenses.expense.engagement_select"
                  >
                    <SelectValue placeholder={t("common.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("common.select")}</SelectItem>
                    {filteredEngagements.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {clientMap[e.clientId]
                          ? `${clientMap[e.clientId]} — ${e.name}`
                          : e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label={t("common.date")} required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormField>
              <FormField label={t("common.amount")} required>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  data-ocid="time_expenses.expense.amount_input"
                />
              </FormField>
              <FormField label={t("common.description")} required>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={t("common.travelMaterials")}
                  data-ocid="time_expenses.expense.desc_input"
                />
              </FormField>
            </div>
          </InlineForm>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-page space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-row bg-muted/30 rounded" />
            ))}
          </div>
        ) : filteredExpenses.length === 0 && optimisticRows.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            heading={t("timeExpenses.expense.empty")}
            message={t("timeExpenses.expense.emptyBody")}
            data-ocid="time_expenses.expense.empty_state"
          />
        ) : (
          <div>
            {/* Optimistic rows */}
            {optimisticRows.map((row) => (
              <div
                key={row.tempId}
                className="flex items-center gap-4 px-page py-2 border-b border-border/40 opacity-50"
                data-ocid="time_expenses.expense.loading_state"
              >
                <span className="text-token-sm text-muted-foreground w-24">
                  {row.date}
                </span>
                <span className="text-token-sm text-muted-foreground flex-1">
                  {clientMap[
                    (engagements ?? []).find((e) => e.id === row.engId)
                      ?.clientId ?? ""
                  ] ?? ""}
                  {clientMap[
                    (engagements ?? []).find((e) => e.id === row.engId)
                      ?.clientId ?? ""
                  ]
                    ? " — "
                    : ""}
                  {(engagements ?? []).find((e) => e.id === row.engId)?.name ??
                    ""}
                </span>
                <span className="text-token-sm text-muted-foreground flex-1">
                  {row.desc}
                </span>
                <span className="text-token-sm tabular-nums text-muted-foreground w-24 text-right">
                  {formatCurrency(Number.parseFloat(row.amount) || 0)}
                </span>
                <div className="w-3 h-3 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
              </div>
            ))}
            <DataTable
              columns={[
                {
                  key: "date",
                  header: t("common.date"),
                  width: "100px",
                  render: (e: Expense) => (
                    <span className="text-token-sm text-foreground">
                      {formatDate(e.date)}
                    </span>
                  ),
                },
                {
                  key: "engagement",
                  header: t("common.engagement"),
                  render: (e: Expense) => {
                    const eng = engagements?.find(
                      (en) => en.id === e.engagementId,
                    );
                    const client = eng ? clientMap[eng.clientId] : "";
                    return (
                      <span className="text-token-sm text-foreground">
                        {client
                          ? `${client} — ${eng?.name ?? ""}`
                          : (eng?.name ?? "")}
                      </span>
                    );
                  },
                },
                {
                  key: "desc",
                  header: t("common.description"),
                  render: (e: Expense) => (
                    <span className="text-token-sm text-foreground">
                      {e.description}
                    </span>
                  ),
                },
                {
                  key: "amount",
                  header: t("common.amount"),
                  align: "right" as const,
                  width: "90px",
                  render: (e: Expense) => (
                    <span className="text-token-sm tabular-nums text-foreground">
                      {formatCurrency(
                        typeof e.amount === "bigint"
                          ? Number(e.amount) / 100
                          : e.amount,
                      )}
                    </span>
                  ),
                },
              ]}
              data={filteredExpenses}
              emptyMessage={t("timeExpenses.noExpenses")}
              rowKey={(e) => e.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
