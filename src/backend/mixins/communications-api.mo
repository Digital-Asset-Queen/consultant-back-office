import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/communications";
import FinanceTypes "../types/finance";
import EngagementTypes "../types/engagements";
import ClientTypes "../types/clients";
import List "mo:core/List";
import Time "mo:core/Time";
import Float "mo:core/Float";

mixin (
  accessControlState : AccessControl.AccessControlState,
  noteMap : Map.Map<Text, Types.Note>,
  reminderMap : Map.Map<Text, Types.Reminder>,
  invoiceMap : Map.Map<Text, FinanceTypes.Invoice>,
  proposalMap : Map.Map<Text, FinanceTypes.Proposal>,
  paymentMap : Map.Map<Text, FinanceTypes.Payment>,
  engagementMap : Map.Map<Text, EngagementTypes.Engagement>,
  timeEntryMap : Map.Map<Text, EngagementTypes.TimeEntry>,
  clientMap : Map.Map<Text, ClientTypes.Client>,
) {
  // ── Notes ──────────────────────────────────────────────────────────────────

  public query ({ caller }) func getNotes(clientId : ?Text, engagementId : ?Text) : async [Types.Note] {
    ignore caller;
    let list = List.empty<Types.Note>();
    for (n in noteMap.values()) {
      let matchClient = switch (clientId) { case null true; case (?cid) n.clientId == cid };
      let matchEng = switch (engagementId) {
        case null true;
        case (?eid) switch (n.engagementId) { case null false; case (?neid) neid == eid };
      };
      if (matchClient and matchEng) { list.add(n) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createNote(record : Types.Note) : async () {
    ignore caller;
    noteMap.add(record.id, record);
  };

  public shared ({ caller }) func updateNote(record : Types.Note) : async () {
    ignore caller;
    noteMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteNote(id : Text) : async () {
    ignore caller;
    noteMap.remove(id);
  };

  public shared ({ caller }) func markFollowUpDone(id : Text) : async Bool {
    ignore caller;
    switch (noteMap.get(id)) {
      case null false;
      case (?note) {
        noteMap.add(id, { note with followUpDone = true; followUp = false });
        true;
      };
    };
  };

  // Legacy aliases
  public query ({ caller }) func getAllNotesByEngagement(engagementId : Text) : async [Types.Note] {
    ignore caller;
    let list = List.empty<Types.Note>();
    for (n in noteMap.values()) {
      switch (n.engagementId) {
        case (?neid) if (neid == engagementId) { list.add(n) };
        case null {};
      };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllNotesByClient(clientId : Text) : async [Types.Note] {
    ignore caller;
    let list = List.empty<Types.Note>();
    for (n in noteMap.values()) {
      if (n.clientId == clientId) { list.add(n) };
    };
    list.toArray();
  };

  public query ({ caller }) func getPendingFollowUpNotes() : async [Types.Note] {
    ignore caller;
    let list = List.empty<Types.Note>();
    for (n in noteMap.values()) {
      if (n.followUp) { list.add(n) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateNote(record : Types.Note) : async () {
    ignore caller;
    noteMap.add(record.id, record);
  };

  public shared ({ caller }) func removeNote(id : Text) : async () {
    ignore caller;
    noteMap.remove(id);
  };

  // ── Reminders ──────────────────────────────────────────────────────────────

  public query ({ caller }) func getReminders(doneFilter : ?Bool) : async [Types.Reminder] {
    ignore caller;
    let list = List.empty<Types.Reminder>();
    for (r in reminderMap.values()) {
      let match = switch (doneFilter) { case null true; case (?d) r.done == d };
      if (match) { list.add(r) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createReminder(record : Types.Reminder) : async () {
    ignore caller;
    reminderMap.add(record.id, record);
  };

  public shared ({ caller }) func updateReminder(record : Types.Reminder) : async () {
    ignore caller;
    reminderMap.add(record.id, record);
  };

  public shared ({ caller }) func deleteReminder(id : Text) : async () {
    ignore caller;
    reminderMap.remove(id);
  };

  public shared ({ caller }) func markReminderDone(id : Text) : async Bool {
    ignore caller;
    switch (reminderMap.get(id)) {
      case null false;
      case (?rem) {
        reminderMap.add(id, { rem with done = true; completed = true });
        true;
      };
    };
  };

  // Legacy aliases
  public query ({ caller }) func getUpcomingReminders() : async [Types.Reminder] {
    ignore caller;
    let now = Time.now();
    let weekAhead = now + 7 * 86_400_000_000_000;
    let list = List.empty<Types.Reminder>();
    for (r in reminderMap.values()) {
      if (not r.completed and r.dueDate <= weekAhead) { list.add(r) };
    };
    list.toArray();
  };

  public query ({ caller }) func getAllRemindersByEngagement(engagementId : Text) : async [Types.Reminder] {
    ignore caller;
    let list = List.empty<Types.Reminder>();
    for (r in reminderMap.values()) {
      switch (r.engagementId) {
        case (?reid) if (reid == engagementId) { list.add(r) };
        case null {};
      };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateReminder(record : Types.Reminder) : async () {
    ignore caller;
    reminderMap.add(record.id, record);
  };

  public shared ({ caller }) func removeReminder(id : Text) : async () {
    ignore caller;
    reminderMap.remove(id);
  };

  public query ({ caller }) func getDashboardData() : async {
    activeEngagements : Nat;
    pipelineSummary : {
      pipelineValue : Float;
      pipelineWinRate : Nat;
      pipelineAverageValue : Float;
    };
    monthlyFinancials : {
      totalInvoiced : Float;
      totalCollected : Float;
      totalOutstanding : Float;
    };
    followUpsDueToday : [Types.Reminder];
    followUpsDueThisWeek : [Types.Reminder];
    overdueInvoices : [FinanceTypes.Invoice];
    expiringContracts : Nat;
    recentActivity : [Types.Note];
    unbilledTime : Nat;
  } {
    ignore caller;
    let now = Time.now();
    let DAY : Int = 86_400_000_000_000;
    let todayEnd = now + DAY;
    let weekEnd = now + 7 * DAY;
    let monthAgo = now - 30 * DAY;
    let expiryWindow = now + 30 * DAY;

    // Active engagements
    var activeCount : Nat = 0;
    var expiringCount : Nat = 0;
    for (e in engagementMap.values()) {
      if (e.status != "completed" and e.status != "cancelled") {
        activeCount += 1;
        switch (e.endDate) {
          case (?ed) { if (ed <= expiryWindow and ed >= now) { expiringCount += 1 } };
          case null {};
        };
      };
    };

    // Pipeline summary
    var pipelineTotal : Float = 0.0;
    var pipelineCount : Nat = 0;
    var acceptedCount : Nat = 0;
    var closedCount : Nat = 0;
    for (p in proposalMap.values()) {
      if (p.status != "Lost") {
        pipelineTotal += p.amount;
        pipelineCount += 1;
      };
      if (p.status == "Accepted") { acceptedCount += 1 };
      if (p.status == "Accepted" or p.status == "Lost") { closedCount += 1 };
    };
    let winRate : Nat = if (closedCount == 0) 0 else (acceptedCount * 100 / closedCount);
    let avgValue : Float = if (pipelineCount == 0) 0.0 else pipelineTotal / pipelineCount.toFloat();

    // Monthly financials (last 30 days invoices)
    var totalInvoiced : Float = 0.0;
    var totalOutstanding : Float = 0.0;
    let overdueList = List.empty<FinanceTypes.Invoice>();
    for (inv in invoiceMap.values()) {
      if (inv.issueDate >= monthAgo) { totalInvoiced += inv.totalAmount };
      if (inv.status == "sent" or inv.status == "overdue") {
        totalOutstanding += inv.totalAmount;
      };
      if (inv.status == "overdue") { overdueList.add(inv) };
    };
    var totalCollected : Float = 0.0;
    for (pay in paymentMap.values()) {
      if (pay.paymentDate >= monthAgo) { totalCollected += pay.amount };
    };

    // Reminders due today / this week
    let dueToday = List.empty<Types.Reminder>();
    let dueWeek = List.empty<Types.Reminder>();
    for (r in reminderMap.values()) {
      if (not r.done and not r.completed) {
        if (r.dueDate <= todayEnd) { dueToday.add(r) }
        else if (r.dueDate <= weekEnd) { dueWeek.add(r) };
      };
    };

    // Recent activity (last 5 notes by createdAt)
    let allNotes = List.empty<Types.Note>();
    for (n in noteMap.values()) { allNotes.add(n) };
    let sortedNotes = allNotes.toArray();
    let recentSlice = if (sortedNotes.size() <= 5) sortedNotes
      else sortedNotes.sliceToArray(0, 5);

    // Unbilled time entries (entries with no invoiced engagement)
    var unbilledHours : Nat = 0;
    for (t in timeEntryMap.values()) {
      unbilledHours += t.hours;
    };

    {
      activeEngagements = activeCount;
      pipelineSummary = {
        pipelineValue = pipelineTotal;
        pipelineWinRate = winRate;
        pipelineAverageValue = avgValue;
      };
      monthlyFinancials = {
        totalInvoiced = totalInvoiced;
        totalCollected = totalCollected;
        totalOutstanding = totalOutstanding;
      };
      followUpsDueToday = dueToday.toArray();
      followUpsDueThisWeek = dueWeek.toArray();
      overdueInvoices = overdueList.toArray();
      expiringContracts = expiringCount;
      recentActivity = recentSlice;
      unbilledTime = unbilledHours;
    };
  };
};
