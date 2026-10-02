import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/finance";
import EngagementTypes "../types/engagements";
import ClientTypes "../types/clients";
import Int "mo:core/Int";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invoiceMap : Map.Map<Text, Types.Invoice>,
  paymentMap : Map.Map<Text, Types.Payment>,
  contractMap : Map.Map<Text, Types.Contract>,
  proposalMap : Map.Map<Text, Types.Proposal>,
  engagementMap : Map.Map<Text, EngagementTypes.Engagement>,
  clientMap : Map.Map<Text, ClientTypes.Client>,
  invoiceCounter : { var count : Nat },
) {
  func nextInvoiceNumberText() : Text {
    let now = Time.now();
    let secondsSinceEpoch = Int.abs(now) / 1_000_000_000;
    let year = 1970 + secondsSinceEpoch / 31_536_000;
    let seq = invoiceCounter.count + 1;
    let seqText = if (seq < 10) { "00" # seq.toText() }
                  else if (seq < 100) { "0" # seq.toText() }
                  else { seq.toText() };
    "INV-" # year.toText() # "-" # seqText;
  };

  // ── New canonical API ────────────────────────────────────────────────────

  public query ({ caller }) func getInvoices(clientId : ?Text, statusFilter : ?Text) : async [Types.Invoice] {
    ignore caller;
    let list = List.empty<Types.Invoice>();
    for (inv in invoiceMap.values()) {
      let matchClient = switch (clientId) {
        case (?cid) { inv.clientId == cid };
        case null { true };
      };
      let matchStatus = switch (statusFilter) {
        case (?s) { inv.status == s };
        case null { true };
      };
      if (matchClient and matchStatus) { list.add(inv) };
    };
    list.toArray();
  };

  public query ({ caller }) func getInvoice(id : Text) : async ?Types.Invoice {
    ignore caller;
    invoiceMap.get(id);
  };

  public query ({ caller }) func getNextInvoiceNumber() : async Text {
    ignore caller;
    nextInvoiceNumberText();
  };

  public shared ({ caller }) func createInvoice(
    clientId : Text,
    engagementId : ?Text,
    dueDate : Int,
    notes : ?Text,
    lineItems : [{ description : Text; quantity : Float; unitPrice : Float }],
  ) : async Types.Invoice {
    ignore caller;
    let now = Time.now();
    let numText = nextInvoiceNumberText();
    invoiceCounter.count += 1;
    let id = "inv-" # invoiceCounter.count.toText() # "-" # now.toText();
    let items : [Types.LineItem] = lineItems.map(
      func(li) {
        {
          description = li.description;
          quantity = li.quantity;
          unitPrice = li.unitPrice;
        };
      },
    );
    var total : Float = 0.0;
    for (li in items.values()) {
      total += li.quantity * li.unitPrice;
    };
    let invoice : Types.Invoice = {
      id;
      clientId;
      engagementId;
      invoiceNumber = numText;
      issueDate = now;
      dueDate;
      status = "draft";
      lineItems = items;
      notes;
      createdAt = now;
      totalAmount = total;
      subtotalAmount = total;
      taxes = 0.0;
      paymentTerms = "Net 30";
      paymentMethod = "";
      contractId = "";
    };
    invoiceMap.add(id, invoice);
    invoice;
  };

  public shared ({ caller }) func updateInvoice(id : Text, status : ?Text, notes : ?Text, dueDate : ?Int) : async ?Types.Invoice {
    ignore caller;
    switch (invoiceMap.get(id)) {
      case null { null };
      case (?inv) {
        let updated : Types.Invoice = {
          inv with
          status = switch (status) { case (?s) s; case null inv.status };
          notes = switch (notes) { case (?n) ?n; case null inv.notes };
          dueDate = switch (dueDate) { case (?d) d; case null inv.dueDate };
        };
        invoiceMap.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteInvoice(id : Text) : async Bool {
    ignore caller;
    switch (invoiceMap.get(id)) {
      case null { false };
      case (?_) { invoiceMap.remove(id); true };
    };
  };

  public query ({ caller }) func getPayments(invoiceId : Text) : async [Types.Payment] {
    ignore caller;
    let list = List.empty<Types.Payment>();
    for (p in paymentMap.values()) {
      if (p.invoiceId == invoiceId) { list.add(p) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createPayment(
    invoiceId : Text,
    date : Int,
    amount : Float,
    method : ?Text,
    notes : ?Text,
  ) : async Types.Payment {
    ignore caller;
    let now = Time.now();
    let id = "pay-" # now.toText();
    let payment : Types.Payment = {
      id;
      invoiceId;
      date;
      amount;
      method;
      notes;
      createdAt = now;
      clientId = "";
      paymentDate = date;
    };
    paymentMap.add(id, payment);
    payment;
  };

  public shared ({ caller }) func deletePayment(id : Text) : async Bool {
    ignore caller;
    switch (paymentMap.get(id)) {
      case null { false };
      case (?_) { paymentMap.remove(id); true };
    };
  };

  public query ({ caller }) func getContracts(engagementId : ?Text) : async [Types.Contract] {
    ignore caller;
    let list = List.empty<Types.Contract>();
    for (c in contractMap.values()) {
      let matches = switch (engagementId) {
        case (?eid) { c.engagementId == eid };
        case null { true };
      };
      if (matches) { list.add(c) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createContract(
    engagementId : Text,
    status : Text,
    startDate : Int,
    endDate : ?Int,
    renewalDate : ?Int,
    notes : ?Text,
  ) : async Types.Contract {
    ignore caller;
    let now = Time.now();
    let id = "con-" # now.toText();
    let contract : Types.Contract = {
      id;
      engagementId;
      status;
      startDate;
      endDate;
      renewalDate;
      notes;
      createdAt = now;
    };
    contractMap.add(id, contract);
    contract;
  };

  public shared ({ caller }) func updateContract(
    id : Text,
    status : ?Text,
    endDate : ?Int,
    renewalDate : ?Int,
    notes : ?Text,
  ) : async ?Types.Contract {
    ignore caller;
    switch (contractMap.get(id)) {
      case null { null };
      case (?c) {
        let updated : Types.Contract = {
          c with
          status = switch (status) { case (?s) s; case null c.status };
          endDate = switch (endDate) { case (?d) ?d; case null c.endDate };
          renewalDate = switch (renewalDate) { case (?d) ?d; case null c.renewalDate };
          notes = switch (notes) { case (?n) ?n; case null c.notes };
        };
        contractMap.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteContract(id : Text) : async Bool {
    ignore caller;
    switch (contractMap.get(id)) {
      case null { false };
      case (?_) { contractMap.remove(id); true };
    };
  };

  public query ({ caller }) func getProposals(clientId : ?Text, stageFilter : ?Text) : async [Types.Proposal] {
    ignore caller;
    let list = List.empty<Types.Proposal>();
    for (p in proposalMap.values()) {
      let matchClient = switch (clientId) {
        case (?cid) { p.clientId == cid };
        case null { true };
      };
      let matchStage = switch (stageFilter) {
        case (?s) { p.status == s };
        case null { true };
      };
      if (matchClient and matchStage) { list.add(p) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createProposal(
    clientId : Text,
    title : Text,
    value : ?Float,
    stage : Text,
    notes : ?Text,
  ) : async Types.Proposal {
    ignore caller;
    let now = Time.now();
    let id = "prop-" # now.toText();
    let proposalValue : Float = switch (value) { case (?v) v; case null 0.0 };
    let proposal : Types.Proposal = {
      id;
      clientId;
      contactId = "";
      name = title;
      description = "";
      amount = proposalValue;
      status = stage;
      notes = switch (notes) { case (?n) n; case null "" };
      createdAt = now;
    };
    proposalMap.add(id, proposal);
    proposal;
  };

  public shared ({ caller }) func updateProposal(
    id : Text,
    title : ?Text,
    value : ?Float,
    stage : ?Text,
    notes : ?Text,
  ) : async ?Types.Proposal {
    ignore caller;
    switch (proposalMap.get(id)) {
      case null { null };
      case (?p) {
        let updatedAmount : Float = switch (value) { case (?v) v; case null p.amount };
        let updated : Types.Proposal = {
          p with
          name = switch (title) { case (?t) t; case null p.name };
          amount = updatedAmount;
          status = switch (stage) { case (?s) s; case null p.status };
          notes = switch (notes) { case (?n) n; case null p.notes };
        };
        proposalMap.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteProposal(id : Text) : async Bool {
    ignore caller;
    switch (proposalMap.get(id)) {
      case null { false };
      case (?_) { proposalMap.remove(id); true };
    };
  };
  public query ({ caller }) func getAllInvoices() : async [Types.Invoice] {
    ignore caller;
    let list = List.empty<Types.Invoice>();
    for (inv in invoiceMap.values()) { list.add(inv) };
    list.toArray();
  };

  public query ({ caller }) func getOutstandingInvoices() : async [Types.Invoice] {
    ignore caller;
    let list = List.empty<Types.Invoice>();
    for (inv in invoiceMap.values()) {
      if (inv.status == "sent" or inv.status == "overdue") { list.add(inv) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllInvoicesByClient(clientId : Text) : async [Types.Invoice] {
    ignore caller;
    let list = List.empty<Types.Invoice>();
    for (inv in invoiceMap.values()) {
      if (inv.clientId == clientId) { list.add(inv) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllInvoicesByEngagement(engagementId : Text) : async [Types.Invoice] {
    ignore caller;
    let list = List.empty<Types.Invoice>();
    for (inv in invoiceMap.values()) {
      if (inv.engagementId == ?engagementId) { list.add(inv) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateInvoice(record : Types.Invoice) : async () {
    ignore caller;
    invoiceMap.add(record.id, record);
  };

  public shared ({ caller }) func removeInvoice(id : Text) : async () {
    ignore caller;
    invoiceMap.remove(id);
  };

  public query ({ caller }) func getAllProposals() : async [Types.Proposal] {
    ignore caller;
    let list = List.empty<Types.Proposal>();
    for (p in proposalMap.values()) { list.add(p) };
    list.toArray();
  };

  public query ({ caller }) func getAllProposalsByContact(contactId : Text) : async [Types.Proposal] {
    ignore caller;
    let list = List.empty<Types.Proposal>();
    for (p in proposalMap.values()) {
      if (p.contactId == contactId) { list.add(p) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateProposal(record : Types.Proposal) : async () {
    ignore caller;
    proposalMap.add(record.id, record);
  };

  public shared ({ caller }) func removeProposal(id : Text) : async () {
    ignore caller;
    proposalMap.remove(id);
  };

  public query ({ caller }) func getAllPaymentsByInvoice(invoiceId : Text) : async [Types.Payment] {
    ignore caller;
    let list = List.empty<Types.Payment>();
    for (p in paymentMap.values()) {
      if (p.invoiceId == invoiceId) { list.add(p) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllPaymentsByClient(clientId : Text) : async [Types.Payment] {
    ignore caller;
    let list = List.empty<Types.Payment>();
    for (p in paymentMap.values()) {
      if (p.clientId == clientId) { list.add(p) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdatePayment(record : Types.Payment) : async () {
    ignore caller;
    paymentMap.add(record.id, record);
  };

  public shared ({ caller }) func removePayment(id : Text) : async () {
    ignore caller;
    paymentMap.remove(id);
  };

  public shared ({ caller }) func convertProposalToEngagement(proposalId : Text) : async Text {
    ignore caller;
    switch (proposalMap.get(proposalId)) {
      case null { Runtime.trap("Proposal not found") };
      case (?proposal) {
        let engId = "eng-" # proposalId;
        let now = Time.now();
        let engagement : EngagementTypes.Engagement = {
          id = engId;
          profileId = "";
          clientId = proposal.clientId;
          contactId = proposal.contactId;
          name = proposal.name;
          description = ?proposal.description;
          startDate = now;
          endDate = null;
          status = "active";
          createdAt = now;
          healthStatus = null;
          rateCardId = null;
        };
        engagementMap.add(engId, engagement);
        proposalMap.add(proposalId, { proposal with status = "Accepted" });
        engId;
      };
    };
  };
};
