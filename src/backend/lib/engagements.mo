import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/engagements";

module {
  public func getAll(engagementMap : Map.Map<Text, Types.Engagement>) : [Types.Engagement] {
    Runtime.trap("not implemented");
  };

  public func getAllByClient(engagementMap : Map.Map<Text, Types.Engagement>, clientId : Text) : [Types.Engagement] {
    Runtime.trap("not implemented");
  };

  public func getAllByContact(engagementMap : Map.Map<Text, Types.Engagement>, contactId : Text) : [Types.Engagement] {
    Runtime.trap("not implemented");
  };

  public func addUpdate(engagementMap : Map.Map<Text, Types.Engagement>, record : Types.Engagement) {
    Runtime.trap("not implemented");
  };

  public func remove(engagementMap : Map.Map<Text, Types.Engagement>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func closeOut(engagementMap : Map.Map<Text, Types.Engagement>, id : Text, now : Time.Time) {
    Runtime.trap("not implemented");
  };

  public func getAllDeliverablesByEngagement(deliverableMap : Map.Map<Text, Types.Deliverable>, engagementId : Text) : [Types.Deliverable] {
    Runtime.trap("not implemented");
  };

  public func addUpdateDeliverable(deliverableMap : Map.Map<Text, Types.Deliverable>, record : Types.Deliverable) {
    Runtime.trap("not implemented");
  };

  public func removeDeliverable(deliverableMap : Map.Map<Text, Types.Deliverable>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getAllTimeEntriesByEngagement(timeEntryMap : Map.Map<Text, Types.TimeEntry>, engagementId : Text) : [Types.TimeEntry] {
    Runtime.trap("not implemented");
  };

  public func addUpdateTimeEntry(timeEntryMap : Map.Map<Text, Types.TimeEntry>, record : Types.TimeEntry) {
    Runtime.trap("not implemented");
  };

  public func removeTimeEntry(timeEntryMap : Map.Map<Text, Types.TimeEntry>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getAllExpensesByEngagement(expenseMap : Map.Map<Text, Types.Expense>, engagementId : Text) : [Types.Expense] {
    Runtime.trap("not implemented");
  };

  public func addUpdateExpense(expenseMap : Map.Map<Text, Types.Expense>, record : Types.Expense) {
    Runtime.trap("not implemented");
  };

  public func removeExpense(expenseMap : Map.Map<Text, Types.Expense>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getWeeklyTimesheet(timeEntryMap : Map.Map<Text, Types.TimeEntry>, engagementId : Text, weekStart : Time.Time) : [Types.TimeEntry] {
    Runtime.trap("not implemented");
  };
};
