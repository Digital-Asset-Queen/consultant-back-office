import { ActionBar } from "@/components/shared/ActionBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { InlineForm } from "@/components/shared/InlineForm";
import { StatsBar } from "@/components/shared/StatsBar";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useAddUpdateInvoice,
  useClients,
  useEngagements,
  useInvoices,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency } from "@/lib/formatting";
import type { Invoice } from "@/types";
import { FileText, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { InvoiceDetail } from "./InvoiceDetail";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getAgeDays(dueDate: bigint): number {
  const ms = Number(dueDate);
  const d = ms > 1e15 ? ms / 1_000_000 : ms;
  return Math.floor((Date.now() - d) / 86_400_000);
}

function invoiceStatusVariant(status: string) {
  if (status === "paid") return "success" as const;
  if (status === "overdue") return "danger" as const;
  if (status === "sent") return "info" as const;
  return "neutral" as const;
}

export function InvoicingTab() {
  const t = useT();
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const { data: engagements = [] } = useEngagements();
  const addUpdateInvoice = useAddUpdateInvoice();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewForm, setShowNewForm] = useState(false);

  // New invoice form state
  const [newClientId, setNewClientId] = useState("");
  const [newEngagementId, setNewEngagementId] = useState("");
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  const [newIssueDate, setNewIssueDate] = useState(todayStr());
  const [newDueDate, setNewDueDate] = useState(addDays(todayStr(), 30));
  const [newStatus, setNewStatus] = useState("draft");
  const [newNotes, setNewNotes] = useState("");
  const [newLineItems, setNewLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const statusOptions = [
    { value: "all", label: t("invoiceStatus.all") },
    { value: "draft", label: t("invoiceStatus.draft") },
    { value: "sent", label: t("invoiceStatus.sent") },
    { value: "paid", label: t("invoiceStatus.paid") },
    { value: "overdue", label: t("invoiceStatus.overdue") },
    { value: "cancelled", label: t("invoiceStatus.cancelled") },
  ];

  const invoiceStatusOptions = [
    { value: "draft", label: t("invoiceStatus.draft") },
    { value: "sent", label: t("invoiceStatus.sent") },
    { value: "paid", label: t("invoiceStatus.paid") },
    { value: "overdue", label: t("invoiceStatus.overdue") },
  ];

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const filteredEngagements = newClientId
    ? engagements.filter((e) => e.clientId === newClientId)
    : engagements;

  const nextInvoiceNumber = `INV-${String(invoices.length + 1).padStart(4, "0")}`;

  function openNewForm() {
    setNewInvoiceNumber(nextInvoiceNumber);
    setNewIssueDate(todayStr());
    setNewDueDate(addDays(todayStr(), 30));
    setNewClientId("");
    setNewEngagementId("");
    setNewStatus("draft");
    setNewNotes("");
    setNewLineItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setShowNewForm(true);
  }

  function closeNewForm() {
    setShowNewForm(false);
  }

  function updateLineItem(
    idx: number,
    field: keyof LineItem,
    value: string | number,
  ) {
    setNewLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  }

  function addLineItem() {
    setNewLineItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeLineItem(idx: number) {
    setNewLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const lineItemTotal = newLineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  async function handleSaveInvoice() {
    if (!newClientId || !newInvoiceNumber) return;
    const issueDateMs = new Date(newIssueDate).getTime();
    const dueDateMs = new Date(newDueDate).getTime();
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      clientId: newClientId,
      engagementId: newEngagementId || undefined,
      invoiceNumber: newInvoiceNumber,
      issueDate: BigInt(issueDateMs),
      dueDate: BigInt(dueDateMs),
      status: newStatus,
      subtotalAmount: lineItemTotal,
      taxes: 0,
      totalAmount: lineItemTotal,
      paymentTerms: "Net 30",
      paymentMethod: "",
      contractId: "",
      notes: newNotes || undefined,
      lineItems: newLineItems.filter((li) => li.description.trim()),
    };
    await addUpdateInvoice.mutateAsync(invoice);
    closeNewForm();
    setSelectedId(invoice.id);
  }

  const overdue = invoices.filter(
    (inv) =>
      inv.status !== "paid" &&
      inv.status !== "cancelled" &&
      getAgeDays(inv.dueDate) > 0,
  );

  const totalInvoiced = invoices.reduce(
    (s, inv) => s + (inv.totalAmount ?? 0),
    0,
  );
  const totalCollected = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((s, inv) => s + (inv.totalAmount ?? 0), 0);
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((s, inv) => s + (inv.totalAmount ?? 0), 0);
  const totalOverdue = overdue.reduce(
    (s, inv) => s + (inv.totalAmount ?? 0),
    0,
  );

  const stats = [
    {
      label: t("common.totalInvoiced"),
      value: formatCurrency(totalInvoiced),
    },
    {
      label: t("common.collected"),
      value: formatCurrency(totalCollected),
      status: "success" as const,
    },
    {
      label: t("common.outstanding"),
      value: formatCurrency(totalOutstanding),
      status: "warning" as const,
    },
    {
      label: t("common.overdueAmount"),
      value: formatCurrency(totalOverdue),
      status: overdue.length > 0 ? ("danger" as const) : undefined,
    },
  ];

  const filtered =
    statusFilter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  const selected = invoices.find((inv) => inv.id === selectedId) ?? null;

  const listPanel = (
    <div className="flex flex-col h-full">
      <div className="p-page border-b border-border">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="h-7 w-full"
            data-ocid="invoicing.status_filter.select"
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            heading={t("invoicing.empty")}
            message={t("invoicing.emptyBody")}
            data-ocid="invoicing.empty_state"
          />
        ) : (
          <div>
            {filtered.map((inv, idx) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => setSelectedId(inv.id)}
                className={`w-full text-left px-page py-3 border-b border-border/40 transition-opacity-fast ${
                  selectedId === inv.id
                    ? "bg-accent/10 border-l-2 border-l-accent"
                    : "hover:bg-accent/5"
                }`}
                data-ocid={`invoicing.invoice.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-token-sm font-token-semibold text-foreground truncate">
                    {inv.invoiceNumber}
                  </span>
                  <StatusBadge
                    variant={invoiceStatusVariant(inv.status)}
                    label={t(`invoiceStatus.${inv.status}`)}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-token-xs text-muted-foreground truncate">
                    {clientMap[inv.clientId] ?? "—"}
                  </span>
                  <span className="text-token-xs tabular-nums font-token-semibold text-foreground">
                    {formatCurrency(inv.totalAmount ?? 0)}
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
    <InvoiceDetail
      invoice={selected}
      clientName={clientMap[selected.clientId]}
    />
  ) : (
    <EmptyState
      heading={t("invoicing.selectInvoice")}
      message={t("invoicing.selectInvoiceBody")}
      data-ocid="invoicing.detail.empty_state"
    />
  );

  return (
    <div className="flex flex-col h-full">
      <StatsBar stats={stats} />
      <ActionBar
        title={t("invoicing.actionBarTitle")}
        icon={<FileText className="w-4 h-4" />}
        right={
          <Button
            type="button"
            size="sm"
            onClick={openNewForm}
            data-ocid="invoicing.new_invoice.button"
          >
            <Plus className="icon-sm mr-1" />
            {t("common.newInvoice")}
          </Button>
        }
      />

      {/* Inline new invoice form */}
      {showNewForm && (
        <div className="p-page border-b border-border bg-surface-elevated">
          <InlineForm
            isOpen={showNewForm}
            onClose={closeNewForm}
            title={t("common.newInvoice")}
            onSubmit={handleSaveInvoice}
            submitLabel={t("common.saveInvoice")}
            loading={addUpdateInvoice.isPending}
          >
            {/* Row 1: client + engagement */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("invoicing.clientRequired")}
                </p>
                <Select
                  value={newClientId}
                  onValueChange={(v) => {
                    setNewClientId(v);
                    setNewEngagementId("");
                  }}
                >
                  <SelectTrigger data-ocid="invoicing.new_client.select">
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
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.engagement")}
                </p>
                <Select
                  value={newEngagementId}
                  onValueChange={setNewEngagementId}
                  disabled={!newClientId}
                >
                  <SelectTrigger data-ocid="invoicing.new_engagement.select">
                    <SelectValue placeholder={t("common.selectEngagement")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEngagements.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: invoice number + status */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("invoicing.invoiceNumberRequired")}
                </p>
                <Input
                  value={newInvoiceNumber}
                  onChange={(e) => setNewInvoiceNumber(e.target.value)}
                  data-ocid="invoicing.new_number.input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.status")}
                </p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger data-ocid="invoicing.new_status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceStatusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: dates */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.issueDate")}
                </p>
                <Input
                  type="date"
                  value={newIssueDate}
                  onChange={(e) => setNewIssueDate(e.target.value)}
                  data-ocid="invoicing.new_issue_date.input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.dueDate")}
                </p>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  data-ocid="invoicing.new_due_date.input"
                />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
                  {t("common.lineItems")}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addLineItem}
                  data-ocid="invoicing.add_line_item.button"
                >
                  <Plus className="icon-sm mr-1" /> {t("common.addRow")}
                </Button>
              </div>
              <div className="bg-surface-elevated border border-border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                        {t("common.description")}
                      </th>
                      <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-1.5 w-16">
                        {t("common.qty")}
                      </th>
                      <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-1.5 w-24">
                        {t("common.unitPrice")}
                      </th>
                      <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-1.5 w-20">
                        {t("common.total")}
                      </th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {newLineItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-border/40">
                        <td className="px-2 py-1">
                          <Input
                            placeholder={t("invoicing.placeholderDescription")}
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(idx, "description", e.target.value)
                            }
                            className="h-7 text-token-sm"
                            data-ocid={`invoicing.line_item.description.${idx + 1}`}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(
                                idx,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="h-7 text-token-sm text-right"
                            data-ocid={`invoicing.line_item.quantity.${idx + 1}`}
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateLineItem(
                                idx,
                                "unitPrice",
                                Number(e.target.value),
                              )
                            }
                            className="h-7 text-token-sm text-right"
                            data-ocid={`invoicing.line_item.price.${idx + 1}`}
                          />
                        </td>
                        <td className="px-3 py-1 text-right text-token-sm tabular-nums text-foreground">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td className="px-1 py-1">
                          {newLineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLineItem(idx)}
                              className="text-muted-foreground hover:text-danger transition-opacity-fast"
                              data-ocid={`invoicing.remove_line_item.${idx + 1}`}
                              aria-label={t("common.removeLine")}
                            >
                              <Minus className="icon-sm" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-border bg-surface-elevated">
                      <td
                        colSpan={3}
                        className="text-right text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground px-3 py-2"
                      >
                        {t("common.total")}
                      </td>
                      <td className="text-right text-token-sm tabular-nums font-token-semibold text-foreground px-3 py-2">
                        {formatCurrency(lineItemTotal)}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="invoice-notes"
                className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
              >
                {t("common.notes")}
              </label>
              <Textarea
                id="invoice-notes"
                placeholder={t("common.optionalNotesEllipsis")}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                data-ocid="invoicing.new_notes.textarea"
              />
            </div>
          </InlineForm>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <TwoPanel list={listPanel} detail={detailPanel} />
      </div>
    </div>
  );
}
