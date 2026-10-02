import { ActionBar } from "@/components/shared/ActionBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { InlineForm } from "@/components/shared/InlineForm";
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
import {
  useAddUpdateDocument,
  useClients,
  useDocuments,
  useEngagements,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/formatting";
import type { Document } from "@/types";
import { FolderOpen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function docStatusVariant(status: string) {
  if (status === "signed" || status === "active") return "success";
  if (status === "expired") return "danger";
  if (status === "archived") return "neutral" as const;
  return "info";
}

type FormState = {
  title: string;
  docType: string;
  status: string;
  clientId: string;
  engagementId: string;
  notes: string;
};

const emptyForm: FormState = {
  title: "",
  docType: "contract",
  status: "draft",
  clientId: "",
  engagementId: "",
  notes: "",
};

export function DocumentsTab() {
  const t = useT();
  const { data: documents = [], isLoading } = useDocuments();
  const { data: clients = [] } = useClients();
  const { data: engagements = [] } = useEngagements();
  const addUpdate = useAddUpdateDocument();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [typeFilter, setTypeFilter] = useState("all");

  const docTypes = [
    { value: "contract", label: t("docType.contract") },
    { value: "proposal", label: t("docType.proposal") },
    { value: "nda", label: t("docType.nda") },
    { value: "sow", label: t("docType.sow") },
    { value: "invoice", label: t("docType.invoice") },
    { value: "report", label: t("docType.report") },
    { value: "other", label: t("docType.other") },
  ];

  const docStatuses = [
    { value: "draft", label: t("docStatus.draft") },
    { value: "active", label: t("docStatus.active") },
    { value: "signed", label: t("docStatus.signed") },
    { value: "expired", label: t("docStatus.expired") },
    { value: "archived", label: t("docStatus.archived") },
  ];

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const _engMap = Object.fromEntries(engagements.map((e) => [e.id, e.name]));

  const filtered =
    typeFilter === "all"
      ? documents
      : documents.filter((d) => d.docType === typeFilter);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd() {
    if (!form.title.trim()) {
      toast.error(t("documents.titleRequired"));
      return;
    }
    const now = BigInt(Date.now()) * 1_000_000n;
    const record: Document = {
      id: `doc-${Date.now()}`,
      title: form.title.trim(),
      name: form.title.trim(),
      docType: form.docType,
      category: form.docType,
      status: form.status,
      clientId: form.clientId || undefined,
      engagementId: form.engagementId || undefined,
      notes: form.notes || undefined,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await addUpdate.mutateAsync(record);
      setForm(emptyForm);
      setShowForm(false);
      toast.success(t("documents.added"));
    } catch {
      toast.error(t("documents.addFailed"));
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ActionBar
        title={t("documents.actionBarTitle")}
        icon={<FolderOpen className="w-4 h-4" />}
        actions={
          <Button
            type="button"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            data-ocid="documents.add_button"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("common.addDocument")}
          </Button>
        }
        left={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger
              className="h-7 w-36 text-xs"
              data-ocid="documents.type_filter.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allTypes")}</SelectItem>
              {docTypes.map((tp) => (
                <SelectItem key={tp.value} value={tp.value}>
                  {tp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto p-page">
        {showForm && (
          <InlineForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={t("documents.addFormTitle")}
            onSubmit={handleAdd}
            submitLabel={t("common.addDocument")}
            loading={addUpdate.isPending}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label
                  htmlFor="field-doc-title"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.title")}
                </label>
                <Input
                  id="field-doc-title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={t("documents.placeholderTitle")}
                  data-ocid="documents.title.input"
                />
              </div>
              <div>
                <label
                  htmlFor="field-doc-type"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.type")}
                </label>
                <Select
                  value={form.docType}
                  onValueChange={(v) => set("docType", v)}
                >
                  <SelectTrigger
                    id="field-doc-type"
                    data-ocid="documents.type.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {docTypes.map((tp) => (
                      <SelectItem key={tp.value} value={tp.value}>
                        {tp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-doc-status"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.status")}
                </label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v)}
                >
                  <SelectTrigger
                    id="field-doc-status"
                    data-ocid="documents.status.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {docStatuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-doc-client"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.clientOptional")}
                </label>
                <Select
                  value={form.clientId || "none"}
                  onValueChange={(v) => set("clientId", v === "none" ? "" : v)}
                >
                  <SelectTrigger
                    id="field-doc-client"
                    data-ocid="documents.client.select"
                  >
                    <SelectValue placeholder={t("common.none")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("common.none")}</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-doc-engagement"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.engagementOptional")}
                </label>
                <Select
                  value={form.engagementId || "none"}
                  onValueChange={(v) =>
                    set("engagementId", v === "none" ? "" : v)
                  }
                >
                  <SelectTrigger
                    id="field-doc-engagement"
                    data-ocid="documents.engagement.select"
                  >
                    <SelectValue placeholder={t("common.none")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("common.none")}</SelectItem>
                    {engagements.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="field-doc-notes"
                  className="text-token-xs font-token-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.notes")}
                </label>
                <Input
                  id="field-doc-notes"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder={t("common.optionalNotes")}
                  data-ocid="documents.notes.input"
                />
              </div>
            </div>
          </InlineForm>
        )}

        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            heading={t("documents.empty")}
            message={t("documents.emptyBody")}
            data-ocid="documents.empty_state"
          />
        ) : (
          <div className="bg-surface-elevated rounded-lg border border-border overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.title")}
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.type")}
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.client")}
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.status")}
                  </th>
                  <th className="text-right text-xs uppercase tracking-wider text-muted-foreground px-4 py-2.5">
                    {t("common.added")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className="border-b border-border/40 hover:bg-accent/5"
                    data-ocid={`documents.doc.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {doc.title || doc.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {t(`docType.${doc.docType}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {doc.clientId ? (clientMap[doc.clientId] ?? "—") : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        variant={docStatusVariant(doc.status)}
                        label={t(`docStatus.${doc.status}`)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
