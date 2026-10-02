import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormField } from "@/components/shared/FormField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddUpdateContact,
  useClients,
  useContacts,
} from "@/hooks/useQueries";
import { useT } from "@/i18n/LanguageContext";
import { formatDate } from "@/lib/formatting";
import type { Contact } from "@/types";
import { Mail, Phone, Plus, Search, UserCircle } from "lucide-react";
import { useState } from "react";

export default function ContactsTab() {
  const t = useT();
  const { data: contacts, isLoading } = useContacts();
  const { data: clients } = useClients();
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  const filtered = (contacts ?? []).filter((c) => {
    if (clientFilter && c.clientId !== clientFilter) return false;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.role ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <ActionBar
        title={t("common.contacts")}
        actions={
          <Button
            size="sm"
            type="button"
            onClick={() => {
              setShowAdd(true);
              setSelected(null);
            }}
            data-ocid="contacts.add_button"
          >
            <Plus className="icon-sm mr-1" />
            {t("common.new")}
          </Button>
        }
        search={
          <div className="flex items-center gap-2">
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="h-8 px-2 rounded-md border border-border bg-background text-token-xs text-foreground"
              data-ocid="contacts.client.select"
            >
              <option value="">{t("common.allClients")}</option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="icon-sm absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 h-8 w-40 text-token-sm"
                data-ocid="contacts.search_input"
              />
            </div>
          </div>
        }
      />
      {/* Inline add/edit form */}
      {showAdd && (
        <div className="px-page py-3 border-b border-border bg-surface-elevated">
          <ContactForm
            clients={clients ?? []}
            contact={selected}
            onClose={() => {
              setShowAdd(false);
              setSelected(null);
            }}
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
            icon={UserCircle}
            heading={t("contacts.empty")}
            message={t("contacts.emptyBody")}
            data-ocid="contacts.empty_state"
          />
        ) : (
          <DataTable
            columns={[
              {
                key: "name",
                header: t("common.name"),
                render: (c: Contact) => (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-token-xs font-token-semibold text-foreground">
                        {c.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-token-sm font-token-semibold text-foreground truncate">
                        {c.name}
                      </p>
                      {c.role && (
                        <p className="text-token-xs text-muted-foreground truncate">
                          {c.role}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: "client",
                header: t("common.client"),
                render: (c: Contact) => (
                  <span className="text-token-sm text-foreground">
                    {clients?.find((cl) => cl.id === c.clientId)?.name ?? "—"}
                  </span>
                ),
              },
              {
                key: "email",
                header: t("common.email"),
                render: (c: Contact) =>
                  c.email ? (
                    <a
                      href={`mailto:${c.email}`}
                      className="text-token-sm text-foreground flex items-center gap-1 hover:text-accent transition-opacity-fast"
                    >
                      <Mail className="icon-xs" />
                      {c.email}
                    </a>
                  ) : (
                    <span className="text-token-sm text-muted-foreground">
                      —
                    </span>
                  ),
              },
              {
                key: "phone",
                header: t("common.phone"),
                render: (c: Contact) =>
                  c.phone ? (
                    <span className="text-token-sm text-foreground flex items-center gap-1">
                      <Phone className="icon-xs" />
                      {c.phone}
                    </span>
                  ) : (
                    <span className="text-token-sm text-muted-foreground">
                      —
                    </span>
                  ),
              },
              {
                key: "lastContact",
                header: t("common.lastContact"),
                render: (c: Contact) => (
                  <span className="text-token-sm text-muted-foreground">
                    {c.lastContactDate ? formatDate(c.lastContactDate) : "—"}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "",
                render: (c: Contact) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelected(c);
                      setShowAdd(true);
                    }}
                    className="h-6 px-2 text-token-xs"
                    data-ocid="contacts.edit_button"
                  >
                    {t("common.edit")}
                  </Button>
                ),
              },
            ]}
            data={filtered}
            emptyMessage={t("contacts.emptyFiltered")}
            rowKey={(c) => c.id}
          />
        )}
      </div>
    </div>
  );
}

function ContactForm({
  clients,
  contact,
  onClose,
}: {
  clients: { id: string; name: string }[];
  contact: Contact | null;
  onClose: () => void;
}) {
  const t = useT();
  const isEdit = contact !== null;
  const [name, setName] = useState(contact?.name ?? "");
  const [clientId, setClientId] = useState(contact?.clientId ?? "");
  const [role, setRole] = useState(contact?.role ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [notes, setNotes] = useState(contact?.notes ?? "");
  const mutation = useAddUpdateContact();

  const handleSubmit = async () => {
    if (!name.trim() || !clientId) return;
    await mutation.mutateAsync({
      id: contact?.id ?? crypto.randomUUID(),
      name: name.trim(),
      clientId,
      role: role.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: contact?.createdAt ?? BigInt(Date.now()) * 1_000_000n,
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      <p className="text-token-sm font-token-semibold text-foreground">
        {isEdit ? t("common.editContact") : t("common.newContact")}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <FormField label={t("common.name")} required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contacts.placeholderName")}
            data-ocid="contacts.name_input"
          />
        </FormField>
        <FormField label={t("common.client")} required>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full h-9 px-2 rounded-md border border-border bg-background text-token-sm text-foreground"
            data-ocid="contacts.client_select"
          >
            <option value="">{t("common.selectClient")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t("common.role")}>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={t("contacts.placeholderRole")}
          />
        </FormField>
        <FormField label={t("common.email")}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("contacts.placeholderEmail")}
          />
        </FormField>
        <FormField label={t("common.phone")}>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("contacts.placeholderPhone")}
          />
        </FormField>
        <FormField label={t("common.notes")}>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("contacts.placeholderNotes")}
          />
        </FormField>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          size="sm"
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || !name.trim() || !clientId}
          data-ocid="contacts.submit_button"
        >
          {mutation.isPending
            ? t("common.saving")
            : isEdit
              ? t("common.update")
              : t("common.save")}
        </Button>
      </div>
    </div>
  );
}
