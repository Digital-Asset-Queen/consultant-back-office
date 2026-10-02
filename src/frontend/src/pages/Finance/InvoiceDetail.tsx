import { InlineForm } from "@/components/shared/InlineForm";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddUpdatePayment, usePaymentsByInvoice } from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Invoice, Payment } from "@/types";
import { useState } from "react";

const PAYMENT_METHODS = [
  { value: "bank_transfer", key: "paymentMethod.bank_transfer" },
  { value: "check", key: "paymentMethod.check" },
  { value: "cash", key: "paymentMethod.cash" },
  { value: "credit_card", key: "paymentMethod.credit_card" },
  { value: "other", key: "paymentMethod.other" },
] as const;

function invoiceStatusVariant(status: string) {
  if (status === "paid") return "success" as const;
  if (status === "overdue") return "danger" as const;
  if (status === "sent") return "info" as const;
  return "neutral" as const;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-token-sm text-foreground tabular-nums mt-0.5">
        {value}
      </p>
    </div>
  );
}

export function InvoiceDetail({
  invoice,
  clientName,
}: {
  invoice: Invoice;
  clientName: string | undefined;
}) {
  const t = useT();
  const { data: payments = [] } = usePaymentsByInvoice(invoice.id);
  const addPayment = useAddUpdatePayment();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(todayStr());
  const [payMethod, setPayMethod] = useState("bank_transfer");
  const [payRef, setPayRef] = useState("");

  function resetPaymentForm() {
    setPayAmount("");
    setPayDate(todayStr());
    setPayMethod("bank_transfer");
    setPayRef("");
    setShowPaymentForm(false);
  }

  async function handleRecordPayment() {
    const amount = Number.parseFloat(payAmount);
    if (!payAmount || Number.isNaN(amount) || amount <= 0) return;
    const dateMs = new Date(payDate).getTime();
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      invoiceId: invoice.id,
      clientId: invoice.clientId,
      paymentDate: BigInt(dateMs),
      amount,
      method: payMethod,
      reference: payRef || undefined,
    };
    await addPayment.mutateAsync(payment);
    resetPaymentForm();
  }

  return (
    <div className="p-page space-y-4 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-token-xl font-token-semibold text-foreground">
            {invoice.invoiceNumber}
          </h2>
          <p className="text-token-sm text-muted-foreground mt-0.5">
            {clientName ?? "—"}
          </p>
        </div>
        <StatusBadge
          variant={invoiceStatusVariant(invoice.status)}
          label={invoice.status}
          size="md"
        />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailRow
          label={t("common.issueDate")}
          value={formatDate(invoice.issueDate)}
        />
        <DetailRow
          label={t("common.dueDate")}
          value={formatDate(invoice.dueDate)}
        />
        <DetailRow
          label={t("common.subtotal")}
          value={formatCurrency(invoice.subtotalAmount ?? 0)}
        />
        <DetailRow
          label={t("common.total")}
          value={formatCurrency(invoice.totalAmount ?? 0)}
        />
        <DetailRow
          label={t("common.paymentTerms")}
          value={invoice.paymentTerms || "—"}
        />
        <DetailRow
          label={t("common.paymentMethod")}
          value={invoice.paymentMethod || "—"}
        />
      </div>

      {/* Line items */}
      {(invoice.lineItems ?? []).length > 0 && (
        <div>
          <SectionHeader title={t("common.lineItems")} />
          <div className="bg-surface-elevated rounded-md border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
                    {t("common.description")}
                  </th>
                  <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
                    {t("common.qty")}
                  </th>
                  <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
                    {t("common.unitPrice")}
                  </th>
                  <th className="text-right text-token-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
                    {t("common.total")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(invoice.lineItems ?? []).map((item, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="text-token-sm text-foreground px-3 py-2">
                      {item.description}
                    </td>
                    <td className="text-token-sm tabular-nums text-right text-foreground px-3 py-2">
                      {item.quantity}
                    </td>
                    <td className="text-token-sm tabular-nums text-right text-foreground px-3 py-2">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="text-token-sm tabular-nums text-right font-token-semibold text-foreground px-3 py-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionHeader title={t("common.paymentHistory")} />
          {!showPaymentForm && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowPaymentForm(true)}
              data-ocid="invoicing.add_payment.button"
            >
              {t("common.recordPayment")}
            </Button>
          )}
        </div>

        <InlineForm
          isOpen={showPaymentForm}
          onClose={resetPaymentForm}
          title={t("common.recordPayment")}
          onSubmit={handleRecordPayment}
          submitLabel={t("common.record")}
          loading={addPayment.isPending}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pay-amount"
                className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
              >
                {t("invoicing.amountRequired")}
              </label>
              <Input
                id="pay-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("invoicing.paymentAmountPlaceholder")}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                data-ocid="invoicing.payment_amount.input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pay-date"
                className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
              >
                {t("invoicing.dateRequired")}
              </label>
              <Input
                id="pay-date"
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                data-ocid="invoicing.payment_date.input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pay-method"
                className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
              >
                {t("common.method")}
              </label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger data-ocid="invoicing.payment_method.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {t(m.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pay-reference"
                className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground"
              >
                {t("common.reference")}
              </label>
              <Input
                id="pay-reference"
                placeholder={t("invoicing.referenceOptional")}
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                data-ocid="invoicing.payment_reference.input"
              />
            </div>
          </div>
        </InlineForm>

        {payments.length === 0 && !showPaymentForm ? (
          <p className="text-token-sm text-muted-foreground px-page py-2">
            {t("common.noPayments")}
          </p>
        ) : (
          <div className="space-y-1">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 bg-surface-elevated border border-border rounded-md"
              >
                <div className="flex flex-col">
                  <span className="text-token-sm text-muted-foreground">
                    {formatDate(p.paymentDate ?? p.date)}
                  </span>
                  {p.method && (
                    <span className="text-token-xs text-muted-foreground capitalize">
                      {p.method.replace("_", " ")}
                    </span>
                  )}
                </div>
                <span className="text-token-sm tabular-nums font-token-semibold text-success">
                  {formatCurrency(p.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div>
          <SectionHeader title={t("common.notes")} />
          <p className="text-token-sm text-foreground leading-relaxed px-page">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}
