import { ActionBar } from "@/components/shared/ActionBar";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { FormField } from "@/components/shared/FormField";
import { InlineForm } from "@/components/shared/InlineForm";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TwoPanel } from "@/components/shared/TwoPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddUpdateClient,
  useClients,
  useContactsByClient,
  useEngagements,
  useInvoicesByClient,
  useNotesByClient,
} from "@/hooks/useQueries";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Client, Engagement, Invoice, Note } from "@/types";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";

export default function ClientsTab() {
  const { data: clients, isLoading } = useClients();
  const { data: allEngagements } = useEngagements();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered =
    clients?.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.industry ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
      );
    }) ?? [];

  const selected = clients?.find((c) => c.id === selectedId) ?? null;

  return (
    <TwoPanel
      list={
        <div className="flex flex-col h-full">
          <ActionBar
            title="Clients"
            actions={
              <Button
                size="sm"
                onClick={() => setShowAdd(true)}
                data-ocid="clients.add_button"
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
                  data-ocid="clients.search_input"
                />
              </div>
            }
          />
          {showAdd && (
            <div className="px-page py-3 border-b border-border bg-surface-elevated">
              <AddClientForm onClose={() => setShowAdd(false)} />
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
                icon={User}
                heading="No clients"
                message="Add your first client to get started."
                data-ocid="clients.empty_state"
              />
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((c, i) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left px-page py-3 flex items-center justify-between transition-opacity-fast ${
                      selectedId === c.id
                        ? "bg-accent/10 border-l-2 border-l-accent"
                        : "hover:bg-accent/5"
                    }`}
                    data-ocid={`clients.item.${i + 1}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-token-sm font-token-semibold text-foreground truncate">
                        {c.name}
                      </p>
                      <p className="text-token-xs text-muted-foreground truncate">
                        {c.industry ?? c.email ?? "Independent"}
                      </p>
                    </div>
                    <span className="ml-2 flex-shrink-0 w-2 h-2 rounded-full bg-success opacity-80" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      detail={
        selected ? (
          <ClientDetail
            client={selected}
            engagements={
              allEngagements?.filter((e) => e.clientId === selected.id) ?? []
            }
          />
        ) : (
          <EmptyState
            icon={User}
            heading="Select a client"
            message="Choose a client from the list to view details."
          />
        )
      }
    />
  );
}

function AddClientForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [showMore, setShowMore] = useState(false);
  const mutation = useAddUpdateClient();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await mutation.mutateAsync({
      id: crypto.randomUUID(),
      name: name.trim(),
      industry: industry.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      website: website.trim() || undefined,
      notes: notes.trim() || undefined,
      primaryContactId: "",
      createdAt: BigInt(Date.now()) * 1_000_000n,
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      <p className="text-token-sm font-token-semibold text-foreground">
        New Client
      </p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            data-ocid="clients.name_input"
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@acme.com"
          />
        </FormField>
        <FormField label="Phone">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </FormField>
      </div>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="text-token-xs text-accent hover:text-foreground transition-opacity duration-150 font-token-medium"
        data-ocid="clients.more_details_toggle"
      >
        {showMore ? "− Less details" : "+ More details"}
      </button>

      <div
        className="grid grid-cols-2 gap-3 overflow-hidden transition-opacity duration-150"
        style={{
          maxHeight: showMore ? 400 : 0,
          opacity: showMore ? 1 : 0,
        }}
      >
        <FormField label="Company / Industry">
          <Input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Technology"
          />
        </FormField>
        <FormField label="Website">
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://acme.com"
          />
        </FormField>
        <FormField label="Address">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, City, Country"
          />
        </FormField>
        <FormField label="Internal Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes about this client…"
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-token-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            data-ocid="clients.notes_textarea"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || !name.trim()}
          data-ocid="clients.submit_button"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function ClientDetail({
  client,
  engagements,
}: { client: Client; engagements: Engagement[] }) {
  const { data: notes } = useNotesByClient(client.id);
  const { data: invoices } = useInvoicesByClient(client.id);
  const { data: contacts } = useContactsByClient(client.id);
  const [activeTab, setActiveTab] = useState<
    "overview" | "engagements" | "invoices" | "notes"
  >("overview");

  const clientTabs = [
    { key: "overview" as const, label: "Overview" },
    {
      key: "engagements" as const,
      label: `Engagements (${engagements.length})`,
    },
    { key: "invoices" as const, label: `Invoices (${invoices?.length ?? 0})` },
    { key: "notes" as const, label: `Notes (${notes?.length ?? 0})` },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-page py-4 border-b border-border">
        <h2 className="text-token-lg font-token-semibold text-foreground">
          {client.name}
        </h2>
        {client.industry && (
          <p className="text-token-sm text-muted-foreground mt-0.5 flex items-center gap-1">
            <Building2 className="icon-xs" />
            {client.industry}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          {client.email && (
            <a
              href={`mailto:${client.email}`}
              className="text-token-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-opacity-fast"
            >
              <Mail className="icon-xs" />
              {client.email}
            </a>
          )}
          {client.phone && (
            <span className="text-token-xs text-muted-foreground flex items-center gap-1">
              <Phone className="icon-xs" />
              {client.phone}
            </span>
          )}
          {client.website && (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-token-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-opacity-fast"
            >
              <Globe className="icon-xs" />
              {client.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {client.address && (
            <span className="text-token-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="icon-xs" />
              {client.address}
            </span>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {clientTabs.map((t) => (
          <button
            type="button"
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative px-4 py-2 text-token-sm font-token-semibold transition-opacity-fast ${
              activeTab === t.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`clients.detail.${t.key}.tab`}
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
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-page">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-elevated border border-border rounded-lg p-3">
                <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
                  Total Invoiced
                </span>
                <p className="text-token-xl font-token-semibold tabular-nums text-foreground mt-0.5">
                  {formatCurrency(
                    invoices?.reduce((s, i) => s + (i.totalAmount ?? 0), 0) ??
                      0,
                  )}
                </p>
              </div>
              <div className="bg-surface-elevated border border-border rounded-lg p-3">
                <span className="text-token-xs uppercase tracking-wider text-muted-foreground">
                  Active Engagements
                </span>
                <p className="text-token-xl font-token-semibold tabular-nums text-foreground mt-0.5">
                  {engagements.filter((e) => e.status === "active").length}
                </p>
              </div>
            </div>
            {contacts && contacts.length > 0 && (
              <>
                <SectionHeader title="Contacts" />
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-1"
                    >
                      <div>
                        <p className="text-token-sm font-token-semibold text-foreground">
                          {c.name}
                        </p>
                        <p className="text-token-xs text-muted-foreground">
                          {c.role ?? "Contact"}
                        </p>
                      </div>
                      <div className="text-right">
                        {c.email && (
                          <p className="text-token-xs text-muted-foreground">
                            {c.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {client.notes && (
              <>
                <SectionHeader title="Internal Notes" />
                <div className="bg-surface-elevated border border-border rounded-lg p-3">
                  <p className="text-token-sm text-foreground whitespace-pre-wrap">
                    {client.notes}
                  </p>
                </div>
              </>
            )}
            {notes && notes.length > 0 && (
              <>
                <SectionHeader title="Recent Notes" />
                <div className="space-y-2">
                  {notes.slice(0, 3).map((n) => (
                    <div
                      key={n.id}
                      className="bg-surface-elevated border border-border rounded-lg p-3"
                    >
                      <p className="text-token-sm text-foreground">
                        {n.content}
                      </p>
                      <p className="text-token-xs text-muted-foreground mt-1">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === "engagements" && (
          <DataTable
            columns={[
              {
                key: "name",
                header: "Engagement",
                render: (e: Engagement) => (
                  <span className="text-token-sm font-token-semibold text-foreground">
                    {e.name}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (e: Engagement) => <StatusBadge status={e.status} />,
              },
              {
                key: "start",
                header: "Started",
                render: (e: Engagement) => (
                  <span className="text-token-sm text-muted-foreground">
                    {formatDate(e.startDate)}
                  </span>
                ),
              },
            ]}
            data={engagements}
            emptyMessage="No engagements for this client."
            rowKey={(e) => e.id}
          />
        )}
        {activeTab === "invoices" && (
          <DataTable
            columns={[
              {
                key: "number",
                header: "Invoice",
                render: (i: Invoice) => (
                  <span className="text-token-sm font-token-semibold text-foreground">
                    {i.invoiceNumber}
                  </span>
                ),
              },
              {
                key: "total",
                header: "Total",
                align: "right" as const,
                render: (i: Invoice) => (
                  <span className="text-token-sm tabular-nums text-foreground">
                    {formatCurrency(i.totalAmount ?? 0)}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (i: Invoice) => <StatusBadge status={i.status} />,
              },
              {
                key: "due",
                header: "Due",
                render: (i: Invoice) => (
                  <span className="text-token-sm text-muted-foreground">
                    {formatDate(i.dueDate)}
                  </span>
                ),
              },
            ]}
            data={invoices ?? []}
            emptyMessage="No invoices for this client."
            rowKey={(i) => i.id}
          />
        )}
        {activeTab === "notes" && (
          <DataTable
            columns={[
              {
                key: "content",
                header: "Note",
                render: (n: Note) => (
                  <span className="text-token-sm text-foreground">
                    {n.content}
                  </span>
                ),
              },
              {
                key: "date",
                header: "Date",
                render: (n: Note) => (
                  <span className="text-token-sm text-muted-foreground">
                    {formatDate(n.createdAt)}
                  </span>
                ),
              },
            ]}
            data={notes ?? []}
            emptyMessage="No notes for this client."
            rowKey={(n) => n.id}
          />
        )}
      </div>
    </div>
  );
}
