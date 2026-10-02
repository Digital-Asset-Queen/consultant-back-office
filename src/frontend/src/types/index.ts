// Local types for the consultant back office app
// These match the Motoko backend entity shapes

export interface Client {
  id: string;
  name: string;
  company?: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  primaryContactId: string;
  createdAt?: bigint;
}

export interface Contact {
  id: string;
  clientId: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  lastContactDate?: bigint;
  notes?: string;
  type?: string;
  createdAt?: bigint;
}

export interface Engagement {
  id: string;
  clientId: string;
  name: string;
  status: string;
  startDate: bigint;
  endDate?: bigint;
  description?: string;
  contactId: string;
  profileId: string;
  healthStatus?: string;
  rateCardId?: string;
  createdAt?: bigint;
  title?: string;
  budget?: number;
  updatedAt?: bigint;
  contractStartDate?: bigint;
  contractEndDate?: bigint;
  contractValue?: number;
  estimatedValue?: number;
  stage?: string;
  lastActivityDate?: bigint;
  daysInStage?: number;
}

export interface Deliverable {
  id: string;
  engagementId: string;
  title: string;
  name?: string;
  status: string;
  notes?: string;
  dueDate?: bigint;
  createdAt?: bigint;
}

export interface TimeEntry {
  id: string;
  engagementId: string;
  date: bigint;
  description: string;
  hours: bigint;
  rateCardId: string;
  deliverableId: string;
  billable: boolean;
  createdAt: bigint;
}

export interface Expense {
  id: string;
  engagementId: string;
  description: string;
  amount: bigint;
  date: bigint;
  billable: boolean;
  category: string;
  createdAt: bigint;
}

export interface Invoice {
  id: string;
  engagementId?: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: bigint;
  dueDate: bigint;
  status: string;
  subtotalAmount: number;
  taxes: number;
  totalAmount: number;
  total?: number;
  notes?: string;
  paymentTerms: string;
  paymentMethod: string;
  contractId: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  createdAt?: bigint;
  updatedAt?: bigint;
}

export interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  paymentDate: bigint;
  date?: bigint;
  amount: number;
  method?: string;
  notes?: string;
  reference?: string;
  createdAt?: bigint;
}

export interface Note {
  id: string;
  engagementId?: string;
  clientId?: string;
  content: string;
  createdAt: bigint;
  isMeetingNote: boolean;
  followUp: boolean;
  reminderDate?: bigint;
  noteType?: string;
  followUpDate?: bigint;
  followUpDone?: boolean;
}

export interface Proposal {
  id: string;
  clientId: string;
  name: string;
  title?: string;
  description?: string;
  status: string;
  amount: number;
  notes: string;
  contactId?: string;
  engagementId?: string;
  submittedDate?: bigint;
  sentDate?: bigint;
  expiryDate?: bigint;
  followUpDate?: bigint;
  startDate?: bigint;
  endDate?: bigint;
  createdAt?: bigint;
  updatedAt?: bigint;
}

export interface RateCard {
  id: string;
  name: string;
  ratePerHour?: number;
  currency: string;
  hourlyRate?: bigint;
  dailyRate?: bigint;
  projectRate?: bigint;
  serviceName?: string;
  notes?: string;
  createdAt?: bigint;
}

export interface Reminder {
  id: string;
  engagementId: string;
  message: string;
  text?: string;
  dueDate: bigint;
  completed: boolean;
  completedAt?: bigint;
}

export interface PracticeProfile {
  id: string;
  name: string;
  practiceName: string;
  workStyle: string;
  hasExistingClients: boolean;
  billingAddress?: string;
}

export interface Document {
  id: string;
  title: string;
  name: string;
  docType: string;
  category: string;
  status: string;
  clientId?: string;
  engagementId?: string;
  notes?: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Contract {
  id: string;
  engagementId: string;
  status: string;
  startDate: bigint;
  endDate?: bigint;
  renewalDate?: bigint;
  notes?: string;
  createdAt: bigint;
}

// Dashboard types
export interface MonthlyFinancials {
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
}

export interface PipelineSummary {
  pipelineValue: number;
  pipelineWinRate: bigint;
  pipelineAverageValue?: number;
}

export interface DashboardData {
  monthlyFinancials: MonthlyFinancials;
  overdueInvoices: Invoice[];
  expiringContracts: bigint;
  unbilledTime: bigint;
  activeEngagements?: bigint;
  pipelineSummary: PipelineSummary | null;
  followUpsDueToday: Note[];
  followUpsDueThisWeek: Note[];
  recentActivity: Note[];
}

// Search result type — matches the grouped structure from searchClientsContactsEngagements
export interface SearchResult {
  id: string;
  type: string;
  name: string;
  detail?: string;
  clientId?: string;
  engagementId?: string;
}

// Backend search response — grouped by type
export interface SearchResults {
  clients: { id: string; name: string }[];
  engagements: { id: string; name: string; clientId: string }[];
  contacts: { id: string; name: string; role: string; clientId: string }[];
}
