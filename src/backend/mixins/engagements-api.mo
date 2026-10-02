import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/engagements";
import List "mo:core/List";

mixin (
  accessControlState : AccessControl.AccessControlState,
  engagementMap : Map.Map<Text, Types.Engagement>,
  deliverableMap : Map.Map<Text, Types.Deliverable>,
  timeEntryMap : Map.Map<Text, Types.TimeEntry>,
  expenseMap : Map.Map<Text, Types.Expense>,
) {
  // ── Engagements ────────────────────────────────────────────────────────────

  public query ({ caller }) func getEngagements(clientId : ?Text) : async [Types.Engagement] {
    ignore caller;
    let list = List.empty<Types.Engagement>();
    for (e in engagementMap.values()) {
      let match = switch (clientId) {
        case null true;
        case (?cid) e.clientId == cid;
      };
      if (match) { list.add(e) };
    };
    list.toArray();
  };

  public query ({ caller }) func getEngagement(id : Text) : async ?Types.Engagement {
    ignore caller;
    engagementMap.get(id);
  };

  public shared ({ caller }) func createEngagement(record : Types.Engagement) : async () {
    ignore caller;
    engagementMap.add(record.id, record);
  };

  public shared ({ caller }) func updateEngagement(record : Types.Engagement) : async () {
    ignore caller;
    engagementMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteEngagement(id : Text) : async () {
    ignore caller;
    engagementMap.remove(id);
  };

  // ── Legacy aliases (preserve existing frontend compatibility) ──────────────

  public query ({ caller }) func getAllEngagements() : async [Types.Engagement] {
    ignore caller;
    let list = List.empty<Types.Engagement>();
    for (e in engagementMap.values()) { list.add(e) };
    list.toArray();
  };

  public query ({ caller }) func getAllEngagementsByClient(clientId : Text) : async [Types.Engagement] {
    ignore caller;
    let list = List.empty<Types.Engagement>();
    for (e in engagementMap.values()) {
      if (e.clientId == clientId) { list.add(e) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllEngagementsByContact(contactId : Text) : async [Types.Engagement] {
    ignore caller;
    let list = List.empty<Types.Engagement>();
    for (e in engagementMap.values()) {
      if (e.contactId == contactId) { list.add(e) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateEngagement(record : Types.Engagement) : async () {
    ignore caller;
    engagementMap.add(record.id, record);
  };

  public shared ({ caller }) func removeEngagement(id : Text) : async () {
    ignore caller;
    engagementMap.remove(id);
  };

  public shared ({ caller }) func closeOutEngagement(engagementId : Text) : async () {
    ignore caller;
    switch (engagementMap.get(engagementId)) {
      case (?eng) { engagementMap.add(engagementId, { eng with status = "completed" }) };
      case null {};
    };
  };

  // ── Deliverables ───────────────────────────────────────────────────────────

  public query ({ caller }) func getDeliverables(engagementId : Text) : async [Types.Deliverable] {
    ignore caller;
    let list = List.empty<Types.Deliverable>();
    for (d in deliverableMap.values()) {
      if (d.engagementId == engagementId) { list.add(d) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createDeliverable(record : Types.Deliverable) : async () {
    ignore caller;
    deliverableMap.add(record.id, record);
  };

  public shared ({ caller }) func updateDeliverable(record : Types.Deliverable) : async () {
    ignore caller;
    deliverableMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteDeliverable(id : Text) : async () {
    ignore caller;
    deliverableMap.remove(id);
  };

  // Legacy aliases
  public query ({ caller }) func getAllDeliverablesByEngagement(engagementId : Text) : async [Types.Deliverable] {
    ignore caller;
    let list = List.empty<Types.Deliverable>();
    for (d in deliverableMap.values()) {
      if (d.engagementId == engagementId) { list.add(d) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateDeliverable(record : Types.Deliverable) : async () {
    ignore caller;
    deliverableMap.add(record.id, record);
  };

  public shared ({ caller }) func removeDeliverable(id : Text) : async () {
    ignore caller;
    deliverableMap.remove(id);
  };

  // ── Time Entries ───────────────────────────────────────────────────────────

  public query ({ caller }) func getTimeEntries(engagementId : ?Text, clientIdFilter : ?Text) : async [Types.TimeEntry] {
    ignore (caller, clientIdFilter);
    let list = List.empty<Types.TimeEntry>();
    for (t in timeEntryMap.values()) {
      let match = switch (engagementId) {
        case null true;
        case (?eid) t.engagementId == eid;
      };
      if (match) { list.add(t) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createTimeEntry(record : Types.TimeEntry) : async () {
    ignore caller;
    timeEntryMap.add(record.id, record);
  };

  public shared ({ caller }) func updateTimeEntry(record : Types.TimeEntry) : async () {
    ignore caller;
    timeEntryMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteTimeEntry(id : Text) : async () {
    ignore caller;
    timeEntryMap.remove(id);
  };

  // Legacy aliases
  public query ({ caller }) func getAllTimeEntriesByEngagement(engagementId : Text) : async [Types.TimeEntry] {
    ignore caller;
    let list = List.empty<Types.TimeEntry>();
    for (t in timeEntryMap.values()) {
      if (t.engagementId == engagementId) { list.add(t) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateTimeEntry(record : Types.TimeEntry) : async () {
    ignore caller;
    timeEntryMap.add(record.id, record);
  };

  public shared ({ caller }) func removeTimeEntry(id : Text) : async () {
    ignore caller;
    timeEntryMap.remove(id);
  };

  // ── Expenses ───────────────────────────────────────────────────────────────

  public query ({ caller }) func getExpenses(engagementId : ?Text, clientIdFilter : ?Text) : async [Types.Expense] {
    ignore (caller, clientIdFilter);
    let list = List.empty<Types.Expense>();
    for (e in expenseMap.values()) {
      let match = switch (engagementId) {
        case null true;
        case (?eid) e.engagementId == eid;
      };
      if (match) { list.add(e) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createExpense(record : Types.Expense) : async () {
    ignore caller;
    expenseMap.add(record.id, record);
  };

  public shared ({ caller }) func updateExpense(record : Types.Expense) : async () {
    ignore caller;
    expenseMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteExpense(id : Text) : async () {
    ignore caller;
    expenseMap.remove(id);
  };

  // Legacy aliases
  public query ({ caller }) func getAllExpensesByEngagement(engagementId : Text) : async [Types.Expense] {
    ignore caller;
    let list = List.empty<Types.Expense>();
    for (e in expenseMap.values()) {
      if (e.engagementId == engagementId) { list.add(e) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateExpense(record : Types.Expense) : async () {
    ignore caller;
    expenseMap.add(record.id, record);
  };

  public shared ({ caller }) func removeExpense(id : Text) : async () {
    ignore caller;
    expenseMap.remove(id);
  };

  public query ({ caller }) func getWeeklyTimesheet(engagementId : Text, weekStart : Time.Time) : async [Types.TimeEntry] {
    ignore caller;
    let weekEnd = weekStart + 7 * 86_400_000_000_000;
    let list = List.empty<Types.TimeEntry>();
    for (t in timeEntryMap.values()) {
      if (t.engagementId == engagementId and t.date >= weekStart and t.date < weekEnd) {
        list.add(t);
      };
    };
    list.toArray();
  };
};
