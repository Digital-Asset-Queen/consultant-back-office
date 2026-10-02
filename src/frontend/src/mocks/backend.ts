import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const dayMs = BigInt(86_400_000) * BigInt(1_000_000);

const clients = [
  { id: "c1", name: "Apex Ventures", primaryContactId: "ct1", address: "123 Main St, New York, NY 10001", createdAt: now - dayMs * BigInt(90) },
  { id: "c2", name: "Meridian Group", primaryContactId: "ct2", address: "456 Park Ave, Chicago, IL 60601", createdAt: now - dayMs * BigInt(60) },
  { id: "c3", name: "Halcyon Private Equity", primaryContactId: "ct3", address: "789 Financial Dr, Boston, MA 02101", createdAt: now - dayMs * BigInt(45) },
];

const contacts = [
  { id: "ct1", clientId: "c1", name: "Sarah Chen", role: "CFO", email: "s.chen@apexventures.com", phone: "+1 212 555 0101", notes: "Prefers email. Key decision maker.", lastContactDate: now - dayMs * BigInt(5), createdAt: now - dayMs * BigInt(88) },
  { id: "ct2", clientId: "c2", name: "Marcus Webb", role: "Managing Director", email: "m.webb@meridiangroup.com", phone: "+1 312 555 0202", notes: "Call on Thursdays.", lastContactDate: now - dayMs * BigInt(12), createdAt: now - dayMs * BigInt(58) },
  { id: "ct3", clientId: "c3", name: "Diana Frost", role: "Partner", email: "d.frost@halcyon.com", phone: "+1 617 555 0303", notes: "Very responsive over email.", lastContactDate: now - dayMs * BigInt(3), createdAt: now - dayMs * BigInt(43) },
];

const engagements = [
  { id: "e1", clientId: "c1", contactId: "ct1", name: "Q2 Strategy Review", status: "active", profileId: "p1", description: "Quarterly strategic review and roadmap planning", startDate: now - dayMs * BigInt(30), endDate: now + dayMs * BigInt(60), createdAt: now - dayMs * BigInt(30) },
  { id: "e2", clientId: "c2", contactId: "ct2", name: "Market Entry Analysis", status: "active", profileId: "p1", description: "European market entry feasibility study", startDate: now - dayMs * BigInt(15), endDate: now + dayMs * BigInt(45), createdAt: now - dayMs * BigInt(15) },
  { id: "e3", clientId: "c3", contactId: "ct3", name: "Portfolio Restructuring", status: "completed", profileId: "p1", description: "PE portfolio company restructuring advisory", startDate: now - dayMs * BigInt(90), endDate: now - dayMs * BigInt(5), createdAt: now - dayMs * BigInt(90) },
];

const proposals = [
  { id: "pr1", clientId: "c1", contactId: "ct1", name: "Digital Transformation Programme", status: "sent", amount: 85_000, description: "Full digital transformation advisory", notes: "Follow up next week", createdAt: now - dayMs * BigInt(7) },
  { id: "pr2", clientId: "c2", contactId: "ct2", name: "Operational Efficiency Review", status: "won", amount: 42_000, description: "Ops efficiency and cost reduction", notes: "Converted to engagement", createdAt: now - dayMs * BigInt(20) },
  { id: "pr3", clientId: "c3", contactId: "ct3", name: "Board Advisory Retainer", status: "draft", amount: 120_000, description: "Ongoing board-level advisory", notes: "Awaiting final scope alignment", createdAt: now - dayMs * BigInt(3) },
];

const invoices = [
  {
    id: "inv1", clientId: "c1", engagementId: "e1", invoiceNumber: "INV-001",
    issueDate: now - dayMs * BigInt(30), dueDate: now - dayMs * BigInt(2),
    status: "overdue", subtotalAmount: 24_000, totalAmount: 26_400,
    taxes: 2_400, paymentMethod: "bank_transfer", paymentTerms: "Net 30",
    notes: "Q2 strategy phase 1", contractId: "", lineItems: [], createdAt: now - dayMs * BigInt(30),
  },
  {
    id: "inv2", clientId: "c2", engagementId: "e2", invoiceNumber: "INV-002",
    issueDate: now - dayMs * BigInt(10), dueDate: now + dayMs * BigInt(20),
    status: "sent", subtotalAmount: 18_000, totalAmount: 19_800,
    taxes: 1_800, paymentMethod: "bank_transfer", paymentTerms: "Net 30",
    notes: "Market analysis milestone 1", contractId: "", lineItems: [], createdAt: now - dayMs * BigInt(10),
  },
  {
    id: "inv3", clientId: "c3", engagementId: "e3", invoiceNumber: "INV-003",
    issueDate: now - dayMs * BigInt(5), dueDate: now + dayMs * BigInt(25),
    status: "paid", subtotalAmount: 48_000, totalAmount: 52_800,
    taxes: 4_800, paymentMethod: "wire", paymentTerms: "Net 30",
    notes: "Portfolio restructuring final", contractId: "", lineItems: [], createdAt: now - dayMs * BigInt(5),
  },
];

const timeEntries = [
  { id: "te1", engagementId: "e1", hours: BigInt(480), deliverableId: "", date: now - dayMs * BigInt(3), description: "Stakeholder interviews and synthesis", rateCardId: "rc1", createdAt: now - dayMs * BigInt(3), billable: true },
  { id: "te2", engagementId: "e1", hours: BigInt(360), deliverableId: "", date: now - dayMs * BigInt(2), description: "Strategy deck preparation", rateCardId: "rc1", createdAt: now - dayMs * BigInt(2), billable: true },
  { id: "te3", engagementId: "e2", hours: BigInt(600), deliverableId: "", date: now - dayMs * BigInt(5), description: "Market research and competitor analysis", rateCardId: "rc1", createdAt: now - dayMs * BigInt(5), billable: true },
  { id: "te4", engagementId: "e2", hours: BigInt(240), deliverableId: "", date: now - dayMs * BigInt(1), description: "Client workshop facilitation", rateCardId: "rc1", createdAt: now - dayMs * BigInt(1), billable: true },
];

const expenses = [
  { id: "ex1", engagementId: "e1", date: now - dayMs * BigInt(5), description: "Travel to client office", amount: BigInt(32000), createdAt: now - dayMs * BigInt(5), billable: true, category: "travel" },
  { id: "ex2", engagementId: "e2", date: now - dayMs * BigInt(3), description: "Research database access", amount: BigInt(15000), createdAt: now - dayMs * BigInt(3), billable: true, category: "software" },
];

const deliverables = [
  { id: "d1", engagementId: "e1", title: "Stakeholder Report", name: "Stakeholder Report", status: "in_progress", dueDate: now + dayMs * BigInt(14), notes: "First draft ready", createdAt: now - dayMs * BigInt(25) },
  { id: "d2", engagementId: "e1", title: "Strategy Presentation", name: "Strategy Presentation", status: "not_started", dueDate: now + dayMs * BigInt(28), notes: "", createdAt: now - dayMs * BigInt(25) },
  { id: "d3", engagementId: "e2", title: "Market Entry Report", name: "Market Entry Report", status: "in_progress", dueDate: now + dayMs * BigInt(21), notes: "Section 2 in progress", createdAt: now - dayMs * BigInt(10) },
];

const documents = [
  { id: "doc1", clientId: "c1", engagementId: "e1", title: "NDA — Apex Ventures", name: "NDA — Apex Ventures", docType: "NDA", category: "legal", status: "signed", createdAt: now - dayMs * BigInt(35), updatedAt: now - dayMs * BigInt(35), notes: "Fully executed" },
  { id: "doc2", clientId: "c2", engagementId: "e2", title: "Services Agreement — Meridian", name: "Services Agreement — Meridian", docType: "Contract", category: "legal", status: "signed", createdAt: now - dayMs * BigInt(18), updatedAt: now - dayMs * BigInt(18), notes: "Net 45 payment terms" },
  { id: "doc3", clientId: "c3", engagementId: "e3", title: "Final Deliverable Sign-Off", name: "Final Deliverable Sign-Off", docType: "Sign-Off", category: "deliverable", status: "draft", createdAt: now - dayMs * BigInt(7), updatedAt: now - dayMs * BigInt(2), notes: "Awaiting client signature" },
];

const payments = [
  { id: "pay1", clientId: "c3", invoiceId: "inv3", paymentDate: now - dayMs * BigInt(2), date: now - dayMs * BigInt(2), amount: 52_800, method: "wire", createdAt: now - dayMs * BigInt(2) },
];

const rateCards = [
  { id: "rc1", name: "Standard Day Rate", serviceName: "Advisory", hourlyRate: BigInt(25000), dailyRate: BigInt(200000), currency: "USD", createdAt: now - dayMs * BigInt(100) },
];

const practiceProfiles = [
  { id: "p1", name: "Alex Morgan", practiceName: "Morgan Advisory", billingAddress: "100 Consultant Ave, NY", workStyle: "project", hasExistingClients: true, contactId: "", createdAt: now - dayMs * BigInt(180), currency: "USD" },
];

const notes = [
  { id: "n1", clientId: "c1", engagementId: "e1", content: "Initial kickoff call went well. Client is aligned on scope.", createdAt: now - dayMs * BigInt(28), isMeetingNote: true, followUp: false, noteType: "meeting", followUpDone: false },
  { id: "n2", clientId: "c2", engagementId: "e2", content: "Need to follow up on competitor analysis section.", createdAt: now - dayMs * BigInt(10), isMeetingNote: false, followUp: true, reminderDate: now + dayMs * BigInt(2), noteType: "follow_up", followUpDone: false },
  { id: "n3", clientId: "c1", engagementId: "", content: "General client check-in — Apex Ventures quarterly review scheduled.", createdAt: now - dayMs * BigInt(5), isMeetingNote: false, followUp: false, noteType: "general", followUpDone: false },
];

const reminders = [
  { id: "r1", engagementId: "e1", message: "Submit stakeholder report draft", text: "Submit stakeholder report draft", dueDate: now + dayMs * BigInt(3), completed: false, done: false, createdAt: now - dayMs * BigInt(10) },
  { id: "r2", engagementId: "e2", message: "Schedule client workshop", text: "Schedule client workshop", dueDate: now + dayMs * BigInt(1), completed: false, done: false, createdAt: now - dayMs * BigInt(5) },
];

export const mockBackend: backendInterface = {
  addUpdateClient: async () => undefined,
  addUpdateContact: async () => undefined,
  addUpdateDeliverable: async () => undefined,
  addUpdateDocument: async () => undefined,
  addUpdateEngagement: async () => undefined,
  addUpdateExpense: async () => undefined,
  addUpdateInvoice: async () => undefined,
  addUpdateNote: async () => undefined,
  addUpdatePayment: async () => undefined,
  addUpdatePracticeProfile: async () => undefined,
  addUpdateProposal: async () => undefined,
  addUpdateRateCard: async () => undefined,
  addUpdateReminder: async () => undefined,
  addUpdateTimeEntry: async () => undefined,
  assignCallerUserRole: async () => undefined,
  closeOutEngagement: async () => undefined,
  convertProposalToEngagement: async () => "e_new",
  getAllClients: async () => clients,
  getAllContacts: async () => contacts,
  getAllContactsByClient: async (clientId) => contacts.filter(c => c.clientId === clientId),
  getAllDeliverablesByEngagement: async (eid) => deliverables.filter(d => d.engagementId === eid),
  getAllDocuments: async () => documents,
  getAllEngagements: async () => engagements,
  getAllEngagementsByClient: async (clientId) => engagements.filter(e => e.clientId === clientId),
  getAllEngagementsByContact: async (contactId) => engagements.filter(e => e.contactId === contactId),
  getAllExpensesByEngagement: async (eid) => expenses.filter(ex => ex.engagementId === eid),
  getAllInvoices: async () => invoices,
  getAllInvoicesByClient: async (clientId) => invoices.filter(i => i.clientId === clientId),
  getAllInvoicesByEngagement: async (eid) => invoices.filter(i => i.engagementId === eid),
  getAllNotesByClient: async (clientId) => notes.filter(n => n.clientId === clientId),
  getAllNotesByEngagement: async (engagementId) => notes.filter(n => n.engagementId === engagementId),
  getAllPaymentsByClient: async (clientId) => payments.filter(p => p.clientId === clientId),
  getAllPaymentsByInvoice: async (invoiceId) => payments.filter(p => p.invoiceId === invoiceId),
  getAllPracticeProfiles: async () => practiceProfiles,
  getAllProposals: async () => proposals,
  getAllProposalsByContact: async (contactId) => proposals.filter(p => p.contactId === contactId),
  getAllRateCards: async () => rateCards,
  getAllRemindersByEngagement: async (eid) => reminders.filter(r => r.engagementId === eid),
  getAllTimeEntriesByEngagement: async (eid) => timeEntries.filter(t => t.engagementId === eid),
  getCallerUserRole: async () => "admin" as never,
  getDashboardData: async () => ({
    monthlyFinancials: {
      totalInvoiced: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
      totalCollected: payments.reduce((sum, p) => sum + p.amount, 0),
      totalOutstanding: invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.totalAmount, 0),
    },
    overdueInvoices: invoices.filter(i => i.status === "overdue"),
    activeEngagements: BigInt(engagements.filter(e => e.status === "active").length),
    pipelineSummary: {
      pipelineValue: proposals.filter(p => p.status !== "won" && p.status !== "lost").reduce((sum, p) => sum + p.amount, 0),
      pipelineAverageValue: proposals.length > 0 ? proposals.reduce((sum, p) => sum + p.amount, 0) / proposals.length : 0,
      pipelineWinRate: BigInt(33),
    },
    followUpsDueToday: reminders.filter(r => !r.completed && Number(r.dueDate / dayMs) === Number(now / dayMs)),
    unbilledTime: timeEntries.reduce((sum, t) => sum + t.hours, 0n),
    recentActivity: notes.slice(0, 6),
    followUpsDueThisWeek: reminders.filter(r => !r.completed),
    expiringContracts: BigInt(0),
  }),
  getOutstandingInvoices: async () => invoices.filter(i => i.status !== "paid"),
  getPendingFollowUpNotes: async () => notes.filter(n => n.followUp),
  getUpcomingReminders: async () => reminders.filter(r => !r.completed),
  getWeeklyTimesheet: async (eid, _weekStart) => timeEntries.filter(t => t.engagementId === eid),
  initializeSeedData: async () => undefined,
  _initializeAccessControl: async () => undefined,
  isCallerAdmin: async () => true,
  markFollowUpDone: async () => true,
  markReminderDone: async () => true,
  removeClient: async () => undefined,
  removeContact: async () => undefined,
  removeDeliverable: async () => undefined,
  removeDocument: async () => undefined,
  removeEngagement: async () => undefined,
  removeExpense: async () => undefined,
  removeInvoice: async () => undefined,
  removeNote: async () => undefined,
  removePayment: async () => undefined,
  removePracticeProfile: async () => undefined,
  removeProposal: async () => undefined,
  removeRateCard: async () => undefined,
  removeReminder: async () => undefined,
  removeTimeEntry: async () => undefined,
  searchClientsContactsEngagements: async (term) => ({
    clients: clients.filter(c => c.name.toLowerCase().includes(term.toLowerCase())),
    contacts: contacts.filter(c => c.name.toLowerCase().includes(term.toLowerCase())),
    engagements: engagements.filter(e => e.name.toLowerCase().includes(term.toLowerCase())),
  }),
  createClient: async (r) => r,
  createContact: async (r) => r,
  createContract: async (engId, status, startDate, endDate, renewalDate, notes_) => ({ id: "ctr_new", engagementId: engId, status, startDate, endDate: endDate ?? undefined, renewalDate: renewalDate ?? undefined, notes: notes_ ?? undefined, createdAt: now }),
  createDeliverable: async () => undefined,
  createDocument: async () => undefined,
  createEngagement: async () => undefined,
  createExpense: async () => undefined,
  createInvoice: async (clientId, engagementId, dueDate, notes_, lineItems_) => ({ id: "inv_new", clientId, engagementId: engagementId ?? undefined, dueDate, notes: notes_ ?? undefined, lineItems: lineItems_, issueDate: now, status: "draft", taxes: 0, paymentMethod: "", subtotalAmount: 0, createdAt: now, invoiceNumber: "INV-NEW", totalAmount: 0, paymentTerms: "Net 30", contractId: "" }),
  createNote: async () => undefined,
  createPayment: async (invoiceId, date, amount, method, notes_) => ({ id: "pay_new", invoiceId, date, amount: amount ?? 0, method: method ?? undefined, notes: notes_ ?? undefined, clientId: "", paymentDate: date, createdAt: now }),
  createProposal: async (clientId, title, value, stage, notes_) => ({ id: "pr_new", clientId, name: title, amount: value ?? 0, status: stage, description: "", notes: notes_ ?? "", contactId: "", createdAt: now }),
  createRateCard: async (r) => r,
  createReminder: async () => undefined,
  createTimeEntry: async () => undefined,
  deleteClient: async () => true,
  deleteContact: async () => true,
  deleteContract: async () => true,
  deleteDeliverable: async () => undefined,
  deleteDocument: async () => undefined,
  deleteEngagement: async () => undefined,
  deleteExpense: async () => undefined,
  deleteInvoice: async () => true,
  deleteNote: async () => undefined,
  deletePayment: async () => true,
  deleteProposal: async () => true,
  deleteRateCard: async () => true,
  deleteReminder: async () => undefined,
  deleteTimeEntry: async () => undefined,
  execute: async (_qJson: string) => ({ hasMore: false, rows: [] }),
  schema: async () => "{}",
  getClient: async (id) => clients.find(c => c.id === id) ?? null,
  getClients: async () => clients,
  getContacts: async (clientId) => clientId ? contacts.filter(c => c.clientId === clientId) : contacts,
  getContracts: async () => [],
  getDeliverables: async (eid) => deliverables.filter(d => d.engagementId === eid),
  getDocuments: async () => documents,
  getEngagement: async (id) => engagements.find(e => e.id === id) ?? null,
  getEngagements: async (clientId) => clientId ? engagements.filter(e => e.clientId === clientId) : engagements,
  getExpenses: async (eid) => eid ? expenses.filter(ex => ex.engagementId === eid) : expenses,
  getInvoice: async (id) => invoices.find(i => i.id === id) ?? null,
  getInvoices: async (clientId, statusFilter) => {
    let result = [...invoices];
    if (clientId) result = result.filter(i => i.clientId === clientId);
    if (statusFilter) result = result.filter(i => i.status === statusFilter);
    return result;
  },
  getNextInvoiceNumber: async () => "INV-004",
  getNotes: async (clientId, engagementId) => {
    let result = [...notes];
    if (clientId) result = result.filter(n => n.clientId === clientId);
    if (engagementId) result = result.filter(n => n.engagementId === engagementId);
    return result;
  },
  getPayments: async (invoiceId) => payments.filter(p => p.invoiceId === invoiceId),
  getPracticeProfile: async () => practiceProfiles[0] ?? null,
  getProposals: async (clientId, stageFilter) => {
    let result = [...proposals];
    if (clientId) result = result.filter(p => p.clientId === clientId);
    if (stageFilter) result = result.filter(p => p.status === stageFilter);
    return result;
  },
  getRateCards: async () => rateCards,
  getReminders: async (doneFilter) => {
    if (doneFilter === null) return reminders;
    return reminders.filter(r => r.done === doneFilter);
  },
  getTimeEntries: async (eid) => eid ? timeEntries.filter(t => t.engagementId === eid) : timeEntries,
  seedSampleData: async () => true,
  updateClient: async (id, r) => ({ ...r, id }),
  updateContact: async (id, r) => ({ ...r, id }),
  updateContract: async (id, status, endDate, renewalDate, notes_) => ({ id, engagementId: "", status: status ?? "active", startDate: now, endDate: endDate ?? undefined, renewalDate: renewalDate ?? undefined, notes: notes_ ?? undefined, createdAt: now }),
  updateDeliverable: async () => undefined,
  updateDocument: async () => undefined,
  updateEngagement: async () => undefined,
  updateExpense: async () => undefined,
  updateInvoice: async (id, status, notes_, dueDate) => invoices.find(i => i.id === id) ? { ...invoices.find(i => i.id === id)!, status: status ?? "draft", notes: notes_ ?? undefined, dueDate: dueDate ?? now } : null,
  updateNote: async () => undefined,
  updateProposal: async (id, title, value, stage, notes_) => proposals.find(p => p.id === id) ? { ...proposals.find(p => p.id === id)!, name: title ?? "", amount: value ?? 0, status: stage ?? "draft", notes: notes_ ?? "" } : null,
  updateRateCard: async (id, r) => ({ ...r, id }),
  updateReminder: async () => undefined,
  updateTimeEntry: async () => undefined,
  upsertPracticeProfile: async (r) => r,
};
