/**
 * Bilingual Thai/English translation dictionary for the Consultant Back Office.
 *
 * Organized by namespace. Each key maps to { en, th }.
 * Page tasks import keys via: import { t } from "@/i18n/LanguageContext";
 * then call t("namespace.key") or t("namespace.key", { count: 3 }).
 *
 * Convention:
 *  - Keys are flat dotted strings ("common.cancel") for O(1) lookup.
 *  - Placeholders use {name} syntax, resolved by t(key, vars).
 *  - Status / category / type values that come from the backend are translated
 *    via dedicated "status.*", "expenseCategory.*", "docType.*", "noteType.*",
 *    "proposalStage.*", "invoiceStatus.*", "contractStatus.*", "paymentMethod.*",
 *    "arAging.*", and "relativeDate.*" namespaces.
 */

export type Language = "en" | "th";

export interface TranslationEntry {
  en: string;
  th: string;
}

export type TranslationDict = Record<string, TranslationEntry>;

/** Interpolation variables: { count: 3 } replaces {count} in the string. */
export type Vars = Record<string, string | number>;

export const translations: TranslationDict = {
  // ───────────────────────────── common ─────────────────────────────
  "common.cancel": { en: "Cancel", th: "ยกเลิก" },
  "common.save": { en: "Save", th: "บันทึก" },
  "common.saving": { en: "Saving…", th: "กำลังบันทึก…" },
  "common.delete": { en: "Delete", th: "ลบ" },
  "common.deleting": { en: "Deleting…", th: "กำลังลบ…" },
  "common.confirm": { en: "Confirm", th: "ยืนยัน" },
  "common.new": { en: "New", th: "เพิ่ม" },
  "common.add": { en: "Add", th: "เพิ่ม" },
  "common.edit": { en: "Edit", th: "แก้ไข" },
  "common.update": { en: "Update", th: "อัปเดต" },
  "common.close": { en: "Close", th: "ปิด" },
  "common.search": { en: "Search…", th: "ค้นหา…" },
  "common.all": { en: "All", th: "ทั้งหมด" },
  "common.allClients": { en: "All clients", th: "ลูกค้าทั้งหมด" },
  "common.allEngagements": { en: "All engagements", th: "งานทั้งหมด" },
  "common.allStatuses": { en: "All statuses", th: "สถานะทั้งหมด" },
  "common.allTypes": { en: "All types", th: "ประเภททั้งหมด" },
  "common.selectClient": { en: "Select client…", th: "เลือกลูกค้า…" },
  "common.selectEngagement": { en: "Select engagement…", th: "เลือกงาน…" },
  "common.select": { en: "Select…", th: "เลือก…" },
  "common.none": { en: "None", th: "ไม่มี" },
  "common.optional": { en: "Optional", th: "ไม่บังคับ" },
  "common.optionalNotes": { en: "Optional notes", th: "หมายเหตุ (ไม่บังคับ)" },
  "common.required": { en: "Required", th: "จำเป็น" },
  "common.name": { en: "Name", th: "ชื่อ" },
  "common.email": { en: "Email", th: "อีเมล" },
  "common.phone": { en: "Phone", th: "เบอร์โทร" },
  "common.client": { en: "Client", th: "ลูกค้า" },
  "common.clients": { en: "Clients", th: "ลูกค้า" },
  "common.engagement": { en: "Engagement", th: "งาน" },
  "common.engagements": { en: "Engagements", th: "งาน" },
  "common.status": { en: "Status", th: "สถานะ" },
  "common.amount": { en: "Amount", th: "จำนวนเงิน" },
  "common.date": { en: "Date", th: "วันที่" },
  "common.description": { en: "Description", th: "รายละเอียด" },
  "common.notes": { en: "Notes", th: "หมายเหตุ" },
  "common.total": { en: "Total", th: "รวม" },
  "common.subtotal": { en: "Subtotal", th: "รวมย่อย" },
  "common.currency": { en: "Currency", th: "สกุลเงิน" },
  "common.category": { en: "Category", th: "หมวดหมู่" },
  "common.type": { en: "Type", th: "ประเภท" },
  "common.title": { en: "Title", th: "ชื่อเรื่อง" },
  "common.role": { en: "Role", th: "ตำแหน่ง" },
  "common.website": { en: "Website", th: "เว็บไซต์" },
  "common.address": { en: "Address", th: "ที่อยู่" },
  "common.hours": { en: "Hours", th: "ชั่วโมง" },
  "common.hrs": { en: "Hrs", th: "ชม." },
  "common.qty": { en: "Qty", th: "จำนวน" },
  "common.unitPrice": { en: "Unit Price", th: "ราคาต่อหน่วย" },
  "common.startDate": { en: "Start Date", th: "วันที่เริ่ม" },
  "common.endDate": { en: "End Date", th: "วันที่สิ้นสุด" },
  "common.dueDate": { en: "Due Date", th: "วันครบกำหนด" },
  "common.issueDate": { en: "Issue Date", th: "วันที่ออก" },
  "common.sentDate": { en: "Sent", th: "วันที่ส่ง" },
  "common.validUntil": { en: "Valid Until", th: "ใช้ได้ถึง" },
  "common.lastContact": { en: "Last Contact", th: "ติดต่อล่าสุด" },
  "common.added": { en: "Added", th: "วันที่เพิ่ม" },
  "common.records": { en: "{count} records", th: "{count} รายการ" },
  "common.records_one": { en: "{count} record", th: "{count} รายการ" },
  "common.noRecords": { en: "No records found", th: "ไม่พบรายการ" },
  "common.noItems": { en: "No items", th: "ไม่มีรายการ" },
  "common.view": { en: "View", th: "ดู" },
  "common.board": { en: "Board", th: "บอร์ด" },
  "common.list": { en: "List", th: "รายการ" },
  "common.advance": { en: "Advance", th: "เลื่อนขั้น" },
  "common.lost": { en: "Lost", th: "เสีย" },
  "common.overdue": { en: "Overdue", th: "เกินกำหนด" },
  "common.expiring": { en: "Expiring", th: "ใกล้หมดอายุ" },
  "common.expired": { en: "Expired", th: "หมดอายุ" },
  "common.active": { en: "Active", th: "ใช้งานอยู่" },
  "common.independent": { en: "Independent", th: "อิสระ" },
  "common.contact": { en: "Contact", th: "ผู้ติดต่อ" },
  "common.contacts": { en: "Contacts", th: "ผู้ติดต่อ" },
  "common.moreDetails": { en: "+ More details", th: "+ รายละเอียดเพิ่มเติม" },
  "common.lessDetails": { en: "− Less details", th: "− รายละเอียดน้อยลง" },
  "common.companyIndustry": {
    en: "Company / Industry",
    th: "บริษัท / อุตสาหกรรม",
  },
  "common.internalNotes": { en: "Internal Notes", th: "หมายเหตุภายใน" },
  "common.recentNotes": { en: "Recent Notes", th: "หมายเหตุล่าสุด" },
  "common.details": { en: "Details", th: "รายละเอียด" },
  "common.started": { en: "Started", th: "เริ่มเมื่อ" },
  "common.renewalDate": { en: "Renewal Date", th: "วันต่ออายุ" },
  "common.lineItems": { en: "Line Items", th: "รายการ" },
  "common.addRow": { en: "Add Row", th: "เพิ่มแถว" },
  "common.removeLine": { en: "Remove line", th: "ลบแถว" },
  "common.paymentHistory": { en: "Payment History", th: "ประวัติการชำระ" },
  "common.recordPayment": { en: "Record Payment", th: "บันทึกการชำระ" },
  "common.record": { en: "Record", th: "บันทึก" },
  "common.method": { en: "Method", th: "วิธีการ" },
  "common.reference": { en: "Reference", th: "อ้างอิง" },
  "common.noPayments": { en: "No payments recorded.", th: "ยังไม่มีการชำระเงิน" },
  "common.paymentTerms": { en: "Payment Terms", th: "เงื่อนไขการชำระ" },
  "common.paymentMethod": { en: "Payment Method", th: "วิธีการชำระเงิน" },
  "common.invoice": { en: "Invoice", th: "ใบแจ้งหนี้" },
  "common.invoices": { en: "Invoices", th: "ใบแจ้งหนี้" },
  "common.proposal": { en: "Proposal", th: "ข้อเสนอ" },
  "common.proposals": { en: "Proposals", th: "ข้อเสนอ" },
  "common.contract": { en: "Contract", th: "สัญญา" },
  "common.contracts": { en: "Contracts", th: "สัญญา" },
  "common.document": { en: "Document", th: "เอกสาร" },
  "common.documents": { en: "Documents", th: "เอกสาร" },
  "common.note": { en: "Note", th: "บันทึก" },
  "common.notes_plural": { en: "Notes", th: "บันทึก" },
  "common.expense": { en: "Expense", th: "ค่าใช้จ่าย" },
  "common.expenses": { en: "Expenses", th: "ค่าใช้จ่าย" },
  "common.timeEntry": { en: "Time Entry", th: "การบันทึกเวลา" },
  "common.timeEntries": { en: "Time Entries", th: "การบันทึกเวลา" },
  "common.logTime": { en: "Log Time", th: "บันทึกเวลา" },
  "common.addExpense": { en: "Add Expense", th: "เพิ่มค่าใช้จ่าย" },
  "common.addNote": { en: "Add Note", th: "เพิ่มบันทึก" },
  "common.addDocument": { en: "Add Document", th: "เพิ่มเอกสาร" },
  "common.newInvoice": { en: "New Invoice", th: "ใบแจ้งหนี้ใหม่" },
  "common.newProposal": { en: "New Proposal", th: "ข้อเสนอใหม่" },
  "common.newContract": { en: "New Contract", th: "สัญญาใหม่" },
  "common.newClient": { en: "New Client", th: "ลูกค้าใหม่" },
  "common.newEngagement": { en: "New Engagement", th: "งานใหม่" },
  "common.newContact": { en: "New Contact", th: "ผู้ติดต่อใหม่" },
  "common.editContact": { en: "Edit Contact", th: "แก้ไขผู้ติดต่อ" },
  "common.newRateCard": { en: "New rate card", th: "ราคาฐานใหม่" },
  "common.editRateCard": { en: "Edit rate card", th: "แก้ไขราคาฐาน" },
  "common.addRateCard": { en: "Add rate card", th: "เพิ่มราคาฐาน" },
  "common.saveInvoice": { en: "Save Invoice", th: "บันทึกใบแจ้งหนี้" },
  "common.saveProposal": { en: "Save Proposal", th: "บันทึกข้อเสนอ" },
  "common.saveSettings": { en: "Save settings", th: "บันทึกการตั้งค่า" },
  "common.addProposal": { en: "Add Proposal", th: "เพิ่มข้อเสนอ" },
  "common.addDocument_short": { en: "Add Document", th: "เพิ่มเอกสาร" },
  "common.invoiceNumber": { en: "Invoice Number", th: "เลขที่ใบแจ้งหนี้" },
  "common.proposalName": { en: "Proposal Name", th: "ชื่อข้อเสนอ" },
  "common.valueUSD": { en: "Value (USD)", th: "มูลค่า (USD)" },
  "common.amountUSD": { en: "Amount (USD)", th: "จำนวนเงิน (USD)" },
  "common.expectedCloseDate": {
    en: "Expected Close Date",
    th: "วันที่คาดว่าจะปิดงาน",
  },
  "common.titleDescription": {
    en: "Title / Description",
    th: "ชื่อเรื่อง / รายละเอียด",
  },
  "common.hourlyRate": { en: "Hourly rate", th: "อัตราต่อชั่วโมง" },
  "common.dailyRate": { en: "Daily rate", th: "อัตราต่อวัน" },
  "common.projectRate": { en: "Project rate", th: "อัตราต่อโครงการ" },
  "common.defaultHourlyRate": {
    en: "Default Hourly Rate",
    th: "อัตราต่อชั่วโมงเริ่มต้น",
  },
  "common.defaultCurrency": { en: "Default Currency", th: "สกุลเงินเริ่มต้น" },
  "common.fiscalYearStart": { en: "Fiscal Year Start", th: "ต้นปีงบประมาณ" },
  "common.yourName": { en: "Your Name", th: "ชื่อของคุณ" },
  "common.practiceName": {
    en: "Practice / Company Name",
    th: "ชื่อสำนักงาน / บริษัท",
  },
  "common.generalSettings": { en: "General Settings", th: "ตั้งค่าทั่วไป" },
  "common.rateCards": { en: "Rate Cards", th: "ราคาฐาน" },
  "common.hourly": { en: "Hourly", th: "รายชั่วโมง" },
  "common.daily": { en: "Daily", th: "รายวัน" },
  "common.project": { en: "Project", th: "โครงการ" },
  "common.perHour": { en: "/hr", th: "/ชม." },
  "common.perDay": { en: "/day", th: "/วัน" },
  "common.perProject": { en: "/project", th: "/โครงการ" },
  "common.totalHours": { en: "Total Hours", th: "ชั่วโมงรวม" },
  "common.totalExpenses": { en: "Total Expenses", th: "ค่าใช้จ่ายรวม" },
  "common.totalInvoiced": { en: "Total Invoiced", th: "ยอดแจ้งหนี้รวม" },
  "common.collected": { en: "Collected", th: "เรียกเก็บแล้ว" },
  "common.outstanding": { en: "Outstanding", th: "ค้างชำระ" },
  "common.overdueAmount": { en: "Overdue", th: "เกินกำหนด" },
  "common.winRate": { en: "Win Rate", th: "อัตราการชนะ" },
  "common.activeClients": { en: "Active Clients", th: "ลูกค้าที่ใช้งาน" },
  "common.activeEngagements": { en: "Active Engagements", th: "งานที่ดำเนินอยู่" },
  "common.openProposals": { en: "Open Proposals", th: "ข้อเสนอที่เปิดอยู่" },
  "common.pipelineValue": { en: "Pipeline Value", th: "มูลค่าไปป์ไลน์" },
  "common.wonValue": { en: "Won Value", th: "มูลค่าที่ชนะ" },
  "common.totalValue": { en: "Total Value", th: "มูลค่ารวม" },
  "common.activeCount": { en: "Active", th: "ใช้งานอยู่" },
  "common.expiringSoon": { en: "Expiring Soon", th: "ใกล้หมดอายุ" },
  "common.expiredCount": { en: "Expired", th: "หมดอายุ" },
  "common.totalOutstanding": { en: "Total Outstanding", th: "ค้างชำระรวม" },
  "common.ageBucket": { en: "Age Bucket", th: "ช่วงอายุหนี้" },
  "common.revenueByClient": { en: "Revenue by Client", th: "รายได้ตามลูกค้า" },
  "common.arAgingByDueDate": {
    en: "AR Aging (by Due Date)",
    th: "อายุหนี้ค้างรับ (ตามวันครบกำหนด)",
  },
  "common.noEngagementOptional": {
    en: "No engagement (optional)",
    th: "ไม่ระบุงาน (ไม่บังคับ)",
  },
  "common.clientOptional": { en: "Client (optional)", th: "ลูกค้า (ไม่บังคับ)" },
  "common.engagementOptional": {
    en: "Engagement (optional)",
    th: "งาน (ไม่บังคับ)",
  },
  "common.noClient": { en: "No client", th: "ไม่มีลูกค้า" },
  "common.markDone": { en: "Done", th: "เสร็จ" },
  "common.confirmQuestion": { en: "Confirm?", th: "ยืนยัน?" },
  "common.removeReminder": { en: "Remove reminder", th: "ลบการแจ้งเตือน" },
  "common.markAsDone": { en: "Mark as done", th: "ทำเครื่องหมายว่าเสร็จแล้ว" },
  "common.addWithPlus": { en: "+ Add", th: "+ เพิ่ม" },
  "common.manageRateCards": { en: "Manage rate cards →", th: "จัดการราคาฐาน →" },
  "common.reminderMessage": { en: "Reminder message", th: "ข้อความแจ้งเตือน" },
  "common.followupsDue": { en: "Follow-ups Due", th: "งานติดตามครบกำหนด" },
  "common.upcomingReminders": {
    en: "Upcoming Reminders",
    th: "การแจ้งเตือนที่จะถึง",
  },
  "common.rateCardsSection": { en: "Rate Cards", th: "ราคาฐาน" },
  "common.requiresFollowUp": { en: "Requires follow-up", th: "ต้องติดตาม" },
  "common.followUpDate": { en: "Follow-up date", th: "วันที่ติดตาม" },
  "common.followUpNeeded": { en: "Follow-up needed", th: "ต้องติดตาม" },
  "common.followUpRequired": { en: "Follow-up required", th: "ต้องติดตาม" },
  "common.deleteThisNote": { en: "Delete this note?", th: "ลบบันทึกนี้?" },
  "common.deleteThisRecord": {
    en: "Delete this record? This cannot be undone.",
    th: "ลบรายการนี้? ไม่สามารถย้อนกลับได้",
  },
  "common.deleteThisRateCard": {
    en: "Delete this rate card? This cannot be undone.",
    th: "ลบราคาฐานนี้? ไม่สามารถย้อนกลับได้",
  },
  "common.capture": { en: "Capture", th: "บันทึก" },
  "common.quickCapture": { en: "Quick Capture", th: "บันทึกด่วน" },
  "common.whatHappened": {
    en: "What happened or needs to be remembered…",
    th: "เกิดอะไรขึ้น หรือต้องจำอะไร…",
  },
  "common.whatYouWorkedOn": { en: "What you worked on", th: "งานที่ทำ" },
  "common.travelMaterials": { en: "Travel, materials…", th: "เดินทาง, วัสดุ…" },
  "common.briefScope": {
    en: "Brief scope description…",
    th: "อธิบายขอบเขตโดยย่อ…",
  },
  "common.privateNotesAboutClient": {
    en: "Private notes about this client…",
    th: "หมายเหตุส่วนตัวเกี่ยวกับลูกค้ารายนี้…",
  },
  "common.writeYourNoteHere": {
    en: "Write your note here…",
    th: "เขียนบันทึกของคุณที่นี่…",
  },
  "common.searchNotes": { en: "Search notes…", th: "ค้นหาบันทึก…" },
  "common.optionalNotesEllipsis": {
    en: "Optional notes…",
    th: "หมายเหตุ (ไม่บังคับ)…",
  },
  "common.deleteNote": { en: "Delete note", th: "ลบบันทึก" },
  "common.record_one": { en: "record", th: "รายการ" },
  "common.record_other": { en: "records", th: "รายการ" },

  // ───────────────────────────── nav ─────────────────────────────
  "nav.dashboard": { en: "Dashboard", th: "แดชบอร์ด" },
  "nav.work": { en: "Work", th: "งาน" },
  "nav.bizdev": { en: "Business Dev", th: "พัฒนาธุรกิจ" },
  "nav.finance": { en: "Finance", th: "การเงิน" },
  "nav.admin": { en: "Admin", th: "ผู้ดูแลระบบ" },
  "nav.mainAria": { en: "Main navigation", th: "การนำทางหลัก" },
  "nav.mobileAria": { en: "Mobile navigation", th: "การนำทางบนมือถือ" },
  "nav.openNav": { en: "Open navigation", th: "เปิดเมนูนำทาง" },
  "nav.closeNav": { en: "Close navigation", th: "ปิดเมนูนำทาง" },
  "nav.backOffice": { en: "Back Office", th: "แบ็กออฟฟิศ" },
  "nav.consultantBackOffice": {
    en: "Consultant Back Office",
    th: "แบ็กออฟฟิศที่ปรึกษา",
  },

  // ───────────────────────────── module titles ─────────────────────────────
  "module.dashboard.title": { en: "Dashboard", th: "แดชบอร์ด" },
  "module.work.title": { en: "Work", th: "งาน" },
  "module.bizdev.title": { en: "Business Development", th: "พัฒนาธุรกิจ" },
  "module.finance.title": { en: "Finance", th: "การเงิน" },
  "module.admin.title": { en: "Admin", th: "ผู้ดูแลระบบ" },

  // ───────────────────────────── module tabs ─────────────────────────────
  "tab.dashboard.overview": { en: "Overview", th: "ภาพรวม" },
  "tab.dashboard.work": { en: "Work", th: "งาน" },
  "tab.dashboard.pipeline": { en: "Pipeline & BD", th: "ไปป์ไลน์และพัฒนาธุรกิจ" },
  "tab.dashboard.finance": { en: "Finance", th: "การเงิน" },
  "tab.dashboard.activity": { en: "Activity", th: "กิจกรรม" },
  "tab.work.clients": { en: "Clients", th: "ลูกค้า" },
  "tab.work.engagements": { en: "Engagements", th: "งาน" },
  "tab.work.time": { en: "Time & Expenses", th: "เวลาและค่าใช้จ่าย" },
  "tab.work.contacts": { en: "Contacts", th: "ผู้ติดต่อ" },
  "tab.bizdev.pipeline": { en: "Pipeline", th: "ไปป์ไลน์" },
  "tab.bizdev.proposals": { en: "Proposals", th: "ข้อเสนอ" },
  "tab.bizdev.communications": { en: "Communications", th: "การสื่อสาร" },
  "tab.finance.invoicing": { en: "Invoicing", th: "การแจ้งหนี้" },
  "tab.finance.contracts": { en: "Contracts", th: "สัญญา" },
  "tab.finance.documents": { en: "Documents", th: "เอกสาร" },
  "tab.finance.reports": { en: "Reports", th: "รายงาน" },
  "tab.admin.settings": { en: "Settings", th: "ตั้งค่า" },
  "tab.admin.rateCards": { en: "Rate Cards", th: "ราคาฐาน" },

  // ───────────────────────────── landing ─────────────────────────────
  "landing.eyebrow": {
    en: "The Independent Consultant's Back Office",
    th: "แบ็กออฟฟิศสำหรับที่ปรึกษาอิสระ",
  },
  "landing.heroLine1": { en: "Every client.", th: "ทุกลูกค้า" },
  "landing.heroLine2": { en: "Every engagement.", th: "ทุกงาน" },
  "landing.heroLine3": { en: "Under control.", th: "อยู่ในมือ" },
  "landing.heroSub": {
    en: "A private back office built for the way independent consultants actually work.",
    th: "แบ็กออฟฟิศส่วนตัวที่ออกแบบตามวิธีทำงานจริงของที่ปรึกษาอิสระ",
  },
  "landing.cta": { en: "Open Your Back Office", th: "เปิดแบ็กออฟฟิศของคุณ" },
  "landing.whyItWorks": { en: "Why it works", th: "ทำไมถึงใช้ได้จริง" },
  "landing.builtFor": {
    en: "Built for how consultants actually operate",
    th: "สร้างมาตามวิธีทำงานจริงของที่ปรึกษา",
  },
  "landing.feature1Title": {
    en: "Everything in one place",
    th: "ทุกอย่างในที่เดียว",
  },
  "landing.feature1Body": {
    en: "Clients, engagements, contracts, invoices, and notes — unified in a single workspace designed around how you actually work.",
    th: "ลูกค้า งาน สัญญา ใบแจ้งหนี้ และบันทึก — รวมในพื้นที่เดียวที่ออกแบบตามวิธีทำงานของคุณ",
  },
  "landing.feature2Title": {
    en: "Your data, your control",
    th: "ข้อมูลของคุณ คุณควบคุม",
  },
  "landing.feature2Body": {
    en: "Runs on the Internet Computer. No third-party servers. No subscriptions to your own information. Complete ownership.",
    th: "ทำงานบน Internet Computer ไม่มีเซิร์ฟเวอร์ของบุคคลที่สาม ไม่ต้องเสียค่าสมัครรับข้อมูลของตัวเอง เป็นเจ้าของข้อมูลอย่างสมบูรณ์",
  },
  "landing.feature3Title": {
    en: "Built around engagements",
    th: "สร้างรอบงาน",
  },
  "landing.feature3Body": {
    en: "Every record connects back to the work. Find any client, invoice, or note in seconds — from any angle.",
    th: "ทุกระเบียนเชื่อมกลับไปยังงาน ค้นหาลูกค้า ใบแจ้งหนี้ หรือบันทึกใดก็ได้ในไม่กี่วินาที — จากทุกมุม",
  },
  "landing.finalEyebrow": {
    en: "Private. Owned. Yours.",
    th: "ส่วนตัว เป็นของคุณ ของคุณ",
  },
  "landing.finalHeadline": {
    en: "Stop managing your practice across a dozen open tabs.",
    th: "เลิกจัดการสำนักงานของคุณผ่านแท็บที่เปิดค้างไว้เป็นโหล",
  },
  "landing.finalBody": {
    en: "Everything is here. Sign in and see exactly where your practice stands.",
    th: "ทุกอย่างอยู่ที่นี่ ลงชื่อเข้าใช้แล้วเห็นสถานะของสำนักงานคุณได้ทันที",
  },
  "landing.finalCta": { en: "Open Your Back Office", th: "เปิดแบ็กออฟฟิศของคุณ" },
  "landing.finalNote": {
    en: "Single user. No accounts. Your data, on your canister.",
    th: "ผู้ใช้คนเดียว ไม่ต้องสมัครสมาชิก ข้อมูลของคุณ บนแคนิสเตอร์ของคุณ",
  },
  "landing.builtWith": {
    en: "Built with ♥ using",
    th: "สร้างด้วย ♥ โดยใช้",
  },
  "landing.altHero": {
    en: "Consultant back office workspace illustration",
    th: "ภาพประกอบพื้นที่ทำงานแบ็กออฟฟิศที่ปรึกษา",
  },

  // ───────────────────────────── login ─────────────────────────────
  "login.title": { en: "The Back Office", th: "แบ็กออฟฟิศ" },
  "login.subtitle": {
    en: "Your private hub for clients, engagements, proposals, and invoices.",
    th: "ศูนย์กลางส่วนตัวสำหรับลูกค้า งาน ข้อเสนอ และใบแจ้งหนี้",
  },
  "login.signInToContinue": {
    en: "Sign in to continue",
    th: "ลงชื่อเข้าใช้เพื่อดำเนินการต่อ",
  },
  "login.yourDataPrivate": {
    en: "Your data is private and belongs entirely to you.",
    th: "ข้อมูลของคุณเป็นส่วนตัวและเป็นของคุณทั้งหมด",
  },
  "login.checkingSession": { en: "Checking session…", th: "กำลังตรวจสอบเซสชัน…" },
  "login.signingIn": { en: "Signing in…", th: "กำลังเข้าสู่ระบบ…" },
  "login.signInWithII": {
    en: "Sign in with Internet Identity",
    th: "เข้าสู่ระบบด้วย Internet Identity",
  },
  "login.signInFailed": {
    en: "Sign-in failed. Please try again.",
    th: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง",
  },
  "login.noPassword": {
    en: "No password required. Your identity is verified cryptographically — nothing is shared.",
    th: "ไม่ต้องใช้รหัสผ่าน ยืนยันตัวตนด้วยการเข้ารหัส — ไม่มีการแบ่งปันข้อมูลใดๆ",
  },

  // ───────────────────────────── app shell ─────────────────────────────
  "app.loading": { en: "Loading…", th: "กำลังโหลด…" },
  "app.connectionError": { en: "Connection Error", th: "ข้อผิดพลาดการเชื่อมต่อ" },
  "app.couldNotConnect": {
    en: "Could not connect to the backend. Please reload and try again.",
    th: "ไม่สามารถเชื่อมต่อกับแบ็กเอนด์ได้ กรุณารีโหลดแล้วลองอีกครั้ง",
  },
  "app.reload": { en: "Reload", th: "รีโหลด" },

  // ───────────────────────────── error boundary ─────────────────────────────
  "errorBoundary.title": {
    en: "Something went wrong",
    th: "เกิดข้อผิดพลาดบางอย่าง",
  },
  "errorBoundary.body": {
    en: "The app encountered an unexpected error. You can try reloading to recover.",
    th: "แอปพบข้อผิดพลาดที่ไม่คาดคิด คุณสามารถลองรีโหลดเพื่อกู้คืนได้",
  },
  "errorBoundary.reloadApp": { en: "Reload App", th: "รีโหลดแอป" },

  // ───────────────────────────── language switcher ─────────────────────────────
  "language.switcher.th": { en: "ไทย", th: "ไทย" },
  "language.switcher.en": { en: "EN", th: "EN" },
  "language.switcher.aria": {
    en: "Switch language",
    th: "สลับภาษา",
  },
  "language.switcher.ariaTH": { en: "Switch to Thai", th: "สลับเป็นภาษาไทย" },
  "language.switcher.ariaEN": {
    en: "Switch to English",
    th: "สลับเป็นภาษาอังกฤษ",
  },

  // ───────────────────────────── dashboard overview ─────────────────────────────
  "dashboard.overview.followupsEmpty": {
    en: "No follow-ups pending",
    th: "ไม่มีงานติดตามค้างอยู่",
  },
  "dashboard.overview.remindersEmpty": {
    en: "No upcoming reminders",
    th: "ไม่มีการแจ้งเตือนที่จะถึง",
  },
  "dashboard.overview.rateCardsEmpty": {
    en: "No rate cards configured",
    th: "ยังไม่ได้ตั้งค่าราคาฐาน",
  },
  "dashboard.overview.statClients": { en: "Clients", th: "ลูกค้า" },
  "dashboard.overview.statEngagements": { en: "Engagements", th: "งาน" },
  "dashboard.overview.statFollowups": { en: "Follow-ups", th: "งานติดตาม" },
  "dashboard.overview.statReminders": { en: "Reminders", th: "การแจ้งเตือน" },

  // ───────────────────────────── dashboard work tab ─────────────────────────────
  "dashboard.work.activeEngagements": {
    en: "Active Engagements",
    th: "งานที่ดำเนินอยู่",
  },
  "dashboard.work.activeCount": {
    en: "{count} active",
    th: "{count} งานกำลังทำ",
  },
  "dashboard.work.emptyEngagements": {
    en: "No active engagements",
    th: "ไม่มีงานที่ดำเนินอยู่",
  },
  "dashboard.work.emptyEngagementsBody": {
    en: "Start a new engagement to see it here.",
    th: "เริ่มงานใหม่เพื่อดูที่นี่",
  },
  "dashboard.work.recentTime": {
    en: "Recent Time Entries",
    th: "การบันทึกเวลาล่าสุด",
  },
  "dashboard.work.recentTimeCount": {
    en: "{count} shown",
    th: "แสดง {count} รายการ",
  },
  "dashboard.work.emptyTime": {
    en: "No time logged yet",
    th: "ยังไม่มีการบันทึกเวลา",
  },
  "dashboard.work.emptyTimeBody": {
    en: "Log hours on an engagement to see them here.",
    th: "บันทึกชั่วโมงในงานเพื่อดูที่นี่",
  },

  // ───────────────────────────── dashboard pipeline tab ─────────────────────────────
  "dashboard.pipeline.open": { en: "Open", th: "เปิดอยู่" },
  "dashboard.pipeline.won": { en: "Won", th: "ชนะ" },
  "dashboard.pipeline.lost": { en: "Lost", th: "เสีย" },
  "dashboard.pipeline.byStage": { en: "By Stage", th: "ตามขั้นตอน" },
  "dashboard.pipeline.recentProposals": {
    en: "Recent Proposals",
    th: "ข้อเสนอล่าสุด",
  },
  "dashboard.pipeline.empty": { en: "No proposals yet", th: "ยังไม่มีข้อเสนอ" },
  "dashboard.pipeline.emptyBody": {
    en: "Add proposals to track your pipeline.",
    th: "เพิ่มข้อเสนอเพื่อติดตามไปป์ไลน์ของคุณ",
  },

  // ───────────────────────────── dashboard finance tab ─────────────────────────────
  "dashboard.finance.outstandingInvoices": {
    en: "Outstanding Invoices",
    th: "ใบแจ้งหนี้ค้างชำระ",
  },
  "dashboard.finance.unpaidCount": {
    en: "{count} unpaid",
    th: "ค้างชำระ {count} ใบ",
  },
  "dashboard.finance.allPaid": { en: "All paid", th: "ชำระครบแล้ว" },
  "dashboard.finance.empty": {
    en: "No outstanding invoices",
    th: "ไม่มีใบแจ้งหนี้ค้างชำระ",
  },
  "dashboard.finance.emptyBody": {
    en: "All invoices are paid or there are none yet.",
    th: "ใบแจ้งหนี้ทั้งหมดชำระแล้ว หรือยังไม่มีใบแจ้งหนี้",
  },
  "dashboard.finance.daysOverdue": {
    en: "{count}d overdue",
    th: "เกินกำหนด {count} วัน",
  },
  "dashboard.finance.current": { en: "Current", th: "ปัจจุบัน" },
  "dashboard.finance.daysLabel": { en: "{bucket} days", th: "{bucket} วัน" },

  // ───────────────────────────── dashboard activity tab ─────────────────────────────
  "dashboard.activity.empty": { en: "No recent activity", th: "ไม่มีกิจกรรมล่าสุด" },
  "dashboard.activity.emptyBody": {
    en: "Log time, add notes, or create invoices to see activity here.",
    th: "บันทึกเวลา เพิ่มบันทึก หรือสร้างใบแจ้งหนี้เพื่อดูกิจกรรมที่นี่",
  },
  "dashboard.activity.invoiceLine": {
    en: "Invoice {number} — {status}",
    th: "ใบแจ้งหนี้ {number} — {status}",
  },

  // ───────────────────────────── work / clients ─────────────────────────────
  "clients.empty": { en: "No clients", th: "ไม่มีลูกค้า" },
  "clients.emptyBody": {
    en: "Add your first client to get started.",
    th: "เพิ่มลูกค้าแรกของคุณเพื่อเริ่มต้น",
  },
  "clients.selectClient": { en: "Select a client", th: "เลือกลูกค้า" },
  "clients.selectClientBody": {
    en: "Choose a client from the list to view details.",
    th: "เลือกลูกค้าจากรายการเพื่อดูรายละเอียด",
  },
  "clients.noEngagementsForClient": {
    en: "No engagements for this client.",
    th: "ไม่มีงานสำหรับลูกค้ารายนี้",
  },
  "clients.noInvoicesForClient": {
    en: "No invoices for this client.",
    th: "ไม่มีใบแจ้งหนี้สำหรับลูกค้ารายนี้",
  },
  "clients.noNotesForClient": {
    en: "No notes for this client.",
    th: "ไม่มีบันทึกสำหรับลูกค้ารายนี้",
  },
  "clients.placeholderName": { en: "Acme Corp", th: "บริษัท ABC" },
  "clients.placeholderEmail": {
    en: "contact@acme.com",
    th: "contact@acme.com",
  },
  "clients.placeholderPhone": { en: "+1 555 000 0000", th: "+66 2 000 0000" },
  "clients.placeholderIndustry": { en: "Technology", th: "เทคโนโลยี" },
  "clients.placeholderWebsite": {
    en: "https://acme.com",
    th: "https://acme.com",
  },
  "clients.placeholderAddress": {
    en: "123 Main St, City, Country",
    th: "123 ถนนหลัก เมือง ประเทศ",
  },

  // ───────────────────────────── work / engagements ─────────────────────────────
  "engagements.empty": { en: "No engagements", th: "ไม่มีงาน" },
  "engagements.emptyBody": {
    en: "Create your first engagement to get started.",
    th: "สร้างงานแรกของคุณเพื่อเริ่มต้น",
  },
  "engagements.selectEngagement": { en: "Select an engagement", th: "เลือกงาน" },
  "engagements.selectEngagementBody": {
    en: "Choose an engagement to view details.",
    th: "เลือกงานเพื่อดูรายละเอียด",
  },
  "engagements.placeholderName": {
    en: "Q4 Strategy Project",
    th: "โครงการกลยุทธ์ Q4",
  },
  "engagements.time.empty": { en: "No time entries", th: "ไม่มีการบันทึกเวลา" },
  "engagements.time.emptyBody": {
    en: "Log your first time entry above.",
    th: "บันทึกเวลาแรกของคุณด้านบน",
  },
  "engagements.expenses.empty": { en: "No expenses", th: "ไม่มีค่าใช้จ่าย" },
  "engagements.expenses.emptyBody": {
    en: "Add your first expense above.",
    th: "เพิ่มค่าใช้จ่ายแรกของคุณด้านบน",
  },

  // ───────────────────────────── work / time & expenses ─────────────────────────────
  "timeExpenses.time.empty": { en: "No time entries", th: "ไม่มีการบันทึกเวลา" },
  "timeExpenses.time.emptyBody": {
    en: "Log your first time entry to get started.",
    th: "บันทึกเวลาแรกของคุณเพื่อเริ่มต้น",
  },
  "timeExpenses.expense.empty": { en: "No expenses", th: "ไม่มีค่าใช้จ่าย" },
  "timeExpenses.expense.emptyBody": {
    en: "Add your first expense to get started.",
    th: "เพิ่มค่าใช้จ่ายแรกของคุณเพื่อเริ่มต้น",
  },
  "timeExpenses.time.saveFailed": {
    en: "Failed to save time entry. Please try again.",
    th: "บันทึกเวลาไม่สำเร็จ กรุณาลองอีกครั้ง",
  },
  "timeExpenses.expense.saveFailed": {
    en: "Failed to save expense. Please try again.",
    th: "บันทึกค่าใช้จ่ายไม่สำเร็จ กรุณาลองอีกครั้ง",
  },
  "timeExpenses.saving": { en: "Saving…", th: "กำลังบันทึก…" },
  "timeExpenses.noEntries": { en: "No entries.", th: "ไม่มีรายการ" },
  "timeExpenses.noExpenses": { en: "No expenses.", th: "ไม่มีค่าใช้จ่าย" },

  // ───────────────────────────── work / contacts ─────────────────────────────
  "contacts.empty": { en: "No contacts", th: "ไม่มีผู้ติดต่อ" },
  "contacts.emptyBody": {
    en: "Add your first contact to get started.",
    th: "เพิ่มผู้ติดต่อแรกของคุณเพื่อเริ่มต้น",
  },
  "contacts.emptyFiltered": {
    en: "No contacts match your filter.",
    th: "ไม่พบผู้ติดต่อที่ตรงกับตัวกรอง",
  },
  "contacts.placeholderName": { en: "Jane Smith", th: "สมหญิง ใจดี" },
  "contacts.placeholderRole": { en: "Head of Finance", th: "หัวหน้าฝ่ายการเงิน" },
  "contacts.placeholderEmail": {
    en: "jane@company.com",
    th: "jane@company.com",
  },
  "contacts.placeholderPhone": { en: "+1 555 000 0000", th: "+66 2 000 0000" },
  "contacts.placeholderNotes": { en: "Optional notes", th: "หมายเหตุ (ไม่บังคับ)" },

  // ───────────────────────────── bizdev / pipeline ─────────────────────────────
  "pipeline.empty": { en: "No proposals", th: "ไม่มีข้อเสนอ" },
  "pipeline.emptyBody": {
    en: "Add a proposal to start tracking your pipeline.",
    th: "เพิ่มข้อเสนอเพื่อเริ่มติดตามไปป์ไลน์ของคุณ",
  },
  "pipeline.noProposalsInColumn": { en: "No proposals", th: "ไม่มีข้อเสนอ" },
  "pipeline.viewModeAria": { en: "View mode", th: "โหมดมุมมอง" },
  "pipeline.advanceTitle": { en: "Move to {stage}", th: "ย้ายไป {stage}" },
  "pipeline.moveToLostTitle": { en: "Move to Lost", th: "ย้ายไป เสีย" },
  "pipeline.placeholderTitle": {
    en: "e.g. Q3 Strategy Engagement",
    th: "เช่น งานกลยุทธ์ Q3",
  },
  "pipeline.activeProposals": {
    en: "Active Proposals",
    th: "ข้อเสนอที่เปิดอยู่",
  },
  "pipeline.nextStage": { en: "next stage", th: "ขั้นถัดไป" },

  // ───────────────────────────── bizdev / proposals ─────────────────────────────
  "proposals.empty": { en: "No proposals", th: "ไม่มีข้อเสนอ" },
  "proposals.emptyBody": {
    en: "Add a proposal to track your pipeline.",
    th: "เพิ่มข้อเสนอเพื่อติดตามไปป์ไลน์ของคุณ",
  },
  "proposals.nameRequired": {
    en: "Name and client are required",
    th: "ต้องระบุชื่อและลูกค้า",
  },
  "proposals.added": { en: "Proposal added", th: "เพิ่มข้อเสนอแล้ว" },
  "proposals.addFailed": {
    en: "Failed to add proposal",
    th: "เพิ่มข้อเสนอไม่สำเร็จ",
  },
  "proposals.statusUpdated": { en: "Status updated", th: "อัปเดตสถานะแล้ว" },
  "proposals.statusUpdateFailed": {
    en: "Failed to update status",
    th: "อัปเดตสถานะไม่สำเร็จ",
  },
  "proposals.placeholderName": {
    en: "Website Redesign Project",
    th: "โครงการออกแบบเว็บไซต์ใหม่",
  },

  // ───────────────────────────── bizdev / communications ─────────────────────────────
  "communications.empty": { en: "No communications yet", th: "ยังไม่มีการสื่อสาร" },
  "communications.emptyBody": {
    en: "Add notes to keep track of client conversations.",
    th: "เพิ่มบันทึกเพื่อติดตามการสนทนากับลูกค้า",
  },
  "communications.emptyFiltered": {
    en: "No matching records",
    th: "ไม่พบรายการที่ตรง",
  },
  "communications.emptyFilteredBody": {
    en: "Try adjusting your filters or search term.",
    th: "ลองปรับตัวกรองหรือคำค้นหา",
  },
  "communications.contentRequired": {
    en: "Note content is required",
    th: "ต้องระบุเนื้อหาบันทึก",
  },
  "communications.added": { en: "Note added", th: "เพิ่มบันทึกแล้ว" },
  "communications.addFailed": {
    en: "Failed to add note",
    th: "เพิ่มบันทึกไม่สำเร็จ",
  },
  "communications.deleted": { en: "Note deleted", th: "ลบบันทึกแล้ว" },
  "communications.deleteFailed": {
    en: "Failed to delete note",
    th: "ลบบันทึกไม่สำเร็จ",
  },

  // ───────────────────────────── finance / invoicing ─────────────────────────────
  "invoicing.empty": { en: "No invoices", th: "ไม่มีใบแจ้งหนี้" },
  "invoicing.emptyBody": {
    en: "No invoices match the current filter.",
    th: "ไม่พบใบแจ้งหนี้ที่ตรงกับตัวกรอง",
  },
  "invoicing.selectInvoice": { en: "Select an invoice", th: "เลือกใบแจ้งหนี้" },
  "invoicing.selectInvoiceBody": {
    en: "Choose an invoice from the list to view details.",
    th: "เลือกใบแจ้งหนี้จากรายการเพื่อดูรายละเอียด",
  },
  "invoicing.placeholderDescription": { en: "Description", th: "รายละเอียด" },
  "invoicing.actionBarTitle": { en: "Invoices", th: "ใบแจ้งหนี้" },
  "invoicing.clientRequired": { en: "Client *", th: "ลูกค้า *" },
  "invoicing.invoiceNumberRequired": {
    en: "Invoice Number *",
    th: "เลขที่ใบแจ้งหนี้ *",
  },
  "invoicing.amountRequired": { en: "Amount *", th: "จำนวนเงิน *" },
  "invoicing.dateRequired": { en: "Date *", th: "วันที่ *" },
  "invoicing.paymentAmountPlaceholder": { en: "0.00", th: "0.00" },
  "invoicing.referenceOptional": { en: "Optional", th: "ไม่บังคับ" },

  // ───────────────────────────── finance / contracts ─────────────────────────────
  "contracts.empty": { en: "No contracts", th: "ไม่มีสัญญา" },
  "contracts.emptyBody": {
    en: "No contracts match the current filter.",
    th: "ไม่พบสัญญาที่ตรงกับตัวกรอง",
  },
  "contracts.selectContract": { en: "Select a contract", th: "เลือกสัญญา" },
  "contracts.selectContractBody": {
    en: "Choose a contract from the list to view details.",
    th: "เลือกสัญญาจากรายการเพื่อดูรายละเอียด",
  },
  "contracts.contractNumber": { en: "Contract #{id}", th: "สัญญา #{id}" },
  "contracts.expiringIn": {
    en: "Expiring in {count} day{plural} — renewal due soon",
    th: "จะหมดอายุใน {count} วัน — ถึงเวลาต่ออายุ",
  },
  "contracts.hasExpired": {
    en: "This contract has expired",
    th: "สัญญานี้หมดอายุแล้ว",
  },
  "contracts.actionBarTitle": { en: "Contracts", th: "สัญญา" },
  "contracts.total": { en: "Total", th: "รวม" },

  // ───────────────────────────── finance / documents ─────────────────────────────
  "documents.empty": { en: "No documents", th: "ไม่มีเอกสาร" },
  "documents.emptyBody": {
    en: "Add a document to start tracking your files.",
    th: "เพิ่มเอกสารเพื่อเริ่มติดตามไฟล์ของคุณ",
  },
  "documents.titleRequired": {
    en: "Document title is required",
    th: "ต้องระบุชื่อเอกสาร",
  },
  "documents.added": { en: "Document added", th: "เพิ่มเอกสารแล้ว" },
  "documents.addFailed": {
    en: "Failed to add document",
    th: "เพิ่มเอกสารไม่สำเร็จ",
  },
  "documents.placeholderTitle": {
    en: "Service Agreement 2026",
    th: "สัญญาให้บริการ 2569",
  },
  "documents.actionBarTitle": { en: "Documents", th: "เอกสาร" },
  "documents.addFormTitle": { en: "Add Document", th: "เพิ่มเอกสาร" },

  // ───────────────────────────── finance / reports ─────────────────────────────
  "reports.revenueEmpty": { en: "No revenue data", th: "ไม่มีข้อมูลรายได้" },
  "reports.revenueEmptyBody": {
    en: "Paid invoices will appear here.",
    th: "ใบแจ้งหนี้ที่ชำระแล้วจะแสดงที่นี่",
  },
  "reports.actionBarTitle": { en: "Reports", th: "รายงาน" },

  // ───────────────────────────── admin / settings ─────────────────────────────
  "settings.saved": { en: "Settings saved", th: "บันทึกการตั้งค่าแล้ว" },
  "settings.saveFailed": {
    en: "Failed to save settings",
    th: "บันทึกการตั้งค่าไม่สำเร็จ",
  },
  "settings.placeholderName": { en: "Alex Morgan", th: "สมชาย ใจดี" },
  "settings.placeholderEmail": {
    en: "alex@example.com",
    th: "alex@example.com",
  },
  "settings.placeholderPractice": {
    en: "Morgan Consulting",
    th: "สมชาย คอนซัลติ้ง",
  },
  "settings.placeholderHourly": { en: "150", th: "150" },

  // ───────────────────────────── admin / rate cards ─────────────────────────────
  "rateCards.empty": { en: "No rate cards yet", th: "ยังไม่มีราคาฐาน" },
  "rateCards.emptyBody": {
    en: "Add your first rate card to define billing rates for clients and engagements.",
    th: "เพิ่มราคาฐานแรกเพื่อกำหนดอัตราค่าบริการสำหรับลูกค้าและงาน",
  },
  "rateCards.nameRequired": { en: "Name is required", th: "ต้องระบุชื่อ" },
  "rateCards.added": { en: "Rate card added", th: "เพิ่มราคาฐานแล้ว" },
  "rateCards.updated": { en: "Rate card updated", th: "อัปเดตราคาฐานแล้ว" },
  "rateCards.saveFailed": {
    en: "Failed to save rate card",
    th: "บันทึกราคาฐานไม่สำเร็จ",
  },
  "rateCards.deleted": { en: "Rate card deleted", th: "ลบราคาฐานแล้ว" },
  "rateCards.deleteFailed": {
    en: "Failed to delete rate card",
    th: "ลบราคาฐานไม่สำเร็จ",
  },
  "rateCards.placeholderName": {
    en: "Standard hourly",
    th: "อัตรามาตรฐานรายชั่วโมง",
  },
  "rateCards.placeholderHourly": { en: "150", th: "150" },
  "rateCards.placeholderDaily": { en: "1200", th: "1200" },
  "rateCards.placeholderProject": { en: "8000", th: "8000" },
  "rateCards.ariaEdit": { en: "Edit", th: "แก้ไข" },
  "rateCards.ariaDelete": { en: "Delete", th: "ลบ" },

  // ───────────────────────────── quick capture ─────────────────────────────
  "quickCapture.selectEngagementError": {
    en: "Please select an engagement",
    th: "กรุณาเลือกงาน",
  },
  "quickCapture.captured": { en: "Note captured", th: "บันทึกแล้ว" },
  "quickCapture.captureFailed": {
    en: "Failed to capture note",
    th: "บันทึกไม่สำเร็จ",
  },

  // ───────────────────────────── status labels (backend values) ─────────────────────────────
  "status.active": { en: "Active", th: "ใช้งานอยู่" },
  "status.paused": { en: "Paused", th: "หยุดชั่วคราว" },
  "status.on-hold": { en: "On Hold", th: "ระงับไว้" },
  "status.on_hold": { en: "On Hold", th: "ระงับไว้" },
  "status.closed": { en: "Closed", th: "ปิดแล้ว" },
  "status.inactive": { en: "Inactive", th: "ไม่ใช้งาน" },
  "status.draft": { en: "Draft", th: "ร่าง" },
  "status.sent": { en: "Sent", th: "ส่งแล้ว" },
  "status.paid": { en: "Paid", th: "ชำระแล้ว" },
  "status.overdue": { en: "Overdue", th: "เกินกำหนด" },
  "status.cancelled": { en: "Cancelled", th: "ยกเลิก" },
  "status.signed": { en: "Signed", th: "ลงนามแล้ว" },
  "status.expired": { en: "Expired", th: "หมดอายุ" },
  "status.archived": { en: "Archived", th: "เก็บถาวร" },
  "status.lead": { en: "Lead", th: "เลด" },
  "status.qualified": { en: "Qualified", th: "ผ่านการคัดเลือก" },
  "status.proposal": { en: "Proposal Sent", th: "ส่งข้อเสนอแล้ว" },
  "status.negotiation": { en: "Negotiation", th: "เจรจา" },
  "status.negotiating": { en: "Negotiating", th: "กำลังเจรจา" },
  "status.won": { en: "Won", th: "ชนะ" },
  "status.accepted": { en: "Won", th: "ชนะ" },
  "status.rejected": { en: "Lost", th: "เสีย" },
  "status.lost": { en: "Lost", th: "เสีย" },
  "status.complete": { en: "Complete", th: "เสร็จสมบูรณ์" },
  "status.completed": { en: "Completed", th: "เสร็จสมบูรณ์" },
  "status.in progress": { en: "In Progress", th: "กำลังดำเนินการ" },
  "status.partial": { en: "Partial", th: "บางส่วน" },
  "status.at risk": { en: "At Risk", th: "มีความเสี่ยง" },
  "status.cooling": { en: "Cooling", th: "เย็นชา" },
  "status.pending": { en: "Pending", th: "รอดำเนินการ" },
  "status.review": { en: "Review", th: "รอตรวจสอบ" },
  "status.submitted": { en: "Submitted", th: "ส่งแล้ว" },
  "status.open": { en: "Open", th: "เปิด" },
  "status.proposed": { en: "Proposed", th: "เสนอแล้ว" },
  "status.rejected_alt": { en: "Rejected", th: "ปฏิเสธ" },

  // ───────────────────────────── expense categories ─────────────────────────────
  "expenseCategory.Travel": { en: "Travel", th: "การเดินทาง" },
  "expenseCategory.Accommodation": { en: "Accommodation", th: "ที่พัก" },
  "expenseCategory.Meals": { en: "Meals", th: "อาหาร" },
  "expenseCategory.Software": { en: "Software", th: "ซอฟต์แวร์" },
  "expenseCategory.Equipment": { en: "Equipment", th: "อุปกรณ์" },
  "expenseCategory.Printing": { en: "Printing", th: "การพิมพ์" },
  "expenseCategory.Subscriptions": { en: "Subscriptions", th: "สมัครสมาชิก" },
  "expenseCategory.Other": { en: "Other", th: "อื่นๆ" },

  // ───────────────────────────── document types ─────────────────────────────
  "docType.contract": { en: "Contract", th: "สัญญา" },
  "docType.proposal": { en: "Proposal", th: "ข้อเสนอ" },
  "docType.nda": { en: "NDA", th: "สัญญาไม่เปิดเผยข้อมูล" },
  "docType.sow": { en: "Statement of Work", th: "ขอบเขตงาน" },
  "docType.invoice": { en: "Invoice", th: "ใบแจ้งหนี้" },
  "docType.report": { en: "Report", th: "รายงาน" },
  "docType.other": { en: "Other", th: "อื่นๆ" },

  // ───────────────────────────── document statuses ─────────────────────────────
  "docStatus.draft": { en: "Draft", th: "ร่าง" },
  "docStatus.active": { en: "Active", th: "ใช้งานอยู่" },
  "docStatus.signed": { en: "Signed", th: "ลงนามแล้ว" },
  "docStatus.expired": { en: "Expired", th: "หมดอายุ" },
  "docStatus.archived": { en: "Archived", th: "เก็บถาวร" },

  // ───────────────────────────── note types ─────────────────────────────
  "noteType.all": { en: "All types", th: "ทุกประเภท" },
  "noteType.note": { en: "Notes", th: "บันทึก" },
  "noteType.call": { en: "Calls", th: "การโทร" },
  "noteType.email": { en: "Emails", th: "อีเมล" },
  "noteType.meeting": { en: "Meetings", th: "การประชุม" },
  "noteType.note_single": { en: "Note", th: "บันทึก" },
  "noteType.call_single": { en: "Call", th: "การโทร" },
  "noteType.email_single": { en: "Email", th: "อีเมล" },
  "noteType.meeting_single": { en: "Meeting", th: "การประชุม" },

  // ───────────────────────────── proposal stages ─────────────────────────────
  "proposalStage.lead": { en: "Lead", th: "เลด" },
  "proposalStage.qualified": { en: "Qualified", th: "ผ่านการคัดเลือก" },
  "proposalStage.proposal": { en: "Proposal Sent", th: "ส่งข้อเสนอแล้ว" },
  "proposalStage.negotiation": { en: "Negotiation", th: "เจรจา" },
  "proposalStage.won": { en: "Won", th: "ชนะ" },
  "proposalStage.lost": { en: "Lost", th: "เสีย" },
  "proposalStage.draft": { en: "Draft", th: "ร่าง" },
  "proposalStage.sent": { en: "Sent", th: "ส่งแล้ว" },
  "proposalStage.negotiating": { en: "Negotiating", th: "กำลังเจรจา" },
  "proposalStage.accepted": { en: "Won", th: "ชนะ" },
  "proposalStage.rejected": { en: "Lost", th: "เสีย" },

  // ───────────────────────────── invoice statuses ─────────────────────────────
  "invoiceStatus.all": { en: "All", th: "ทั้งหมด" },
  "invoiceStatus.draft": { en: "Draft", th: "ร่าง" },
  "invoiceStatus.sent": { en: "Sent", th: "ส่งแล้ว" },
  "invoiceStatus.paid": { en: "Paid", th: "ชำระแล้ว" },
  "invoiceStatus.overdue": { en: "Overdue", th: "เกินกำหนด" },
  "invoiceStatus.cancelled": { en: "Cancelled", th: "ยกเลิก" },

  // ───────────────────────────── contract statuses ─────────────────────────────
  "contractStatus.all": { en: "All", th: "ทั้งหมด" },
  "contractStatus.active": { en: "Active", th: "ใช้งานอยู่" },
  "contractStatus.draft": { en: "Draft", th: "ร่าง" },
  "contractStatus.expired": { en: "Expired", th: "หมดอายุ" },
  "contractStatus.cancelled": { en: "Cancelled", th: "ยกเลิก" },

  // ───────────────────────────── payment methods ─────────────────────────────
  "paymentMethod.bank_transfer": { en: "Bank Transfer", th: "โอนผ่านธนาคาร" },
  "paymentMethod.check": { en: "Check", th: "เช็ค" },
  "paymentMethod.cash": { en: "Cash", th: "เงินสด" },
  "paymentMethod.credit_card": { en: "Credit Card", th: "บัตรเครดิต" },
  "paymentMethod.other": { en: "Other", th: "อื่นๆ" },

  // ───────────────────────────── AR aging labels ─────────────────────────────
  "arAging.current": { en: "Current (not due)", th: "ปัจจุบัน (ยังไม่ถึงกำหนด)" },
  "arAging.1-30": { en: "1–30 days", th: "1–30 วัน" },
  "arAging.31-60": { en: "31–60 days", th: "31–60 วัน" },
  "arAging.61-90": { en: "61–90 days", th: "61–90 วัน" },
  "arAging.90+": { en: "90+ days", th: "90+ วัน" },

  // ───────────────────────────── relative date strings ─────────────────────────────
  "relativeDate.today": { en: "Today", th: "วันนี้" },
  "relativeDate.yesterday": { en: "Yesterday", th: "เมื่อวาน" },
  "relativeDate.daysAgo": { en: "{count} days ago", th: "{count} วันที่แล้ว" },
  "relativeDate.weeksAgo": { en: "{count} weeks ago", th: "{count} สัปดาห์ที่แล้ว" },
  "relativeDate.monthsAgo": {
    en: "{count} months ago",
    th: "{count} เดือนที่แล้ว",
  },
  "relativeDate.yearsAgo": { en: "{count} years ago", th: "{count} ปีที่แล้ว" },

  // ───────────────────────────── currencies ─────────────────────────────
  "currency.USD": { en: "USD — US Dollar", th: "USD — ดอลลาร์สหรัฐ" },
  "currency.EUR": { en: "EUR — Euro", th: "EUR — ยูโร" },
  "currency.GBP": { en: "GBP — British Pound", th: "GBP — ปอนด์อังกฤษ" },
  "currency.CAD": { en: "CAD — Canadian Dollar", th: "CAD — ดอลลาร์แคนาดา" },
  "currency.AUD": {
    en: "AUD — Australian Dollar",
    th: "AUD — ดอลลาร์ออสเตรเลีย",
  },
  "currency.SGD": { en: "SGD — Singapore Dollar", th: "SGD — ดอลลาร์สิงคโปร์" },
  "currency.CHF": { en: "CHF — Swiss Franc", th: "CHF — ฟรังก์สวิส" },
  "currency.THB": { en: "THB — Thai Baht", th: "THB — บาทไทย" },

  // ───────────────────────────── months (Gregorian; Thai uses Buddhist Era via Intl) ─────────────────────────────
  "month.1": { en: "January", th: "มกราคม" },
  "month.2": { en: "February", th: "กุมภาพันธ์" },
  "month.3": { en: "March", th: "มีนาคม" },
  "month.4": { en: "April", th: "เมษายน" },
  "month.5": { en: "May", th: "พฤษภาคม" },
  "month.6": { en: "June", th: "มิถุนายน" },
  "month.7": { en: "July", th: "กรกฎาคม" },
  "month.8": { en: "August", th: "สิงหาคม" },
  "month.9": { en: "September", th: "กันยายน" },
  "month.10": { en: "October", th: "ตุลาคม" },
  "month.11": { en: "November", th: "พฤศจิกายน" },
  "month.12": { en: "December", th: "ธันวาคม" },

  // ───────────────────────────── shared components ─────────────────────────────
  "shared.closeSr": { en: "Close", th: "ปิด" },
  "shared.viewMode": { en: "View mode", th: "โหมดมุมมอง" },
  "shared.time": { en: "Time", th: "เวลา" },
  "shared.expenses": { en: "Expenses", th: "ค่าใช้จ่าย" },
  "shared.overview": { en: "Overview", th: "ภาพรวม" },
  "shared.timeWithCount": { en: "Time ({count})", th: "เวลา ({count})" },
  "shared.expensesWithCount": {
    en: "Expenses ({count})",
    th: "ค่าใช้จ่าย ({count})",
  },
  "shared.engagementsWithCount": {
    en: "Engagements ({count})",
    th: "งาน ({count})",
  },
  "shared.invoicesWithCount": {
    en: "Invoices ({count})",
    th: "ใบแจ้งหนี้ ({count})",
  },
  "shared.notesWithCount": { en: "Notes ({count})", th: "บันทึก ({count})" },
};

/** Resolve a translation key with optional interpolation. Returns the key if missing. */
export function resolveTranslation(
  dict: TranslationDict,
  lang: Language,
  key: string,
  vars?: Vars,
): string {
  const entry = dict[key];
  if (!entry) return key;
  let value = entry[lang] ?? entry.en ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}
