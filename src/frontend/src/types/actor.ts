import type { PracticeProfile, RateCard } from "@/backend";
// Typed actor interface for the consultant back office backend
import type { Document } from "./index";
import type {
  Client,
  Contact,
  DashboardData,
  Deliverable,
  Engagement,
  Expense,
  Invoice,
  Note,
  Payment,
  Proposal,
  Reminder,
  SearchResults,
  TimeEntry,
} from "./index";

export interface BackendActor {
  // Seed data
  initializeSeedData(): Promise<void>;
  seedSampleData(): Promise<boolean>;

  // Practice profiles
  getAllPracticeProfiles(): Promise<PracticeProfile[]>;
  addUpdatePracticeProfile(profile: PracticeProfile): Promise<void>;
  removePracticeProfile(id: string): Promise<void>;

  // Rate cards
  getAllRateCards(): Promise<RateCard[]>;
  addUpdateRateCard(card: RateCard): Promise<void>;
  removeRateCard(id: string): Promise<void>;

  // Clients
  getAllClients(): Promise<Client[]>;
  addUpdateClient(client: Client): Promise<void>;
  removeClient(id: string): Promise<void>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getAllContactsByClient(clientId: string): Promise<Contact[]>;
  addUpdateContact(contact: Contact): Promise<void>;
  removeContact(id: string): Promise<void>;

  // Engagements
  getAllEngagements(): Promise<Engagement[]>;
  getAllEngagementsByClient(clientId: string): Promise<Engagement[]>;
  addUpdateEngagement(engagement: Engagement): Promise<void>;
  removeEngagement(id: string): Promise<void>;
  closeOutEngagement(id: string): Promise<void>;

  // Deliverables
  getAllDeliverablesByEngagement(engagementId: string): Promise<Deliverable[]>;
  addUpdateDeliverable(deliverable: Deliverable): Promise<void>;
  removeDeliverable(id: string): Promise<void>;

  // Time entries
  getAllTimeEntriesByEngagement(engagementId: string): Promise<TimeEntry[]>;
  getTimeEntries(
    engagementId: string | null,
    clientIdFilter: string | null,
  ): Promise<any[]>;
  addUpdateTimeEntry(entry: TimeEntry): Promise<void>;
  removeTimeEntry(id: string): Promise<void>;

  // Expenses
  getAllExpensesByEngagement(engagementId: string): Promise<Expense[]>;
  getExpenses(
    engagementId: string | null,
    clientIdFilter: string | null,
  ): Promise<any[]>;
  addUpdateExpense(expense: Expense): Promise<void>;
  removeExpense(id: string): Promise<void>;

  // Invoices
  getAllInvoices(): Promise<Invoice[]>;
  getOutstandingInvoices(): Promise<Invoice[]>;
  getAllInvoicesByClient(clientId: string): Promise<Invoice[]>;
  getAllInvoicesByEngagement(engagementId: string): Promise<Invoice[]>;
  addUpdateInvoice(invoice: Invoice): Promise<void>;
  removeInvoice(id: string): Promise<void>;

  // Proposals
  getAllProposals(): Promise<Proposal[]>;
  addUpdateProposal(proposal: Proposal): Promise<void>;
  removeProposal(id: string): Promise<void>;
  convertProposalToEngagement(proposalId: string): Promise<void>;

  // Payments
  getAllPaymentsByInvoice(invoiceId: string): Promise<Payment[]>;
  addUpdatePayment(payment: Payment): Promise<void>;
  removePayment(id: string): Promise<void>;

  // Notes
  getAllNotesByEngagement(engagementId: string): Promise<Note[]>;
  getAllNotesByClient(clientId: string): Promise<Note[]>;
  getPendingFollowUpNotes(): Promise<Note[]>;
  addUpdateNote(note: Note): Promise<void>;
  removeNote(id: string): Promise<void>;

  // Reminders
  getUpcomingReminders(): Promise<Reminder[]>;
  getAllRemindersByEngagement(engagementId: string): Promise<Reminder[]>;
  addUpdateReminder(reminder: Reminder): Promise<void>;
  removeReminder(id: string): Promise<void>;
  markReminderDone(id: string): Promise<boolean>;

  // Documents
  getAllDocuments(): Promise<Document[]>;
  addUpdateDocument(doc: Document): Promise<void>;
  removeDocument(id: string): Promise<void>;

  // Dashboard
  getDashboardData(): Promise<DashboardData>;

  // Search
  searchClientsContactsEngagements(term: string): Promise<SearchResults>;
}
