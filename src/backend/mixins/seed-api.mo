import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import ClientTypes "../types/clients";
import EngagementTypes "../types/engagements";
import FinanceTypes "../types/finance";
import CommTypes "../types/communications";
import PracticeTypes "../types/practice";
import Time "mo:core/Time";
import DocumentTypes "../types/documents";

mixin (
  accessControlState : AccessControl.AccessControlState,
  clientMap : Map.Map<Text, ClientTypes.Client>,
  contactMap : Map.Map<Text, ClientTypes.Contact>,
  engagementMap : Map.Map<Text, EngagementTypes.Engagement>,
  deliverableMap : Map.Map<Text, EngagementTypes.Deliverable>,
  timeEntryMap : Map.Map<Text, EngagementTypes.TimeEntry>,
  expenseMap : Map.Map<Text, EngagementTypes.Expense>,
  invoiceMap : Map.Map<Text, FinanceTypes.Invoice>,
  proposalMap : Map.Map<Text, FinanceTypes.Proposal>,
  paymentMap : Map.Map<Text, FinanceTypes.Payment>,
  noteMap : Map.Map<Text, CommTypes.Note>,
  reminderMap : Map.Map<Text, CommTypes.Reminder>,
  documentMap : Map.Map<Text, DocumentTypes.Document>,
  contractMap : Map.Map<Text, FinanceTypes.Contract>,
  rateCardMap : Map.Map<Text, PracticeTypes.RateCard>,
  practiceProfileMap : Map.Map<Text, PracticeTypes.PracticeProfile>,
) {

  public shared func seedSampleData() : async Bool {
    let NOW : Int = Time.now();
    let DAY : Int = 86_400_000_000_000; // nanoseconds per day
    // Guard: idempotent — return false if already seeded
    if (clientMap.size() > 0) { return false };

    // ── Clients ──────────────────────────────────────────────────────────────
    clientMap.add("client-1", { id = "client-1"; name = "บริษัท ไทยพัฒน์ แคปปิตอล จำกัด"; industry = ?"บริการการเงิน"; website = ?"https://thaiphatcapital.co.th"; phone = ?"+66 2-555-0100"; email = ?"info@thaiphatcapital.co.th"; address = ?"อาคารสินเอเชีย ชั้น 20 สีลม กรุงเทพฯ 10500"; notes = null; primaryContactId = "contact-1"; createdAt = NOW - 200 * DAY });
    clientMap.add("client-2", { id = "client-2"; name = "สยาม อินโนเวชั่น เทคโนโลยี"; industry = ?"เทคโนโลยี"; website = ?"https://siaminnovation.io"; phone = ?"+66 2-555-0100"; email = ?"hello@siaminnovation.io"; address = ?"อาคารยูนิลเวอร์ ชั้น 15 บางรัก กรุงเทพฯ 10500"; notes = null; primaryContactId = "contact-3"; createdAt = NOW - 150 * DAY });
    clientMap.add("client-3", { id = "client-3"; name = "กรุงเทพ เฮลท์แคร์ เน็ตเวิร์ก"; industry = ?"การแพทย์และสุขภาพ"; website = ?"https://bangkokhealthcare.org"; phone = ?"+66 2-555-0200"; email = ?"info@bangkokhealthcare.org"; address = ?"333 ถนนพระราม 9 ห้วยขวาง กรุงเทพฯ 10310"; notes = null; primaryContactId = "contact-5"; createdAt = NOW - 120 * DAY });
    clientMap.add("client-4", { id = "client-4"; name = "วีรภัณฑ์ ลอจิสติกส์ จำกัด"; industry = ?"โลจิสติกส์"; website = ?"https://veeraphandlogistics.co.th"; phone = ?"+66 2-555-0300"; email = ?"info@veeraphandlogistics.co.th"; address = ?"88 ถนนศรีนครินทร์ สุขุมวิท กรุงเทพฯ 10110"; notes = null; primaryContactId = "contact-7"; createdAt = NOW - 250 * DAY });
    clientMap.add("client-5", { id = "client-5"; name = "หลักทรัพย์หุ้นไพรเวท อิควิตี้"; industry = ?"หุ้นเอกชน"; website = ?"https://praiprivateequity.co.th"; phone = ?"+66 2-555-0400"; email = ?"info@praiprivateequity.co.th"; address = ?"555 ถนนวิทยุ ลุมพินี กรุงเทพฯ 10330"; notes = null; primaryContactId = "contact-9"; createdAt = NOW - 10 * DAY });

    // ── Contacts ─────────────────────────────────────────────────────────────
    // บริษัท ไทยพัฒน์ แคปปิตอล จำกัด
    contactMap.add("contact-1", { id = "contact-1"; clientId = "client-1"; name = "สมหญิง รักไทย"; email = ?"somying.r@thaiphatcapital.co.th"; phone = ?"+66 2-555-0121"; role = ?"ประธานเจ้าหน้าที่บริหาร (CFO)"; lastContactDate = ?(NOW - 5 * DAY); notes = ?"ชอบให้โทรในช่วงเช้า ให้ความสนใจผลงานไตรมาส 3 เป็นพิเศษ"; createdAt = NOW - 200 * DAY });
    contactMap.add("contact-2", { id = "contact-2"; clientId = "client-1"; name = "มนู วีระไทย"; email = ?"manoo.w@thaiphatcapital.co.th"; phone = ?"+66 2-555-0134"; role = ?"รองประธานฝ่ายปฏิบัติการ"; lastContactDate = ?(NOW - 12 * DAY); notes = ?"ตรวจสอบการต่อสัญญาทุกฉบับด้วยตนเอง"; createdAt = NOW - 200 * DAY });
    // สยาม อินโนเวชั่น เทคโนโลยี
    contactMap.add("contact-3", { id = "contact-3"; clientId = "client-2"; name = "กิตติ พัฒนาวงศ์"; email = ?"kitti.p@siaminnovation.io"; phone = ?"+66 2-555-0177"; role = ?"ประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (CTO)"; lastContactDate = ?(NOW - 3 * DAY); notes = ?"ตอบกลับทางอีเมลรวดเร็วมาก ชอบรับข้อมูลอัปเดตแบบไม่พร้อมกัน"; createdAt = NOW - 150 * DAY });
    contactMap.add("contact-4", { id = "contact-4"; clientId = "client-2"; name = "ลัดดา ศรีสุข"; email = ?"ladda.s@siaminnovation.io"; phone = ?"+66 2-555-0188"; role = ?"ผู้จัดการโครงการ"; lastContactDate = ?(NOW - 8 * DAY); notes = null; createdAt = NOW - 150 * DAY });
    // กรุงเทพ เฮลท์แคร์ เน็ตเวิร์ก
    contactMap.add("contact-5", { id = "contact-5"; clientId = "client-3"; name = "นพ. นภา จันทร์เพ็ญ"; email = ?"nopa.c@bangkokhealthcare.org"; phone = ?"+66 2-555-0212"; role = ?"ผู้อำนวยการแพทย์"; lastContactDate = ?(NOW - 20 * DAY); notes = ?"ให้ความสำคัญกับการปฏิบัติตามกฎระเบียบและการลดความเสี่ยง"; createdAt = NOW - 120 * DAY });
    contactMap.add("contact-6", { id = "contact-6"; clientId = "client-3"; name = "ประยุทธ ดิจิทัล"; email = ?"prayut.d@bangkokhealthcare.org"; phone = ?"+66 2-555-0225"; role = ?"ผู้อำนวยการฝ่ายไอที"; lastContactDate = ?(NOW - 15 * DAY); notes = null; createdAt = NOW - 120 * DAY });
    // วีรภัณฑ์ ลอจิสติกส์ จำกัด
    contactMap.add("contact-7", { id = "contact-7"; clientId = "client-4"; name = "ปิยะ กุลวงศ์"; email = ?"piya.k@veeraphandlogistics.co.th"; phone = ?"+66 2-555-0301"; role = ?"หัวหน้าฝ่ายกลยุทธ์"; lastContactDate = ?(NOW - 2 * DAY); notes = ?"กำลังปิดงานปรับปรุงระบบจัดซื้อ — มีส่วนร่วมสูงมาก"; createdAt = NOW - 250 * DAY });
    contactMap.add("contact-8", { id = "contact-8"; clientId = "client-4"; name = "บุญมี ชาติเจริญ"; email = ?"boonmee.c@veeraphandlogistics.co.th"; phone = ?"+66 2-555-0318"; role = ?"ประธานเจ้าหน้าที่ปฏิบัติการ (COO)"; lastContactDate = null; notes = null; createdAt = NOW - 250 * DAY });
    // หลักทรัพย์หุ้นไพรเวท อิควิตี้
    contactMap.add("contact-9", { id = "contact-9"; clientId = "client-5"; name = "วิชัย ศรีสวัสดิ์"; email = ?"vichai.s@praiprivateequity.co.th"; phone = ?"+66 2-555-0441"; role = ?"กรรมการผู้จัดการ"; lastContactDate = ?(NOW - 1 * DAY); notes = ?"แนะนำโดยปิยะ สนใจงานตรวจสอบสภาพการดำเนินงาน"; createdAt = NOW - 10 * DAY });

    // ── Engagements ───────────────────────────────────────────────────────────
    // กำลังดำเนินการ: สยาม อินโนเวชั่น — การประเมินสถาปัตยกรรมคลาวด์
    engagementMap.add("eng-1", { id = "eng-1"; profileId = ""; clientId = "client-2"; contactId = "contact-3"; name = "การประเมินสถาปัตยกรรมคลาวด์"; description = ?"ประเมินโครงสร้างพื้นฐานปัจจุบันและจัดทำแผนการย้ายระบบสู่คลาวด์"; startDate = NOW - 60 * DAY; endDate = ?(NOW + 30 * DAY); status = "active"; rateCardId = ?"rate-1"; healthStatus = ?"green"; createdAt = NOW - 60 * DAY });
    // กำลังดำเนินการ: ไทยพัฒน์ — การทบทวนประสิทธิภาพการดำเนินงาน
    engagementMap.add("eng-2", { id = "eng-2"; profileId = ""; clientId = "client-1"; contactId = "contact-1"; name = "การทบทวนประสิทธิภาพการดำเนินงาน"; description = ?"ระบุโอกาสในการลดต้นทุนในฝ่ายปฏิบัติการสนับสนุน"; startDate = NOW - 45 * DAY; endDate = ?(NOW + 15 * DAY); status = "active"; rateCardId = ?"rate-1"; healthStatus = ?"yellow"; createdAt = NOW - 45 * DAY });
    // ใกล้หมดอายุ: กรุงเทพ เฮลท์แคร์ — การวิเคราะห์ช่องว่างการปฏิบัติตามกฎหมาย
    engagementMap.add("eng-3", { id = "eng-3"; profileId = ""; clientId = "client-3"; contactId = "contact-5"; name = "การวิเคราะห์ช่องว่างการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคล"; description = ?"ประเมินสถานะการปฏิบัติตามกฎหมายและจัดทำแผนแก้ไข"; startDate = NOW - 90 * DAY; endDate = ?(NOW + 7 * DAY); status = "active"; rateCardId = ?"rate-2"; healthStatus = ?"red"; createdAt = NOW - 90 * DAY });
    // เสร็จสิ้น: วีรภัณฑ์ — กลยุทธ์การจัดซื้อ
    engagementMap.add("eng-4", { id = "eng-4"; profileId = ""; clientId = "client-4"; contactId = "contact-7"; name = "การออกแบบกลยุทธ์การจัดซื้อใหม่"; description = ?"ออกแบบกระบวนการจัดซื้อและการจัดการผู้ผลิตใหม่"; startDate = NOW - 180 * DAY; endDate = ?(NOW - 30 * DAY); status = "completed"; rateCardId = null; healthStatus = ?"green"; createdAt = NOW - 180 * DAY });

    // ── Deliverables ──────────────────────────────────────────────────────────
    deliverableMap.add("del-1", { id = "del-1"; engagementId = "eng-1"; name = "รายงานตรวจสอบโครงสร้างพื้นฐานสถานะปัจจุบัน"; title = "รายงานตรวจสอบโครงสร้างพื้นฐานสถานะปัจจุบัน"; dueDate = ?(NOW - 10 * DAY); status = "completed"; notes = ?"ส่งมอบตรงเวลา"; createdAt = NOW - 10 * DAY });
    deliverableMap.add("del-2", { id = "del-2"; engagementId = "eng-1"; name = "แผนการย้ายระบบสู่คลาวด์"; title = "แผนการย้ายระบบสู่คลาวด์"; dueDate = ?(NOW + 25 * DAY); status = "in-progress"; notes = ?"ส่งฉบับร่างให้กิตติตรวจทานแล้ว"; createdAt = NOW - 14 * DAY });
    deliverableMap.add("del-3", { id = "del-3"; engagementId = "eng-2"; name = "รายงานประสิทธิภาพกระบวนการ"; title = "รายงานประสิทธิภาพกระบวนการ"; dueDate = ?(NOW + 10 * DAY); status = "in-progress"; notes = null; createdAt = NOW - 10 * DAY });
    deliverableMap.add("del-4", { id = "del-4"; engagementId = "eng-3"; name = "รายงานวิเคราะห์ช่องว่าง"; title = "รายงานวิเคราะห์ช่องว่าง"; dueDate = ?(NOW + 5 * DAY); status = "in-progress"; notes = ?"รอการตรวจทานขั้นสุดท้ายจากผู้อำนวยการแพทย์"; createdAt = NOW - 5 * DAY });

    // ── Time Entries ─────────────────────────────────────────────────────────
    // สัปดาห์: ประมาณ 3 สัปดาห์ก่อน
    timeEntryMap.add("time-1", { id = "time-1"; engagementId = "eng-1"; deliverableId = "del-1"; date = NOW - 22 * DAY; hours = 6; description = ?"สัมภาษณ์และจัดทำเอกสารตรวจสอบโครงสร้างพื้นฐาน"; rateCardId = ""; billable = true; createdAt = NOW - 22 * DAY });
    timeEntryMap.add("time-2", { id = "time-2"; engagementId = "eng-2"; deliverableId = "del-3"; date = NOW - 21 * DAY; hours = 5; description = ?"สัมภาษณ์กระบวนการฝ่ายสนับสนุน (ทีมการเงิน)"; rateCardId = ""; billable = true; createdAt = NOW - 21 * DAY });
    // สัปดาห์: ประมาณ 2 สัปดาห์ก่อน
    timeEntryMap.add("time-3", { id = "time-3"; engagementId = "eng-1"; deliverableId = "del-2"; date = NOW - 14 * DAY; hours = 4; description = ?"แผนการย้ายระบบสู่คลาวด์ — ร่างสถาปัตยกรรม"; rateCardId = ""; billable = true; createdAt = NOW - 14 * DAY });
    timeEntryMap.add("time-4", { id = "time-4"; engagementId = "eng-3"; deliverableId = "del-4"; date = NOW - 13 * DAY; hours = 8; description = ?"ประเมินระบบควบคุมและจัดทำแผนผังช่องว่าง"; rateCardId = ""; billable = true; createdAt = NOW - 13 * DAY });
    timeEntryMap.add("time-5", { id = "time-5"; engagementId = "eng-2"; deliverableId = "del-3"; date = NOW - 12 * DAY; hours = 3; description = ?"สังเคราะห์ผลการวิเคราะห์และร่างประเด็นหลัก"; rateCardId = ""; billable = true; createdAt = NOW - 12 * DAY });
    // สัปดาห์: สัปดาห์ก่อน
    timeEntryMap.add("time-6", { id = "time-6"; engagementId = "eng-1"; deliverableId = "del-2"; date = NOW - 7 * DAY; hours = 4; description = ?"ปรับแก้แผนการย้ายระบบหลังได้รับข้อเสนอแนะจากลูกค้า"; rateCardId = ""; billable = true; createdAt = NOW - 7 * DAY });
    timeEntryMap.add("time-7", { id = "time-7"; engagementId = "eng-3"; deliverableId = "del-4"; date = NOW - 6 * DAY; hours = 5; description = ?"ตารางเวลาแก้ไขและสรุปผลสำหรับผู้บริหาร"; rateCardId = ""; billable = true; createdAt = NOW - 6 * DAY });
    // สัปดาห์นี้
    timeEntryMap.add("time-8", { id = "time-8"; engagementId = "eng-2"; deliverableId = "del-3"; date = NOW - 3 * DAY; hours = 4; description = ?"วิเคราะห์ข้อมูลและสังเคราะห์ผลการวิเคราะห์"; rateCardId = ""; billable = true; createdAt = NOW - 3 * DAY });
    timeEntryMap.add("time-9", { id = "time-9"; engagementId = "eng-1"; deliverableId = "del-2"; date = NOW - 1 * DAY; hours = 2; description = ?"ขัดเกลาแผนขั้นสุดท้ายและสรุปผลสำหรับผู้บริหาร"; rateCardId = ""; billable = true; createdAt = NOW - 1 * DAY });

    // ── Expenses ─────────────────────────────────────────────────────────────
    expenseMap.add("exp-1", { id = "exp-1"; engagementId = "eng-1"; date = NOW - 21 * DAY; amount = 28000; category = "Travel"; description = ?"ค่าเดินทางไปประเมินงาน ณ สถานที่จริง"; billable = true; createdAt = NOW - 21 * DAY });
    expenseMap.add("exp-2", { id = "exp-2"; engagementId = "eng-3"; date = NOW - 13 * DAY; amount = 15000; category = "Software"; description = ?"เครื่องมือสแกนการปฏิบัติตามกฎหมายของบุคคลที่สาม (ครั้งเดียว)"; billable = true; createdAt = NOW - 13 * DAY });
    expenseMap.add("exp-3", { id = "exp-3"; engagementId = "eng-2"; date = NOW - 5 * DAY; amount = 8500; category = "Travel"; description = ?"ค่าเดินทางไปทำงาน ณ สำนักงานลูกค้า"; billable = true; createdAt = NOW - 5 * DAY });

    // ── Invoices ─────────────────────────────────────────────────────────────
    // ใบแจ้งหนี้ที่ชำระแล้ว — วีรภัณฑ์ (งานที่เสร็จสิ้น)
    invoiceMap.add("inv-1", { id = "inv-1"; clientId = "client-4"; engagementId = ?"eng-4"; invoiceNumber = "INV-001"; issueDate = NOW - 60 * DAY; dueDate = NOW - 30 * DAY; totalAmount = 24000.0; subtotalAmount = 24000.0; taxes = 0.0; status = "paid"; notes = ?"ใบแจ้งหนี้ฉบับสุดท้ายสำหรับงานออกแบบกลยุทธ์การจัดซื้อ"; paymentTerms = "Net 30"; paymentMethod = "Wire"; contractId = ""; lineItems = [{ description = "การออกแบบกลยุทธ์การจัดซื้อใหม่"; quantity = 1.0; unitPrice = 24000.0 }]; createdAt = NOW - 60 * DAY });
    // ใบแจ้งหนี้ที่ชำระแล้ว — สยาม อินโนเวชั่น งวดแรก
    invoiceMap.add("inv-2", { id = "inv-2"; clientId = "client-2"; engagementId = ?"eng-1"; invoiceNumber = "INV-002"; issueDate = NOW - 30 * DAY; dueDate = NOW - 1 * DAY; totalAmount = 8000.0; subtotalAmount = 8000.0; taxes = 0.0; status = "paid"; notes = ?"งวดตรวจสอบโครงสร้างพื้นฐาน"; paymentTerms = "Net 30"; paymentMethod = "ACH"; contractId = ""; lineItems = [{ description = "การประเมินสถาปัตยกรรมคลาวด์ — ระยะที่ 1"; quantity = 1.0; unitPrice = 8000.0 }]; createdAt = NOW - 30 * DAY });
    // ใบแจ้งหนี้ที่ค้างชำระ — ไทยพัฒน์
    invoiceMap.add("inv-3", { id = "inv-3"; clientId = "client-1"; engagementId = ?"eng-2"; invoiceNumber = "INV-003"; issueDate = NOW - 20 * DAY; dueDate = NOW + 10 * DAY; totalAmount = 12000.0; subtotalAmount = 12000.0; taxes = 0.0; status = "sent"; notes = ?"ใบแจ้งหนี้ความคืบหน้ากลางโครงการ"; paymentTerms = "Net 30"; paymentMethod = ""; contractId = ""; lineItems = [{ description = "การทบทวนประสิทธิภาพการดำเนินงาน — ความคืบหน้า"; quantity = 1.0; unitPrice = 12000.0 }]; createdAt = NOW - 20 * DAY });
    // ใบแจ้งหนี้เกินกำหนด — กรุงเทพ เฮลท์แคร์
    invoiceMap.add("inv-4", { id = "inv-4"; clientId = "client-3"; engagementId = ?"eng-3"; invoiceNumber = "INV-004"; issueDate = NOW - 50 * DAY; dueDate = NOW - 20 * DAY; totalAmount = 9500.0; subtotalAmount = 9500.0; taxes = 0.0; status = "overdue"; notes = ?"การวิเคราะห์ช่องว่างการปฏิบัติตามกฎหมาย — ระยะที่ 1"; paymentTerms = "Net 30"; paymentMethod = ""; contractId = ""; lineItems = [{ description = "การวิเคราะห์ช่องว่างการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคล — ระยะที่ 1"; quantity = 1.0; unitPrice = 9500.0 }]; createdAt = NOW - 50 * DAY });
    // ใบแจ้งหนี้ฉบับร่าง — สยาม อินโนเวชั่น งวดที่สอง
    invoiceMap.add("inv-5", { id = "inv-5"; clientId = "client-2"; engagementId = ?"eng-1"; invoiceNumber = "INV-005"; issueDate = NOW; dueDate = NOW + 30 * DAY; totalAmount = 8000.0; subtotalAmount = 8000.0; taxes = 0.0; status = "draft"; notes = ?"งวดแผนการย้ายระบบสู่คลาวด์"; paymentTerms = "Net 30"; paymentMethod = ""; contractId = ""; lineItems = [{ description = "การประเมินสถาปัตยกรรมคลาวด์ — ระยะที่ 2"; quantity = 1.0; unitPrice = 8000.0 }]; createdAt = NOW });

    // ── Payments ─────────────────────────────────────────────────────────────
    paymentMap.add("pay-1", { id = "pay-1"; invoiceId = "inv-1"; clientId = "client-4"; paymentDate = NOW - 28 * DAY; date = NOW - 28 * DAY; amount = 24000.0; method = ?"Wire"; notes = null; createdAt = NOW - 28 * DAY });
    paymentMap.add("pay-2", { id = "pay-2"; invoiceId = "inv-2"; clientId = "client-2"; paymentDate = NOW - 2 * DAY; date = NOW - 2 * DAY; amount = 8000.0; method = ?"ACH"; notes = null; createdAt = NOW - 2 * DAY });

    // ── Proposals (pipeline stages: Prospect, Proposed, Under Discussion, Accepted, Lost) ──
    // ตกลง: สยาม อินโนเวชั่น สถาปัตยกรรมคลาวด์
    proposalMap.add("prop-1", { id = "prop-1"; clientId = "client-2"; contactId = "contact-3"; name = "สถาปัตยกรรมคลาวด์และกลยุทธ์การย้ายระบบ"; description = "การประเมินความพร้อมคลาวด์อย่างครอบคลุมและแผนการย้ายระบบเป็นระยะสำหรับโครงสร้างพื้นฐาน 200 โหนด"; amount = 16000.0; status = "Accepted"; notes = "ลงนามหลังนำเสนอครั้งที่สอง มีความสัมพันธ์ที่ดีกับ CTO"; createdAt = NOW - 70 * DAY });
    // เสนอ: กรุงเทพ เฮลท์แคร์ โปรแกรมการปฏิบัติตามกฎหมายขยาย
    proposalMap.add("prop-2", { id = "prop-2"; clientId = "client-3"; contactId = "contact-5"; name = "โปรแกรมการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคลอย่างต่อเนื่อง"; description = "การติดตามการปฏิบัติตามกฎหมายประจำปี การอบรมพนักงาน และการประเมินรายไตรมาสแบบว่าจ้าง"; amount = 18000.0; status = "Proposed"; notes = "นำเสนอต่อผู้อำนวยการแพทย์ รอการอนุมัติจากคณะกรรมการ — ติดตามปลายเดือน"; createdAt = NOW - 20 * DAY });
    // Prospect: หลักทรัพย์หุ้นไพรเวท อิควิตี้ — ลูกค้าใหม่ที่อาจเป็นได้
    proposalMap.add("prop-3", { id = "prop-3"; clientId = "client-5"; contactId = "contact-9"; name = "การตรวจสอบสภาพการดำเนินงานของบริษัทในพอร์ตการลงทุน"; description = "การประเมินสภาพการดำเนินงานของบริษัทในพอร์ตการลงทุนสามแห่งก่อนการขายออก ระบุช่องว่างด้านประสิทธิภาพและโอกาสในการสร้างมูลค่า"; amount = 22000.0; status = "Prospect"; notes = "แนะนำโดยปิยะจากวีรภัณฑ์ การโทรครั้งแรกเป็นไปด้วยดี — จะส่งสรุปภาพรวมสัปดาห์นี้"; createdAt = NOW - 8 * DAY });
    // กำลังเจรจา: ไทยพัฒน์ — ที่ปรึกษาการแปลงดิจิทัล
    proposalMap.add("prop-4", { id = "prop-4"; clientId = "client-1"; contactId = "contact-1"; name = "ที่ปรึกษาการแปลงดิจิทัล"; description = "ที่ปรึกษาแบบว่าจ้างรายเดือน 12 เดือน เพื่อช่วยเหลือไทยพัฒน์ในการปรับปรุงระบบหลักและการแปลงกระบวนการเป็นดิจิทัล"; amount = 36000.0; status = "Under Discussion"; notes = "สมหญิงสนใจ แต่มนูมีคำถามเรื่องงบประมาณ นัดติดตามเพื่อชี้แจงคุณค่าใหม่"; createdAt = NOW - 15 * DAY });
    // ไม่ได้งาน: วีรภัณฑ์ ขยายขอบเขตงาน
    proposalMap.add("prop-5", { id = "prop-5"; clientId = "client-4"; contactId = "contact-8"; name = "การศึกษาความเป็นไปได้ของการทำคลังสินค้าอัตโนมัติ"; description = "ประเมินความเป็นไปได้และผลตอบแทนการลงทุนของการทำศูนย์กระจายสินค้าสามแห่งให้เป็นอัตโนมัติ"; amount = 9000.0; status = "Lost"; notes = "บุญมีตัดสินใจทำภายในองค์กรเอง ความสัมพันธ์ยังดีอยู่ — เปิดช่องสำหรับงานในอนาคต"; createdAt = NOW - 40 * DAY });

    // ── Notes ────────────────────────────────────────────────────────────────
    // สยาม อินโนเวชั่น (client-2)
    noteMap.add("note-1", { id = "note-1"; clientId = "client-2"; engagementId = ?"eng-1"; content = "โทรเริ่มโครงการกับกิตติและลัดดา ยืนยันขอบเขตและงวดสำคัญ การตรวจสอบโครงสร้างพื้นฐานจะเริ่มทันที"; noteType = "meeting"; followUpDate = null; followUpDone = false; createdAt = NOW - 60 * DAY; reminderDate = null; followUp = false; isMeetingNote = true });
    noteMap.add("note-6", { id = "note-6"; clientId = "client-2"; engagementId = ?"eng-1"; content = "เช็คอินกลางโครงการกับกิตติ ฉบับร่างแผนได้รับการตอบรับดี — ต้องการให้เน้นเรื่องการสร้างแบบจำลองต้นทุนในสรุปผลสำหรับผู้บริหารมากขึ้น"; noteType = "meeting"; followUpDate = null; followUpDone = false; createdAt = NOW - 14 * DAY; reminderDate = null; followUp = false; isMeetingNote = true });
    noteMap.add("note-7", { id = "note-7"; clientId = "client-2"; engagementId = null; content = "ลัดดาเอ่ยว่าสยาม อินโนเวชั่น กำลังพิจารณางานเส้นทางที่สองเกี่ยวกับการปรับปรุงแพลตฟอร์มข้อมูล อาจเป็นงานต่อยอด — ตั้งค่าสถานะไว้ในไปป์ไลน์"; noteType = "note"; followUpDate = null; followUpDone = false; createdAt = NOW - 5 * DAY; reminderDate = null; followUp = true; isMeetingNote = false });
    // ไทยพัฒน์ (client-1)
    noteMap.add("note-2", { id = "note-2"; clientId = "client-1"; engagementId = ?"eng-2"; content = "สมหญิงระบุความกังวลเรื่องความเสี่ยงในการย้ายระบบ ERP ปรับขอบเขตให้รวมส่วนความเสี่ยงในรายงานประสิทธิภาพ"; noteType = "note"; followUpDate = null; followUpDone = false; createdAt = NOW - 10 * DAY; reminderDate = null; followUp = true; isMeetingNote = false });
    noteMap.add("note-8", { id = "note-8"; clientId = "client-1"; engagementId = ?"eng-2"; content = "ประชุมประจำสัปดาห์กับมนู ทีมการเงินเห็นด้วยกับข้อเสนอแนะ ต้องการสไลด์นำเสนอรายงานสำหรับการนำเสนอต่อคณะกรรมการ"; noteType = "meeting"; followUpDate = null; followUpDone = false; createdAt = NOW - 4 * DAY; reminderDate = null; followUp = false; isMeetingNote = true });
    noteMap.add("note-9", { id = "note-9"; clientId = "client-1"; engagementId = null; content = "สมหญิงเอ่ยถึงความสนใจในที่ปรึกษาการแปลงดิจิทัลแบบว่าจ้าง ส่งโครงร่างสั้น ๆ ไปแล้ว — เธอกำลังหมุนเวียนภายในองค์กรก่อนนัดพบ"; noteType = "note"; followUpDate = null; followUpDone = false; createdAt = NOW - 2 * DAY; reminderDate = null; followUp = true; isMeetingNote = false });
    // กรุงเทพ เฮลท์แคร์ (client-3)
    noteMap.add("note-3", { id = "note-3"; clientId = "client-3"; engagementId = null; content = "คณะกรรมการกรุงเทพ เฮลท์แคร์ ต้องการขยายงานหลังตรวจสอบการปฏิบัติตามกฎหมาย ข้อเสนอสำหรับการว่าจ้างต่อเนื่องจะส่งภายในสิ้นเดือนพฤษภาคม"; noteType = "note"; followUpDate = null; followUpDone = false; createdAt = NOW - 7 * DAY; reminderDate = null; followUp = true; isMeetingNote = false });
    noteMap.add("note-4", { id = "note-4"; clientId = "client-3"; engagementId = ?"eng-3"; content = "นภาตรวจทานผลการวิเคราะห์เบื้องต้น กังวลเรื่องช่องว่างของระบบ EHR เดิม — ต้องการส่วนเพิ่มเติมเกี่ยวกับตารางเวลาแก้ไข"; noteType = "meeting"; followUpDate = null; followUpDone = false; createdAt = NOW - 4 * DAY; reminderDate = null; followUp = false; isMeetingNote = true });
    // วีรภัณฑ์ (client-4)
    noteMap.add("note-5", { id = "note-5"; clientId = "client-4"; engagementId = ?"eng-4"; content = "ปิยะยืนยันว่าการออกแบบกลยุทธ์การจัดซื้อใหม่เริ่มใช้งานสัปดาห์ที่แล้ว ทีมพอใจกับกรอบงานมาก อาจมีการแนะนำลูกค้าในไปป์ไลน์"; noteType = "note"; followUpDate = null; followUpDone = false; createdAt = NOW - 25 * DAY; reminderDate = null; followUp = false; isMeetingNote = false });
    // หลักทรัพย์หุ้นไพรเวท อิควิตี้ (client-5)
    noteMap.add("note-10", { id = "note-10"; clientId = "client-5"; engagementId = null; content = "โทรครั้งแรกกับวิชัย ตรงไปตรงมามาก — ต้องการขอบเขตและโมเดลต้นทุนที่ชัดเจนก่อนนำเสนอต่อกรรมการ ส่งโครงร่างข้อเสนอภายในวันศุกร์"; noteType = "meeting"; followUpDate = null; followUpDone = false; createdAt = NOW - 1 * DAY; reminderDate = null; followUp = true; isMeetingNote = true });

    // ── Reminders ────────────────────────────────────────────────────────────
    reminderMap.add("rem-1", { id = "rem-1"; text = "ส่งมอบรายงานวิเคราะห์ช่องว่างขั้นสุดท้ายให้กรุงเทพ เฮลท์แคร์ ก่อนสิ้นสุดสัญญา"; dueDate = NOW + 3 * DAY; engagementId = ?"eng-3"; clientId = ?"client-3"; done = false; createdAt = NOW; message = "ส่งมอบรายงานวิเคราะห์ช่องว่างขั้นสุดท้ายให้กรุงเทพ เฮลท์แคร์ ก่อนสิ้นสุดสัญญา"; completed = false });
    reminderMap.add("rem-2", { id = "rem-2"; text = "ส่งฉบับร่างรายงานประสิทธิภาพให้ไทยพัฒน์ตรวจทานก่อนส่งมอบขั้นสุดท้าย"; dueDate = NOW + 5 * DAY; engagementId = ?"eng-2"; clientId = ?"client-1"; done = false; createdAt = NOW; message = "ส่งฉบับร่างรายงานประสิทธิภาพให้ไทยพัฒน์ตรวจทานก่อนส่งมอบขั้นสุดท้าย"; completed = false });
    reminderMap.add("rem-3", { id = "rem-3"; text = "ติดตามผู้อำนวยการแพทย์กรุงเทพ เฮลท์แคร์เรื่องข้อเสนอว่าจ้างต่อเนื่อง — มีการประชุมคณะกรรมการแล้ว"; dueDate = NOW + 7 * DAY; engagementId = null; clientId = ?"client-3"; done = false; createdAt = NOW; message = "ติดตามผู้อำนวยการแพทย์กรุงเทพ เฮลท์แคร์เรื่องข้อเสนอว่าจ้างต่อเนื่อง — มีการประชุมคณะกรรมการแล้ว"; completed = false });
    reminderMap.add("rem-4", { id = "rem-4"; text = "ส่งโครงร่างข้อเสนอให้หลักทรัพย์หุ้นไพรเวท — วิชัยต้องการก่อนประชุมกรรมการ"; dueDate = NOW + 9 * DAY; engagementId = null; clientId = ?"client-5"; done = false; createdAt = NOW; message = "ส่งโครงร่างข้อเสนอให้หลักทรัพย์หุ้นไพรเวท — วิชัยต้องการก่อนประชุมกรรมการ"; completed = false });
    reminderMap.add("rem-5", { id = "rem-5"; text = "นัดเดินผ่านแผนการย้ายระบบกับกิตติและทีมวิศวกรของสยาม อินโนเวชั่น"; dueDate = NOW + 12 * DAY; engagementId = ?"eng-1"; clientId = ?"client-2"; done = false; createdAt = NOW; message = "นัดเดินผ่านแผนการย้ายระบบกับกิตติและทีมวิศวกรของสยาม อินโนเวชั่น"; completed = false });

    // ── Documents ────────────────────────────────────────────────────────────
    if (documentMap.size() == 0) {
      documentMap.add("doc-1", { id = "doc-1"; name = "การประเมินสถาปัตยกรรมคลาวด์ - ข้อตกลงบริการหลัก"; title = "การประเมินสถาปัตยกรรมคลาวด์ - ข้อตกลงบริการหลัก"; category = "Contract"; docType = "Contract"; status = "signed"; clientId = ?"client-2"; engagementId = ?"eng-1"; notes = ?"ลงนามครบถ้วน ครอบคลุมขอบเขตการประเมินการย้ายระบบสู่คลาวด์ทั้งหมด"; createdAt = NOW - 58 * DAY; updatedAt = NOW - 55 * DAY });
      documentMap.add("doc-2", { id = "doc-2"; name = "การวิเคราะห์ช่องว่างการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคล - ขอบเขตการทำงาน"; title = "การวิเคราะห์ช่องว่างการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคล - ขอบเขตการทำงาน"; category = "Statement of Work"; docType = "Statement of Work"; status = "review"; clientId = ?"client-3"; engagementId = ?"eng-3"; notes = ?"ส่งให้นภาเพื่อลงนามตอบ รอเอกสารตอบกลับ"; createdAt = NOW - 88 * DAY; updatedAt = NOW - 85 * DAY });
      documentMap.add("doc-3", { id = "doc-3"; name = "โปรแกรมการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคลอย่างต่อเนื่อง - ข้อเสนอ"; title = "โปรแกรมการปฏิบัติตาม พ.ร.บ. ข้อมูลส่วนบุคคลอย่างต่อเนื่อง - ข้อเสนอ"; category = "Proposal"; docType = "Proposal"; status = "draft"; clientId = ?"client-3"; engagementId = null; notes = ?"กำลังจัดทำฉบับร่าง จะส่งหลังทราบผลการอนุมัติจากคณะกรรมการ"; createdAt = NOW - 6 * DAY; updatedAt = NOW - 1 * DAY });
      documentMap.add("doc-4", { id = "doc-4"; name = "ไทยพัฒน์ แคปปิตอล - ขอบเขตการทบทวนประสิทธิภาพการดำเนินงาน"; title = "ไทยพัฒน์ แคปปิตอล - ขอบเขตการทบทวนประสิทธิภาพการดำเนินงาน"; category = "Statement of Work"; docType = "Statement of Work"; status = "signed"; clientId = ?"client-1"; engagementId = ?"eng-2"; notes = ?"ลงนามครบถ้วน งานว่าจ้างราคาคงที่พร้อมการชำระเงินสองงวด"; createdAt = NOW - 44 * DAY; updatedAt = NOW - 44 * DAY });
      documentMap.add("doc-5", { id = "doc-5"; name = "การตรวจสอบสภาพการดำเนินงานพอร์ตการลงทุน - ข้อเสนอหลักทรัพย์หุ้นไพรเวท"; title = "การตรวจสอบสภาพการดำเนินงานพอร์ตการลงทุน - ข้อเสนอหลักทรัพย์หุ้นไพรเวท"; category = "Proposal"; docType = "Proposal"; status = "draft"; clientId = ?"client-5"; engagementId = null; notes = ?"ฉบับร่างแรกที่จะส่งให้วิชัยก่อนการตรวจทานของกรรมการ"; createdAt = NOW - 1 * DAY; updatedAt = NOW });
    };

    // ── Contracts ─────────────────────────────────────────────────────────────
    contractMap.add("con-1", { id = "con-1"; engagementId = "eng-1"; status = "active"; startDate = NOW - 60 * DAY; endDate = ?(NOW + 30 * DAY); renewalDate = ?(NOW + 30 * DAY); notes = ?"ลงนาม MA แล้ว รวมข้อกำหนดเรื่องกรรมสิทธิ์ทรัพย์สินทางปัญญา"; createdAt = NOW - 60 * DAY });
    contractMap.add("con-2", { id = "con-2"; engagementId = "eng-2"; status = "expiring"; startDate = NOW - 45 * DAY; endDate = ?(NOW + 15 * DAY); renewalDate = null; notes = ?"งานว่าจ้างราคาคงที่ ชำระเงินสองงวด"; createdAt = NOW - 45 * DAY });

    // ── Rate Cards ─────────────────────────────────────────────────────────────
    rateCardMap.add("rate-1", { id = "rate-1"; serviceName = "กลยุทธ์และที่ปรึกษา"; hourlyRate = ?25000; dailyRate = ?180000; projectRate = null; currency = "USD"; notes = ?"อัตรามาตรฐานสำหรับงานกลยุทธ์ ที่ปรึกษา และการแปลงองค์กร"; createdAt = NOW; name = "กลยุทธ์และที่ปรึกษา" });
    rateCardMap.add("rate-2", { id = "rate-2"; serviceName = "การปฏิบัติตามกฎหมายและความเสี่ยง"; hourlyRate = ?20000; dailyRate = ?150000; projectRate = null; currency = "USD"; notes = ?"งานด้านการปฏิบัติตามกฎระเบียบ กฎหมาย และการประเมินความเสี่ยง"; createdAt = NOW; name = "การปฏิบัติตามกฎหมายและความเสี่ยง" });

    // ── Practice Profile ──────────────────────────────────────────────────────
    practiceProfileMap.add("profile-1", { id = "profile-1"; practiceName = "สำนักงานที่ปรึกษาอิสระ"; ownerName = ?"อรรถ ที่ปรึกษา"; hourlyRate = ?25000; currency = "USD"; timezone = ?"Asia/Bangkok"; email = ?"at@myconsulting.co"; phone = null; address = null; createdAt = NOW; name = "สำนักงานที่ปรึกษาอิสระ"; contactId = ""; billingAddress = ""; workStyle = "project"; hasExistingClients = true });

    true;
  };

  public shared func initializeSeedData() : async () {
    ignore await seedSampleData();
  };
};
