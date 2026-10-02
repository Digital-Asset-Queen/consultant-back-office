import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormField } from "@/components/shared/FormField";
import { HealthDot } from "@/components/shared/HealthDot";
import { InlineForm } from "@/components/shared/InlineForm";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TwoPanel } from "@/components/shared/TwoPanel";
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
  useAddUpdateEngagement,
  useAddUpdateExpense,
  useAddUpdateTimeEntry,
  useClients,
  useEngagements,
  useExpenses,
  useTimeEntries,
} from "@/hooks/useQueries";
import { formatCurrency, formatDate, formatHours } from "@/lib/formatting";
import type { Client, Engagement, Expense, TimeEntry } from "@/types";
import { Briefcase, Plus, Search } from "lucide-react";
import { useState } from "react";

function nanoToMs(ts: bigint | number | undefined): number | undefined {
  if (ts === undefined) return undefined;
  if (typeof ts === "bigint") return Number(ts / 1_000_000n);
  return ts > 1e12 ? ts / 1_000_000 : ts;
}

function engagementHealth(
  e: Engagement,
): "active" | "caution" | "at-risk" | "inactive" {
  if (e.status === "closed" || e.status === "on-hold") return "inactive";
  const end = nanoToMs(e.endDate);
  if (end && Date.now() > end) return "at-risk";
  const start = nanoToMs(e.startDate);
  if (start && Date.now() - start > 1000 * 60 * 60 * 24 * 60) return "caution";
  return "active";
}

export default function EngagementsTab() {
  const { data: engagements, isLoading } = useEngagements();
  const { data: clients } = useClients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"active" | "all">("active");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered =
    engagements?.filter((e) => {
      if (filter === "active" && e.status !== "active") return false;
      const q = search.toLowerCase();
      const client = clients?.find((c) => c.id === e.clientId);
      return (
        e.name.toLowerCase().includes(q) ||
        (client?.name ?? "").toLowerCase().includes(q)
      );
    }) ?? [];

  const selected = engagements?.find((e) => e.id === selectedId) ?? null;

  return (
    <TwoPanel
      list={
        <div className="flex flex-col h-full">
          <ActionBar
            title="Engagements"
            actions={
              <Button
                size="sm"
                onClick={() => setShowAdd(true)}
                data-ocid="engagements.add_button"
              >
                <Plus className="icon-sm mr-1" />
                New
              </Button>
            }
            search={
              <div className="relative">
                <Search className="icon-sm absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 h-8 w-40 text-token-sm"
                  data-ocid="engagements.search_input"
                />
              </div>
            }
          />
          {/* Filter strip */}
          <div className="flex border-b border-border px-page">
            {(["active", "all"] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-3 py-2 text-token-sm font-token-semibold transition-opacity-fast ${
                  filter === f
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`engagements.filter.${f}`}
              >
                {f === "active" ? "Active" : "All"}
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full transition-opacity-fast"
                  style={{ opacity: filter === f ? 1 : 0 }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          {/* Inline add form */}
          {showAdd && (
            <div className="px-page py-3 border-b border-border bg-surface-elevated">
              <AddEngagementForm
                clients={clients ?? []}
                onClose={() => setShowAdd(false)}
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-page space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-row bg-muted/30 rounded" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                heading="No engagements"
                message="Create your first engagement to get started."
                data-ocid="engagements.empty_state"
              />
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((e, i) => {
                  const clientName =
                    clients?.find((c) => c.id === e.clientId)?.name ?? "";
                  return (
                    <button
                      type="button"
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={`w-full text-left px-page py-3 flex items-center gap-3 transition-opacity-fast ${
                        selectedId === e.id
                          ? "bg-accent/10 border-l-2 border-l-accent"
                          : "hover:bg-accent/5"
                      }`}
                      data-ocid={`engagements.item.${i + 1}`}
                    >
                      <HealthDot status={engagementHealth(e)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-token-sm font-token-semibold text-foreground truncate">
                          {e.name}
                        </p>
                        <p className="text-token-xs text-muted-foreground truncate">
                          {clientName}
                        </p>
                      </div>
                      <StatusBadge status={e.status} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      }
      detail={
        selected ? (
          <EngagementDetail engagement={selected} clients={clients ?? []} />
        ) : (
          <EmptyState
            icon={Briefcase}
            heading="Select an engagement"
            message="Choose an engagement to view details."
          />
        )
      }
    />
  );
}

function AddEngagementForm({
  clients,
  onClose,
}: { clients: Client[]; onClose: () => void }) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useAddUpdateEngagement();

  const handleSubmit = async () => {
    if (!name.trim() || !clientId) return;
    await mutation.mutateAsync({
      id: crypto.randomUUID(),
      name: name.trim(),
      clientId,
      description: description.trim() || undefined,
      status: "active",
      contactId: "",
      profileId: "",
      startDate: BigInt(Date.now()) * 1_000_000n,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      <p className="text-token-sm font-token-semibold text-foreground">
        New Engagement
      </p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Q4 Strategy Project"
            data-ocid="engagements.name_input"
          />
        </FormField>
        <FormField label="Client" required>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select client…" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={String(c.id)} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField label="Description">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief scope description…"
        />
      </FormField>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || !name.trim() || !clientId}
          data-ocid="engagements.submit_button"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function EngagementDetail({
  engagement,
  clients,
}: { engagement: Engagement; clients: Client[] }) {
  const { data: timeEntries } = useTimeEntries(engagement.id);
  const { data: expenses } = useExpenses(engagement.id);
  const [activeTab, setActiveTab] = useState<"overview" | "time" | "expenses">(
    "overview",
  );

  const detailTabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "time" as const, label: `Time (${timeEntries?.length ?? 0})` },
    { key: "expenses" as const, label: `Expenses (${expenses?.length ?? 0})` },
  ];

  const clientName =
    clients.find((c) => c.id === engagement.clientId)?.name ?? "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-page py-4 border-b border-border">
        <h2 className="text-token-lg font-token-semibold text-foreground">
          {engagement.name}
        </h2>
        <p className="text-token-sm text-muted-foreground mt-0.5">
          {clientName}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge status={engagement.status} />
          <HealthDot status={engagementHealth(engagement)} />
        </div>
      </div>
      {/* Sub-tabs */}
      <div className="flex border-b border-border">
        {detailTabs.map((t) => (
          <button
            type="button"
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative px-4 py-2 text-token-sm font-token-semibold transition-opacity-fast ${
              activeTab === t.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`engagements.detail.${t.key}.tab`}
          >
            {t.label}
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full transition-opacity-fast"
              style={{ opacity: activeTab === t.key ? 1 : 0 }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-page">
        {activeTab === "overview" && (
          <EngagementOverview
            engagement={engagement}
            timeEntries={timeEntries ?? []}
            expenses={expenses ?? []}
          />
        )}
        {activeTab === "time" && (
          <EngagementTime
            engagementId={engagement.id}
            timeEntries={timeEntries ?? []}
          />
        )}
        {activeTab === "expenses" && (
          <EngagementExpenses
            engagementId={engagement.id}
            expenses={expenses ?? []}
          />
        )}
      </div>
    </div>
  );
}

function EngagementOverview({
  engagement,
  timeEntries,
  expenses,
}: { engagement: Engagement; timeEntries: TimeEntry[]; expenses: Expense[] }) {
  const totalHours =
    timeEntries.reduce(
      (s, t) =>
        s + (typeof t.hours === "bigint" ? Number(t.hours) : (t.hours ?? 0)),
      0,
    ) / 100;
  const totalExpenses =
    expenses.reduce(
      (s, e) =>
        s + (typeof e.amount === "bigint" ? Number(e.amount) : (e.amount ?? 0)),
      0,
    ) / 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-elevated border border-border rounded-lg p-3">
          <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
            Total Hours
          </span>
          <p className="text-token-xl font-token-semibold tabular-nums text-foreground mt-0.5">
            {formatHours(totalHours)}
          </p>
        </div>
        <div className="bg-surface-elevated border border-border rounded-lg p-3">
          <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
            Total Expenses
          </span>
          <p className="text-token-xl font-token-semibold tabular-nums text-foreground mt-0.5">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>
      <SectionHeader title="Details" />
      <div className="divide-y divide-border">
        <DetailRow label="Started" value={formatDate(engagement.startDate)} />
        {engagement.endDate && (
          <DetailRow label="End Date" value={formatDate(engagement.endDate)} />
        )}
        <DetailRow
          label="Status"
          value={<StatusBadge status={engagement.status} />}
        />
        {engagement.description && (
          <DetailRow label="Description" value={engagement.description} />
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 gap-4">
      <span className="text-token-xs uppercase tracking-wider text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-token-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function EngagementTime({
  engagementId,
  timeEntries,
}: { engagementId: string; timeEntries: TimeEntry[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const mutation = useAddUpdateTimeEntry();
  const [editingId, setEditingId] = useState<string | null>(null);
  // Add-form state
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // Inline-edit state
  const [editDate, setEditDate] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editDesc, setEditDesc] = useState("");

  function startEdit(t: TimeEntry) {
    const ms =
      typeof t.date === "bigint" ? Number(t.date / 1_000_000n) : t.date;
    const d = new Date(ms);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setEditDate(iso);
    setEditHours(
      String(
        (typeof t.hours === "bigint" ? Number(t.hours) : (t.hours ?? 0)) / 100,
      ),
    );
    setEditDesc(t.description);
    setEditingId(t.id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(t: TimeEntry) {
    if (!editDesc.trim() || !editHours) return;
    await mutation.mutateAsync({
      ...t,
      description: editDesc.trim(),
      hours: BigInt(Math.round(Number.parseFloat(editHours) * 100)),
      date: BigInt(new Date(editDate).getTime()) * 1_000_000n,
    });
    setEditingId(null);
  }

  const handleAdd = async () => {
    if (!desc.trim() || !hours) return;
    await mutation.mutateAsync({
      id: crypto.randomUUID(),
      engagementId,
      description: desc.trim(),
      hours: BigInt(Math.round(Number.parseFloat(hours) * 100)),
      date: BigInt(new Date(date).getTime()) * 1_000_000n,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      rateCardId: "",
      deliverableId: "",
      billable: false,
    });
    setShowAdd(false);
    setDesc("");
    setHours("");
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          data-ocid="engagements.time.add_button"
        >
          <Plus className="icon-sm mr-1" />
          Log Time
        </Button>
      </div>
      <InlineForm
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Log Time"
        onSubmit={handleAdd}
        submitLabel="Log"
        loading={mutation.isPending}
      >
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Date" required>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField label="Hours" required>
            <Input
              type="number"
              step="0.25"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0.00"
              data-ocid="engagements.time.hours_input"
            />
          </FormField>
          <FormField label="Description" required>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What you worked on"
              data-ocid="engagements.time.desc_input"
            />
          </FormField>
        </div>
      </InlineForm>
      {timeEntries.length === 0 ? (
        <EmptyState
          heading="No time entries"
          message="Log your first time entry above."
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-table-header w-28">
                  Date
                </th>
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-table-header">
                  Description
                </th>
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-right px-row py-table-header w-20">
                  Hours
                </th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((t, i) => {
                const isEditing = editingId === t.id;
                return (
                  <tr
                    key={t.id}
                    className={`border-b border-border/40 transition-opacity-fast ${
                      isEditing
                        ? "bg-accent/10"
                        : "hover:bg-accent/5 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isEditing) {
                        if (editingId !== null) cancelEdit();
                        startEdit(t);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") cancelEdit();
                      if (!isEditing && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        if (editingId !== null) cancelEdit();
                        startEdit(t);
                      }
                    }}
                    tabIndex={isEditing ? undefined : 0}
                    data-ocid={`engagements.time.item.${i + 1}`}
                  >
                    {isEditing ? (
                      <>
                        <td className="px-row py-row">
                          <Input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="h-7 text-token-sm"
                            onClick={(e) => e.stopPropagation()}
                            data-ocid={`engagements.time.edit.date.${i + 1}`}
                          />
                        </td>
                        <td className="px-row py-row">
                          <Input
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="h-7 text-token-sm"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            data-ocid={`engagements.time.edit.desc.${i + 1}`}
                          />
                        </td>
                        <td className="px-row py-row text-right">
                          <Input
                            type="number"
                            step="0.25"
                            min="0"
                            value={editHours}
                            onChange={(e) => setEditHours(e.target.value)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="h-7 text-token-sm text-right w-16"
                            onClick={(e) => e.stopPropagation()}
                            data-ocid={`engagements.time.edit.hours.${i + 1}`}
                          />
                        </td>
                        <td
                          className="px-row py-row text-right"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              type="button"
                              variant="ghost"
                              className="h-6 px-2 text-token-xs"
                              onClick={cancelEdit}
                              data-ocid={`engagements.time.edit.cancel_button.${i + 1}`}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              className="h-6 px-2 text-token-xs"
                              onClick={() => saveEdit(t)}
                              disabled={mutation.isPending}
                              data-ocid={`engagements.time.edit.save_button.${i + 1}`}
                            >
                              {mutation.isPending ? "Saving…" : "Save"}
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="text-token-sm text-foreground px-row py-row">
                          {formatDate(t.date)}
                        </td>
                        <td className="text-token-sm text-foreground px-row py-row">
                          {t.description}
                        </td>
                        <td className="text-token-sm tabular-nums text-foreground text-right px-row py-row">
                          {formatHours(
                            typeof t.hours === "bigint"
                              ? Number(t.hours) / 100
                              : t.hours,
                          )}
                        </td>
                        <td />
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const EXPENSE_CATEGORIES = [
  "Travel",
  "Accommodation",
  "Meals",
  "Software",
  "Equipment",
  "Printing",
  "Subscriptions",
  "Other",
];

function EngagementExpenses({
  engagementId,
  expenses,
}: { engagementId: string; expenses: Expense[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const mutation = useAddUpdateExpense();
  const [editingId, setEditingId] = useState<string | null>(null);
  // Add-form state
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // Inline-edit state
  const [editDate, setEditDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");

  function startEdit(e: Expense) {
    const ms =
      typeof e.date === "bigint" ? Number(e.date / 1_000_000n) : e.date;
    const d = new Date(ms);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setEditDate(iso);
    setEditAmount(
      String(
        (typeof e.amount === "bigint" ? Number(e.amount) : (e.amount ?? 0)) /
          100,
      ),
    );
    setEditDesc(e.description);
    setEditCategory(e.category ?? "Other");
    setEditingId(e.id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(e: Expense) {
    if (!editDesc.trim() || !editAmount) return;
    await mutation.mutateAsync({
      ...e,
      description: editDesc.trim(),
      amount: BigInt(Math.round(Number.parseFloat(editAmount) * 100)),
      date: BigInt(new Date(editDate).getTime()) * 1_000_000n,
      category: editCategory || "Other",
    });
    setEditingId(null);
  }

  const handleAdd = async () => {
    if (!desc.trim() || !amount) return;
    await mutation.mutateAsync({
      id: crypto.randomUUID(),
      engagementId,
      description: desc.trim(),
      amount: BigInt(Math.round(Number.parseFloat(amount) * 100)),
      date: BigInt(new Date(date).getTime()) * 1_000_000n,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      billable: false,
      category: "Other",
    });
    setShowAdd(false);
    setDesc("");
    setAmount("");
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          data-ocid="engagements.expense.add_button"
        >
          <Plus className="icon-sm mr-1" />
          Add Expense
        </Button>
      </div>
      <InlineForm
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Expense"
        onSubmit={handleAdd}
        submitLabel="Add"
        loading={mutation.isPending}
      >
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Date" required>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField label="Amount" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              data-ocid="engagements.expense.amount_input"
            />
          </FormField>
          <FormField label="Description" required>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Travel, materials…"
              data-ocid="engagements.expense.desc_input"
            />
          </FormField>
        </div>
      </InlineForm>
      {expenses.length === 0 ? (
        <EmptyState
          heading="No expenses"
          message="Add your first expense above."
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-table-header w-28">
                  Date
                </th>
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-table-header">
                  Description
                </th>
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-left px-row py-table-header w-28">
                  Category
                </th>
                <th className="text-token-xs uppercase tracking-wider text-muted-foreground text-right px-row py-table-header w-24">
                  Amount
                </th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => {
                const isEditing = editingId === e.id;
                return (
                  <tr
                    key={e.id}
                    className={`border-b border-border/40 transition-opacity-fast ${
                      isEditing
                        ? "bg-accent/10"
                        : "hover:bg-accent/5 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isEditing) {
                        if (editingId !== null) cancelEdit();
                        startEdit(e);
                      }
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === "Escape") cancelEdit();
                      if (
                        !isEditing &&
                        (ev.key === "Enter" || ev.key === " ")
                      ) {
                        ev.preventDefault();
                        if (editingId !== null) cancelEdit();
                        startEdit(e);
                      }
                    }}
                    tabIndex={isEditing ? undefined : 0}
                    data-ocid={`engagements.expense.item.${i + 1}`}
                  >
                    {isEditing ? (
                      <>
                        <td className="px-row py-row">
                          <Input
                            type="date"
                            value={editDate}
                            onChange={(ev) => setEditDate(ev.target.value)}
                            className="h-7 text-token-sm"
                            onClick={(ev) => ev.stopPropagation()}
                            data-ocid={`engagements.expense.edit.date.${i + 1}`}
                          />
                        </td>
                        <td className="px-row py-row">
                          <Input
                            value={editDesc}
                            onChange={(ev) => setEditDesc(ev.target.value)}
                            onKeyDown={(ev) => {
                              ev.stopPropagation();
                              if (ev.key === "Escape") cancelEdit();
                            }}
                            className="h-7 text-token-sm"
                            onClick={(ev) => ev.stopPropagation()}
                            autoFocus
                            data-ocid={`engagements.expense.edit.desc.${i + 1}`}
                          />
                        </td>
                        <td className="px-row py-row">
                          <div
                            onClick={(ev) => ev.stopPropagation()}
                            onKeyDown={(ev) => {
                              ev.stopPropagation();
                              if (ev.key === "Escape") cancelEdit();
                            }}
                            data-ocid={`engagements.expense.edit.category.${i + 1}`}
                          >
                            <Select
                              value={editCategory}
                              onValueChange={setEditCategory}
                            >
                              <SelectTrigger className="h-7 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EXPENSE_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-row py-row text-right">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editAmount}
                            onChange={(ev) => setEditAmount(ev.target.value)}
                            onKeyDown={(ev) => {
                              ev.stopPropagation();
                              if (ev.key === "Escape") cancelEdit();
                            }}
                            className="h-7 text-token-sm text-right w-20"
                            onClick={(ev) => ev.stopPropagation()}
                            data-ocid={`engagements.expense.edit.amount.${i + 1}`}
                          />
                        </td>
                        <td
                          className="px-row py-row text-right"
                          onClick={(ev) => ev.stopPropagation()}
                          onKeyDown={(ev) => ev.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              type="button"
                              variant="ghost"
                              className="h-6 px-2 text-token-xs"
                              onClick={cancelEdit}
                              data-ocid={`engagements.expense.edit.cancel_button.${i + 1}`}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              className="h-6 px-2 text-token-xs"
                              onClick={() => saveEdit(e)}
                              disabled={mutation.isPending}
                              data-ocid={`engagements.expense.edit.save_button.${i + 1}`}
                            >
                              {mutation.isPending ? "Saving…" : "Save"}
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="text-token-sm text-foreground px-row py-row">
                          {formatDate(e.date)}
                        </td>
                        <td className="text-token-sm text-foreground px-row py-row">
                          {e.description}
                        </td>
                        <td className="text-token-sm text-muted-foreground px-row py-row">
                          {e.category ?? "Other"}
                        </td>
                        <td className="text-token-sm tabular-nums text-foreground text-right px-row py-row">
                          {formatCurrency(
                            typeof e.amount === "bigint"
                              ? Number(e.amount) / 100
                              : e.amount,
                          )}
                        </td>
                        <td />
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
