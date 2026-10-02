import { ActionBar } from "@/components/shared/ActionBar";
import { EmptyState } from "@/components/shared/EmptyState";
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
  useAddUpdateNote,
  useAllNotes,
  useClients,
  useRemoveNote,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/formatting";
import type { Note } from "@/types";
import { MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NOTE_TYPE_VALUES = ["all", "note", "call", "email", "meeting"];
const NOTE_TYPE_FORM_VALUES = ["note", "call", "email", "meeting"];

type FormState = {
  content: string;
  clientId: string;
  noteType: string;
  followUp: boolean;
};
const emptyForm: FormState = {
  content: "",
  clientId: "all",
  noteType: "note",
  followUp: false,
};

export function CommunicationsTab() {
  const t = useT();
  const { data: notes = [], isLoading } = useAllNotes();
  const { data: clients = [] } = useClients();
  const addNote = useAddUpdateNote();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const filtered = notes.filter((n) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const clientName = n.clientId
        ? (clientMap[n.clientId] ?? "").toLowerCase()
        : "";
      const content = n.content.toLowerCase();
      const noteType = (n.noteType ?? "").toLowerCase();
      if (
        !content.includes(q) &&
        !clientName.includes(q) &&
        !noteType.includes(q)
      )
        return false;
    }
    if (typeFilter !== "all") {
      const nt = (n.noteType ?? "note").toLowerCase();
      if (nt !== typeFilter) return false;
    }
    if (clientFilter !== "all") {
      if (n.clientId !== clientFilter) return false;
    }
    return true;
  });

  async function handleAdd() {
    if (!form.content.trim()) {
      toast.error(t("communications.contentRequired"));
      return;
    }
    const record: Note = {
      id: `note-${Date.now()}`,
      content: form.content.trim(),
      clientId: form.clientId !== "all" ? form.clientId : undefined,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      noteType: form.noteType,
      isMeetingNote: form.noteType === "meeting",
      followUp: form.followUp,
      followUpDone: false,
    };
    try {
      await addNote.mutateAsync(record);
      setForm(emptyForm);
      setShowForm(false);
      toast.success(t("communications.added"));
    } catch {
      toast.error(t("communications.addFailed"));
    }
  }

  const hasFilter = !!search || typeFilter !== "all" || clientFilter !== "all";

  return (
    <div className="flex flex-col h-full">
      <ActionBar
        title={t("tab.bizdev.communications")}
        icon={<MessageSquare className="w-4 h-4" />}
        actions={
          <Button
            type="button"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            data-ocid="communications.add_button"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("common.addNote")}
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="px-content-padding pt-space-3 pb-0 flex flex-wrap items-center gap-2 border-b border-border">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 h-7 text-xs"
            placeholder={t("common.searchNotes")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="communications.search_input"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="h-7 w-36 text-xs"
            data-ocid="communications.type_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTE_TYPE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`noteType.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger
            className="h-7 w-40 text-xs"
            data-ocid="communications.client_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allClients")}</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground ml-auto pb-space-3">
          {t(filtered.length === 1 ? "common.records_one" : "common.records", {
            count: filtered.length,
          })}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-content-padding">
        {showForm && (
          <InlineForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={t("common.addNote")}
            onSubmit={handleAdd}
            submitLabel={t("common.addNote")}
            loading={addNote.isPending}
          >
            <div className="space-y-space-3">
              <div>
                <label
                  htmlFor="field-comm-type"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.type")}
                </label>
                <Select
                  value={form.noteType}
                  onValueChange={(v) => set("noteType", v)}
                >
                  <SelectTrigger
                    id="field-comm-type"
                    data-ocid="communications.note_type.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_TYPE_FORM_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`noteType.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="field-comm-client"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.clientOptional")}
                </label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => set("clientId", v)}
                >
                  <SelectTrigger
                    id="field-comm-client"
                    data-ocid="communications.note_client.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.noClient")}</SelectItem>
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
                  htmlFor="field-comm-note"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                >
                  {t("common.note")}
                </label>
                <Input
                  id="field-comm-note"
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder={t("common.writeYourNoteHere")}
                  data-ocid="communications.note_content.input"
                />
              </div>
            </div>
          </InlineForm>
        )}

        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            heading={
              hasFilter
                ? t("communications.emptyFiltered")
                : t("communications.empty")
            }
            message={
              hasFilter
                ? t("communications.emptyFilteredBody")
                : t("communications.emptyBody")
            }
            data-ocid="communications.empty_state"
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((note, idx) => (
              <NoteCard
                key={note.id}
                note={note}
                clientName={
                  note.clientId ? (clientMap[note.clientId] ?? "—") : undefined
                }
                idx={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NoteCard({
  note,
  clientName,
  idx,
}: {
  note: Note;
  clientName: string | undefined;
  idx: number;
}) {
  const t = useT();
  const [confirming, setConfirming] = useState(false);
  const removeNote = useRemoveNote();

  async function handleDelete() {
    try {
      await removeNote.mutateAsync(note.id);
      toast.success(t("communications.deleted"));
    } catch {
      toast.error(t("communications.deleteFailed"));
    } finally {
      setConfirming(false);
    }
  }

  const typeLabel = note.noteType
    ? t(`noteType.${note.noteType}_single`)
    : null;

  return (
    <div
      className="bg-surface-elevated border border-border rounded-lg p-space-3 space-y-1"
      data-ocid={`communications.note.item.${idx + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {typeLabel && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
              {typeLabel}
            </span>
          )}
          {clientName && (
            <span className="text-xs font-semibold text-accent truncate">
              {clientName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)}
          </span>
          {!confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-muted-foreground hover:text-danger transition-opacity duration-150 p-0.5 rounded"
              aria-label={t("common.deleteNote")}
              data-ocid={`communications.delete_button.${idx + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{note.content}</p>

      {note.followUp && !confirming && (
        <span className="inline-flex items-center text-xs text-warning font-medium">
          {t("common.followUpRequired")}
        </span>
      )}

      {confirming && (
        <div className="flex items-center gap-2 pt-1 border-t border-border mt-2">
          <span className="text-xs text-muted-foreground flex-1">
            {t("common.deleteThisNote")}
          </span>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={removeNote.isPending}
            data-ocid={`communications.confirm_button.${idx + 1}`}
          >
            {removeNote.isPending ? t("common.deleting") : t("common.confirm")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setConfirming(false)}
            data-ocid={`communications.cancel_button.${idx + 1}`}
          >
            {t("common.cancel")}
          </Button>
        </div>
      )}
    </div>
  );
}
