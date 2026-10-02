import type { PracticeProfile, RateCard } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Client,
  Contact,
  Deliverable,
  Document,
  Engagement,
  Expense,
  Invoice,
  Note,
  Payment,
  Proposal,
  Reminder,
  TimeEntry,
} from "../types";
import { useActor } from "./useActor";

export type {
  Client,
  Contact,
  Engagement,
  Deliverable,
  TimeEntry,
  Expense,
  Invoice,
  Payment,
  Note,
  Proposal,
  RateCard,
  Reminder,
  PracticeProfile,
};

export function usePracticeProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["practice-profile"],
    queryFn: async () => {
      if (!actor) return null;
      const profiles = await actor.getAllPracticeProfiles();
      return profiles[0] ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePracticeProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: PracticeProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdatePracticeProfile(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["practice-profile"] });
      qc.invalidateQueries({ queryKey: ["practice-profiles"] });
    },
  });
}

// ── Dashboard ──────────────────────────────────────────────────────
export function useDashboardData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => {
      if (!actor) return null;
      return actor.getDashboardData();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Clients ────────────────────────────────────────────────────────
export function useClients() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClientsByEngagement(clientId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["engagements-by-client", clientId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllEngagementsByClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useContactsByClient(clientId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contacts-by-client", clientId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllContactsByClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useInvoicesByClient(clientId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["invoices-by-client", clientId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllInvoicesByClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

// ── Engagements ────────────────────────────────────────────────────
export function useEngagements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["engagements"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllEngagements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeliverables(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["deliverables", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllDeliverablesByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

export function useTimeEntries(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["time-entries", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllTimeEntriesByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

export function useExpenses(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["expenses", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllExpensesByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}
export function useAllTimeEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<TimeEntry[]>({
    queryKey: ["time-entries", "all"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getTimeEntries(null, null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllExpenses() {
  const { actor, isFetching } = useActor();
  return useQuery<Expense[]>({
    queryKey: ["expenses", "all"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getExpenses(null, null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotes(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notes", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllNotesByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

export function useAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notes", "all"],
    queryFn: () => {
      if (!actor) return [];
      return (actor as any).getNotes(null, null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotesByClient(clientId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notes-by-client", clientId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllNotesByClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useInvoicesByEngagement(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["invoices-by-engagement", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllInvoicesByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

// ── Contacts ───────────────────────────────────────────────────────
export function useContacts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Invoices ───────────────────────────────────────────────────────
export function useInvoices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOutstandingInvoices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["outstanding-invoices"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getOutstandingInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePaymentsByInvoice(invoiceId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["payments", invoiceId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllPaymentsByInvoice(invoiceId);
    },
    enabled: !!actor && !isFetching && !!invoiceId,
  });
}

// ── Proposals ──────────────────────────────────────────────────────
export function useProposals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["proposals"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllProposals();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Rate Cards ─────────────────────────────────────────────────────
export function useRateCards() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["rate-cards"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllRateCards();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Practice Profiles ──────────────────────────────────────────────
export function usePracticeProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["practice-profiles"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllPracticeProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Notes / Follow-ups ─────────────────────────────────────────────
export function usePendingFollowUps() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pending-follow-ups"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getPendingFollowUpNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpcomingReminders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["upcoming-reminders"],
    queryFn: () => {
      if (!actor) return [];
      return actor.getUpcomingReminders();
    },
    enabled: !!actor && !isFetching,
  });
}
export function useRemindersByEngagement(engagementId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reminders", engagementId],
    queryFn: () => {
      if (!actor) return [];
      return actor.getAllRemindersByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

export function useAddUpdatePracticeProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: PracticeProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdatePracticeProfile(record);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice-profiles"] }),
  });
}

export function useAddUpdateRateCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: RateCard) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateRateCard(record);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rate-cards"] }),
  });
}

export function useRemoveRateCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeRateCard(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rate-cards"] }),
  });
}

export function useAddUpdateReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Reminder) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateReminder(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeReminder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useMarkReminderDone() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markReminderDone(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemovePracticeProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removePracticeProfile(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice-profiles"] }),
  });
}

// ── Mutations ──────────────────────────────────────────────────────
export function useAddUpdateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Client) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateClient(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeClient(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useAddUpdateContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Contact) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateContact(record);
    },
    onSuccess: (_, record) => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({
        queryKey: ["contacts-by-client", record.clientId],
      });
    },
  });
}

export function useRemoveContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeContact(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useAddUpdateEngagement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Engagement) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateEngagement(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["engagements"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveEngagement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeEngagement(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["engagements"] }),
  });
}

export function useCloseOutEngagement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.closeOutEngagement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["engagements"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAddUpdateDeliverable() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Deliverable) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateDeliverable(record);
    },
    onSuccess: (_, record) =>
      qc.invalidateQueries({ queryKey: ["deliverables", record.engagementId] }),
  });
}

export function useRemoveDeliverable() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      engagementId: _engId,
    }: { id: string; engagementId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeDeliverable(id);
    },
    onSuccess: (_, { engagementId }) =>
      qc.invalidateQueries({ queryKey: ["deliverables", engagementId] }),
  });
}

export function useAddUpdateTimeEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: TimeEntry) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateTimeEntry(record);
    },
    onSuccess: (_, record) => {
      qc.invalidateQueries({ queryKey: ["time-entries", record.engagementId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveTimeEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      engagementId: _engId,
    }: { id: string; engagementId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeTimeEntry(id);
    },
    onSuccess: (_, { engagementId }) =>
      qc.invalidateQueries({ queryKey: ["time-entries", engagementId] }),
  });
}

export function useAddUpdateExpense() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Expense) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateExpense(record);
    },
    onSuccess: (_, record) =>
      qc.invalidateQueries({ queryKey: ["expenses", record.engagementId] }),
  });
}

export function useRemoveExpense() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      engagementId: _engId,
    }: { id: string; engagementId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeExpense(id);
    },
    onSuccess: (_, { engagementId }) =>
      qc.invalidateQueries({ queryKey: ["expenses", engagementId] }),
  });
}

export function useAddUpdateNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Note) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateNote(record);
    },
    onSuccess: (_, record) => {
      qc.invalidateQueries({ queryKey: ["notes", record.engagementId] });
      qc.invalidateQueries({ queryKey: ["notes-by-client"] });
      qc.invalidateQueries({ queryKey: ["pending-follow-ups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeNote(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["notes-by-client"] });
      qc.invalidateQueries({ queryKey: ["pending-follow-ups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAddUpdateInvoice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Invoice) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateInvoice(record);
    },
    onSuccess: (_, record) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({
        queryKey: ["invoices-by-engagement", record.engagementId],
      });
      qc.invalidateQueries({ queryKey: ["outstanding-invoices"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveInvoice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeInvoice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["outstanding-invoices"] });
    },
  });
}

export function useAddUpdatePayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Payment) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdatePayment(record);
    },
    onSuccess: (_, record) => {
      qc.invalidateQueries({ queryKey: ["payments", record.invoiceId] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["outstanding-invoices"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemovePayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      invoiceId: _invId,
    }: { id: string; invoiceId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removePayment(id);
    },
    onSuccess: (_, { invoiceId }) => {
      qc.invalidateQueries({ queryKey: ["payments", invoiceId] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["outstanding-invoices"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAddUpdateProposal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Proposal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateProposal(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoveProposal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeProposal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

export function useConvertProposal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (proposalId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.convertProposalToEngagement(proposalId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["engagements"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddUpdateDocument() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: Document) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addUpdateDocument(record);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useRemoveDocument() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeDocument(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useSearch(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["search", term],
    queryFn: () => {
      if (!actor) return { clients: [], contacts: [], engagements: [] };
      return actor.searchClientsContactsEngagements(term);
    },
    enabled: !!actor && !isFetching && term.length > 1,
    staleTime: 10_000,
  });
}
// ─── Contracts ────────────────────────────────────────────────────────────────
export function useContracts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      if (!actor) return [];
      return await (actor as any).getContracts(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddUpdateContract() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id?: string;
      engagementId: string;
      status: string;
      startDate: bigint;
      endDate?: bigint;
      renewalDate?: bigint;
      notes?: string;
    }) => {
      if (!actor) throw new Error("No actor");
      if (data.id) {
        return await (actor as any).updateContract(
          data.id,
          data.status,
          data.endDate ?? null,
          data.renewalDate ?? null,
          data.notes ?? null,
        );
      }
      return await (actor as any).createContract(
        data.engagementId,
        data.status,
        data.startDate,
        data.endDate ?? null,
        data.renewalDate ?? null,
        data.notes ?? null,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

export function useRemoveContract() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return await (actor as any).deleteContract(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
