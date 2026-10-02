import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";

import PracticeTypes "types/practice";
import ClientTypes "types/clients";
import EngagementTypes "types/engagements";
import FinanceTypes "types/finance";
import CommTypes "types/communications";
import DocumentTypes "types/documents";

// OQL field converters for option-typed columns (imported top-level so the
// auto-derivation resolver picks them up for every entity that uses them).
import OptTextValue "types/OptTextValue";
import OptIntValue "types/OptIntValue";
import OptNatValue "types/OptNatValue";

import PracticeApi "mixins/practice-api";
import ClientsApi "mixins/clients-api";
import EngagementsApi "mixins/engagements-api";
import FinanceApi "mixins/finance-api";
import CommunicationsApi "mixins/communications-api";
import DocumentsApi "mixins/documents-api";
import SeedApi "mixins/seed-api";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Practice state
  let practiceProfileMap = Map.empty<Text, PracticeTypes.PracticeProfile>();
  let rateCardMap = Map.empty<Text, PracticeTypes.RateCard>();

  // Client/contact state
  let clientMap = Map.empty<Text, ClientTypes.Client>();
  let contactMap = Map.empty<Text, ClientTypes.Contact>();

  // Engagement state
  let engagementMap = Map.empty<Text, EngagementTypes.Engagement>();
  let deliverableMap = Map.empty<Text, EngagementTypes.Deliverable>();
  let timeEntryMap = Map.empty<Text, EngagementTypes.TimeEntry>();
  let expenseMap = Map.empty<Text, EngagementTypes.Expense>();

  // Finance state
  let invoiceMap = Map.empty<Text, FinanceTypes.Invoice>();
  let proposalMap = Map.empty<Text, FinanceTypes.Proposal>();
  let paymentMap = Map.empty<Text, FinanceTypes.Payment>();
  let contractMap = Map.empty<Text, FinanceTypes.Contract>();
  let invoiceCounter = { var count : Nat = 0 };

  // Communications state
  let noteMap = Map.empty<Text, CommTypes.Note>();
  let reminderMap = Map.empty<Text, CommTypes.Reminder>();

  // Documents state
  let documentMap = Map.empty<Text, DocumentTypes.Document>();

  // Mixins
  include PracticeApi(accessControlState, practiceProfileMap, rateCardMap);
  include ClientsApi(accessControlState, clientMap, contactMap, engagementMap);
  include EngagementsApi(accessControlState, engagementMap, deliverableMap, timeEntryMap, expenseMap);
  include FinanceApi(accessControlState, invoiceMap, paymentMap, contractMap, proposalMap, engagementMap, clientMap, invoiceCounter);
  include DocumentsApi(accessControlState, documentMap);
  include CommunicationsApi(accessControlState, noteMap, reminderMap, invoiceMap, proposalMap, paymentMap, engagementMap, timeEntryMap, clientMap);
  include SeedApi(accessControlState, clientMap, contactMap, engagementMap, deliverableMap, timeEntryMap, expenseMap, invoiceMap, proposalMap, paymentMap, noteMap, reminderMap, documentMap, contractMap, rateCardMap, practiceProfileMap);

  // OQL (Data Intelligence) — expose every persisted collection as a queryable entity.
  // All entities use the default .controllerOnly() authorization: only the platform
  // controller (the Data Intelligence agent) reads them; end users never read directly.
  include Expose({
    entities = [
      // Practice profile
      practiceProfileMap.toEntity("practiceProfile", "PracticeProfile", "id")
        .sample({
          id = "";
          practiceName = "";
          ownerName = null;
          hourlyRate = null;
          currency = "";
          timezone = null;
          email = null;
          phone = null;
          address = null;
          createdAt = 0;
          name = "";
          contactId = "";
          billingAddress = "";
          workStyle = "";
          hasExistingClients = false;
        })
        .build(),
      rateCardMap.toEntity("rateCard", "RateCard", "id")
        .sample({
          id = "";
          serviceName = "";
          hourlyRate = null;
          dailyRate = null;
          projectRate = null;
          currency = "";
          notes = null;
          createdAt = 0;
          name = "";
        })
        .build(),
      // Clients / contacts
      clientMap.toEntity("client", "Client", "id")
        .sample({
          id = "";
          name = "";
          industry = null;
          website = null;
          phone = null;
          email = null;
          address = null;
          notes = null;
          primaryContactId = "";
          createdAt = 0;
        })
        .edge("primaryContactId", "contact")
        .build(),
      contactMap.toEntity("contact", "Contact", "id")
        .sample({
          id = "";
          clientId = "";
          name = "";
          email = null;
          phone = null;
          role = null;
          lastContactDate = null;
          notes = null;
          createdAt = 0;
        })
        .edge("clientId", "client")
        .build(),
      // Engagements
      engagementMap.toEntity("engagement", "Engagement", "id")
        .sample({
          id = "";
          clientId = "";
          name = "";
          description = null;
          startDate = 0;
          endDate = null;
          status = "";
          rateCardId = null;
          healthStatus = null;
          createdAt = 0;
          profileId = "";
          contactId = "";
        })
        .edge("clientId", "client")
        .edge("rateCardId", "rateCard")
        .edge("contactId", "contact")
        .build(),
      deliverableMap.toEntity("deliverable", "Deliverable", "id")
        .sample({
          id = "";
          engagementId = "";
          name = "";
          dueDate = null;
          status = "";
          notes = null;
          createdAt = 0;
          title = "";
        })
        .edge("engagementId", "engagement")
        .build(),
      timeEntryMap.toEntity("timeEntry", "TimeEntry", "id")
        .sample({
          id = "";
          engagementId = "";
          date = 0;
          hours = 0;
          description = null;
          billable = false;
          createdAt = 0;
          deliverableId = "";
          rateCardId = "";
        })
        .edge("engagementId", "engagement")
        .edge("deliverableId", "deliverable")
        .edge("rateCardId", "rateCard")
        .build(),
      expenseMap.toEntity("expense", "Expense", "id")
        .sample({
          id = "";
          engagementId = "";
          date = 0;
          amount = 0;
          category = "";
          description = null;
          billable = false;
          createdAt = 0;
        })
        .edge("engagementId", "engagement")
        .build(),
      // Finance — Invoice has a lineItems collection field, so use manual mode
      // and surface lineItemCount as a queryable column.
      invoiceMap.toEntityManual("invoice", "Invoice", "id")
        .payload("id", func i = i.id)
        .payload("clientId", func i = i.clientId)
        .payload("engagementId", func i = i.engagementId)
        .payload("invoiceNumber", func i = i.invoiceNumber)
        .payload("issueDate", func i = i.issueDate)
        .payload("dueDate", func i = i.dueDate)
        .payload("status", func i = i.status)
        .payload("lineItemCount", func i = i.lineItems.size())
        .payload("notes", func i = i.notes)
        .payload("createdAt", func i = i.createdAt)
        .payload("totalAmount", func i = i.totalAmount)
        .payload("subtotalAmount", func i = i.subtotalAmount)
        .payload("taxes", func i = i.taxes)
        .payload("paymentTerms", func i = i.paymentTerms)
        .payload("paymentMethod", func i = i.paymentMethod)
        .payload("contractId", func i = i.contractId)
        .edge("clientId", "client")
        .edge("engagementId", "engagement")
        .edge("contractId", "contract")
        .build(),
      proposalMap.toEntity("proposal", "Proposal", "id")
        .sample({
          id = "";
          clientId = "";
          contactId = "";
          name = "";
          description = "";
          amount = 0.0;
          status = "";
          notes = "";
          createdAt = 0;
        })
        .edge("clientId", "client")
        .edge("contactId", "contact")
        .build(),
      paymentMap.toEntity("payment", "Payment", "id")
        .sample({
          id = "";
          invoiceId = "";
          date = 0;
          amount = 0.0;
          method = null;
          notes = null;
          createdAt = 0;
          clientId = "";
          paymentDate = 0;
        })
        .edge("invoiceId", "invoice")
        .edge("clientId", "client")
        .build(),
      contractMap.toEntity("contract", "Contract", "id")
        .sample({
          id = "";
          engagementId = "";
          status = "";
          startDate = 0;
          endDate = null;
          renewalDate = null;
          notes = null;
          createdAt = 0;
        })
        .edge("engagementId", "engagement")
        .build(),
      // Communications
      noteMap.toEntity("note", "Note", "id")
        .sample({
          id = "";
          clientId = "";
          engagementId = null;
          content = "";
          noteType = "";
          followUpDate = null;
          followUpDone = false;
          createdAt = 0;
          reminderDate = null;
          followUp = false;
          isMeetingNote = false;
        })
        .edge("clientId", "client")
        .edge("engagementId", "engagement")
        .build(),
      reminderMap.toEntity("reminder", "Reminder", "id")
        .sample({
          id = "";
          text = "";
          dueDate = 0;
          engagementId = null;
          clientId = null;
          done = false;
          createdAt = 0;
          message = "";
          completed = false;
        })
        .edge("engagementId", "engagement")
        .edge("clientId", "client")
        .build(),
      // Documents
      documentMap.toEntity("document", "Document", "id")
        .sample({
          id = "";
          name = "";
          category = "";
          status = "";
          clientId = null;
          engagementId = null;
          notes = null;
          createdAt = 0;
          updatedAt = 0;
          title = "";
          docType = "";
        })
        .edge("clientId", "client")
        .edge("engagementId", "engagement")
        .build(),
    ];
  });
};
