import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimeEntry {
    id: string;
    engagementId: string;
    hours: bigint;
    deliverableId: string;
    date: Time;
    createdAt: Time;
    description?: string;
    billable: boolean;
    rateCardId: string;
}
export type Time = bigint;
export interface PracticeProfile {
    id: string;
    timezone?: string;
    ownerName?: string;
    billingAddress: string;
    workStyle: string;
    name: string;
    createdAt: Time;
    hourlyRate?: bigint;
    email?: string;
    practiceName: string;
    currency: string;
    address?: string;
    contactId: string;
    phone?: string;
    hasExistingClients: boolean;
}
export interface LineItem {
    description: string;
    quantity: number;
    unitPrice: number;
}
export interface Deliverable {
    id: string;
    status: string;
    engagementId: string;
    title: string;
    name: string;
    createdAt: Time;
    dueDate?: Time;
    notes?: string;
}
export interface Document {
    id: string;
    status: string;
    engagementId?: string;
    title: string;
    clientId?: string;
    name: string;
    createdAt: Time;
    updatedAt: Time;
    notes?: string;
    category: string;
    docType: string;
}
export interface Contact {
    id: string;
    clientId: string;
    name: string;
    createdAt: Time;
    role?: string;
    email?: string;
    notes?: string;
    lastContactDate?: Time;
    phone?: string;
}
export interface Invoice {
    id: string;
    issueDate: Time;
    status: string;
    lineItems: Array<LineItem>;
    taxes: number;
    engagementId?: string;
    clientId: string;
    paymentMethod: string;
    subtotalAmount: number;
    createdAt: Time;
    dueDate: Time;
    invoiceNumber: string;
    totalAmount: number;
    notes?: string;
    paymentTerms: string;
    contractId: string;
}
export interface Expense {
    id: string;
    engagementId: string;
    date: Time;
    createdAt: Time;
    description?: string;
    billable: boolean;
    category: string;
    amount: bigint;
}
export interface Payment {
    id: string;
    method?: string;
    clientId: string;
    date: Time;
    createdAt: Time;
    invoiceId: string;
    notes?: string;
    paymentDate: Time;
    amount: number;
}
export interface RateCard {
    id: string;
    serviceName: string;
    projectRate?: bigint;
    dailyRate?: bigint;
    name: string;
    createdAt: Time;
    hourlyRate?: bigint;
    currency: string;
    notes?: string;
}
export interface Proposal {
    id: string;
    status: string;
    clientId: string;
    name: string;
    createdAt: Time;
    description: string;
    notes: string;
    contactId: string;
    amount: number;
}
export interface Engagement {
    id: string;
    status: string;
    clientId: string;
    endDate?: Time;
    name: string;
    createdAt: Time;
    profileId: string;
    description?: string;
    healthStatus?: string;
    contactId: string;
    rateCardId?: string;
    startDate: Time;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Reminder {
    id: string;
    engagementId?: string;
    clientId?: string;
    done: boolean;
    createdAt: Time;
    text: string;
    completed: boolean;
    dueDate: Time;
    message: string;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface Contract {
    id: string;
    status: string;
    engagementId: string;
    endDate?: Time;
    createdAt: Time;
    notes?: string;
    renewalDate?: Time;
    startDate: Time;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface Client {
    id: string;
    name: string;
    createdAt: Time;
    email?: string;
    website?: string;
    primaryContactId: string;
    address?: string;
    notes?: string;
    phone?: string;
    industry?: string;
}
export interface Note {
    id: string;
    engagementId?: string;
    clientId: string;
    content: string;
    createdAt: Time;
    noteType: string;
    isMeetingNote: boolean;
    followUp: boolean;
    reminderDate?: Time;
    followUpDate?: Time;
    followUpDone: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addUpdateClient(record: Client): Promise<void>;
    addUpdateContact(record: Contact): Promise<void>;
    addUpdateDeliverable(record: Deliverable): Promise<void>;
    addUpdateDocument(doc: Document): Promise<void>;
    addUpdateEngagement(record: Engagement): Promise<void>;
    addUpdateExpense(record: Expense): Promise<void>;
    addUpdateInvoice(record: Invoice): Promise<void>;
    addUpdateNote(record: Note): Promise<void>;
    addUpdatePayment(record: Payment): Promise<void>;
    addUpdatePracticeProfile(record: PracticeProfile): Promise<void>;
    addUpdateProposal(record: Proposal): Promise<void>;
    addUpdateRateCard(record: RateCard): Promise<void>;
    addUpdateReminder(record: Reminder): Promise<void>;
    addUpdateTimeEntry(record: TimeEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closeOutEngagement(engagementId: string): Promise<void>;
    convertProposalToEngagement(proposalId: string): Promise<string>;
    createClient(record: Client): Promise<Client>;
    createContact(record: Contact): Promise<Contact>;
    createContract(engagementId: string, status: string, startDate: bigint, endDate: bigint | null, renewalDate: bigint | null, notes: string | null): Promise<Contract>;
    createDeliverable(record: Deliverable): Promise<void>;
    createDocument(doc: Document): Promise<void>;
    createEngagement(record: Engagement): Promise<void>;
    createExpense(record: Expense): Promise<void>;
    createInvoice(clientId: string, engagementId: string | null, dueDate: bigint, notes: string | null, lineItems: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
    }>): Promise<Invoice>;
    createNote(record: Note): Promise<void>;
    createPayment(invoiceId: string, date: bigint, amount: number, method: string | null, notes: string | null): Promise<Payment>;
    createProposal(clientId: string, title: string, value: number | null, stage: string, notes: string | null): Promise<Proposal>;
    createRateCard(record: RateCard): Promise<RateCard>;
    createReminder(record: Reminder): Promise<void>;
    createTimeEntry(record: TimeEntry): Promise<void>;
    deleteClient(id: string): Promise<boolean>;
    deleteContact(id: string): Promise<boolean>;
    deleteContract(id: string): Promise<boolean>;
    deleteDeliverable(id: string): Promise<void>;
    deleteDocument(id: string): Promise<void>;
    deleteEngagement(id: string): Promise<void>;
    deleteExpense(id: string): Promise<void>;
    deleteInvoice(id: string): Promise<boolean>;
    deleteNote(id: string): Promise<void>;
    deletePayment(id: string): Promise<boolean>;
    deleteProposal(id: string): Promise<boolean>;
    deleteRateCard(id: string): Promise<boolean>;
    deleteReminder(id: string): Promise<void>;
    deleteTimeEntry(id: string): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getAllClients(): Promise<Array<Client>>;
    getAllContacts(): Promise<Array<Contact>>;
    getAllContactsByClient(clientId: string): Promise<Array<Contact>>;
    getAllDeliverablesByEngagement(engagementId: string): Promise<Array<Deliverable>>;
    getAllDocuments(): Promise<Array<Document>>;
    getAllEngagements(): Promise<Array<Engagement>>;
    getAllEngagementsByClient(clientId: string): Promise<Array<Engagement>>;
    getAllEngagementsByContact(contactId: string): Promise<Array<Engagement>>;
    getAllExpensesByEngagement(engagementId: string): Promise<Array<Expense>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllInvoicesByClient(clientId: string): Promise<Array<Invoice>>;
    getAllInvoicesByEngagement(engagementId: string): Promise<Array<Invoice>>;
    getAllNotesByClient(clientId: string): Promise<Array<Note>>;
    getAllNotesByEngagement(engagementId: string): Promise<Array<Note>>;
    getAllPaymentsByClient(clientId: string): Promise<Array<Payment>>;
    getAllPaymentsByInvoice(invoiceId: string): Promise<Array<Payment>>;
    getAllPracticeProfiles(): Promise<Array<PracticeProfile>>;
    getAllProposals(): Promise<Array<Proposal>>;
    getAllProposalsByContact(contactId: string): Promise<Array<Proposal>>;
    getAllRateCards(): Promise<Array<RateCard>>;
    getAllRemindersByEngagement(engagementId: string): Promise<Array<Reminder>>;
    getAllTimeEntriesByEngagement(engagementId: string): Promise<Array<TimeEntry>>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(id: string): Promise<Client | null>;
    getClients(): Promise<Array<Client>>;
    getContacts(clientId: string | null): Promise<Array<Contact>>;
    getContracts(engagementId: string | null): Promise<Array<Contract>>;
    getDashboardData(): Promise<{
        monthlyFinancials: {
            totalCollected: number;
            totalOutstanding: number;
            totalInvoiced: number;
        };
        overdueInvoices: Array<Invoice>;
        activeEngagements: bigint;
        pipelineSummary: {
            pipelineValue: number;
            pipelineAverageValue: number;
            pipelineWinRate: bigint;
        };
        followUpsDueToday: Array<Reminder>;
        unbilledTime: bigint;
        recentActivity: Array<Note>;
        followUpsDueThisWeek: Array<Reminder>;
        expiringContracts: bigint;
    }>;
    getDeliverables(engagementId: string): Promise<Array<Deliverable>>;
    getDocuments(clientId: string | null, engagementId: string | null): Promise<Array<Document>>;
    getEngagement(id: string): Promise<Engagement | null>;
    getEngagements(clientId: string | null): Promise<Array<Engagement>>;
    getExpenses(engagementId: string | null, clientIdFilter: string | null): Promise<Array<Expense>>;
    getInvoice(id: string): Promise<Invoice | null>;
    getInvoices(clientId: string | null, statusFilter: string | null): Promise<Array<Invoice>>;
    getNextInvoiceNumber(): Promise<string>;
    getNotes(clientId: string | null, engagementId: string | null): Promise<Array<Note>>;
    getOutstandingInvoices(): Promise<Array<Invoice>>;
    getPayments(invoiceId: string): Promise<Array<Payment>>;
    getPendingFollowUpNotes(): Promise<Array<Note>>;
    getPracticeProfile(): Promise<PracticeProfile | null>;
    getProposals(clientId: string | null, stageFilter: string | null): Promise<Array<Proposal>>;
    getRateCards(): Promise<Array<RateCard>>;
    getReminders(doneFilter: boolean | null): Promise<Array<Reminder>>;
    getTimeEntries(engagementId: string | null, clientIdFilter: string | null): Promise<Array<TimeEntry>>;
    getUpcomingReminders(): Promise<Array<Reminder>>;
    getWeeklyTimesheet(engagementId: string, weekStart: Time): Promise<Array<TimeEntry>>;
    initializeSeedData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markFollowUpDone(id: string): Promise<boolean>;
    markReminderDone(id: string): Promise<boolean>;
    removeClient(id: string): Promise<void>;
    removeContact(id: string): Promise<void>;
    removeDeliverable(id: string): Promise<void>;
    removeDocument(id: string): Promise<void>;
    removeEngagement(id: string): Promise<void>;
    removeExpense(id: string): Promise<void>;
    removeInvoice(id: string): Promise<void>;
    removeNote(id: string): Promise<void>;
    removePayment(id: string): Promise<void>;
    removePracticeProfile(id: string): Promise<void>;
    removeProposal(id: string): Promise<void>;
    removeRateCard(id: string): Promise<void>;
    removeReminder(id: string): Promise<void>;
    removeTimeEntry(id: string): Promise<void>;
    schema(): Promise<string>;
    searchClientsContactsEngagements(searchTerm: string): Promise<{
        engagements: Array<Engagement>;
        contacts: Array<Contact>;
        clients: Array<Client>;
    }>;
    seedSampleData(): Promise<boolean>;
    updateClient(id: string, record: Client): Promise<Client | null>;
    updateContact(id: string, record: Contact): Promise<Contact | null>;
    updateContract(id: string, status: string | null, endDate: bigint | null, renewalDate: bigint | null, notes: string | null): Promise<Contract | null>;
    updateDeliverable(record: Deliverable): Promise<void>;
    updateDocument(doc: Document): Promise<void>;
    updateEngagement(record: Engagement): Promise<void>;
    updateExpense(record: Expense): Promise<void>;
    updateInvoice(id: string, status: string | null, notes: string | null, dueDate: bigint | null): Promise<Invoice | null>;
    updateNote(record: Note): Promise<void>;
    updateProposal(id: string, title: string | null, value: number | null, stage: string | null, notes: string | null): Promise<Proposal | null>;
    updateRateCard(id: string, record: RateCard): Promise<RateCard | null>;
    updateReminder(record: Reminder): Promise<void>;
    updateTimeEntry(record: TimeEntry): Promise<void>;
    upsertPracticeProfile(record: PracticeProfile): Promise<PracticeProfile>;
}
