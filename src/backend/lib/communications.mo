import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Types "../types/communications";

module {
  public func getAllByEngagement(noteMap : Map.Map<Text, Types.Note>, engagementId : Text) : [Types.Note] {
    Runtime.trap("not implemented");
  };

  // Returns all notes where engagementId == "" for a given clientId
  public func getAllByClient(noteMap : Map.Map<Text, Types.Note>, clientId : Text) : [Types.Note] {
    Runtime.trap("not implemented");
  };

  public func getPendingFollowUps(noteMap : Map.Map<Text, Types.Note>) : [Types.Note] {
    Runtime.trap("not implemented");
  };

  public func addUpdate(noteMap : Map.Map<Text, Types.Note>, record : Types.Note) {
    Runtime.trap("not implemented");
  };

  public func remove(noteMap : Map.Map<Text, Types.Note>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getUpcomingReminders(reminderMap : Map.Map<Text, Types.Reminder>) : [Types.Reminder] {
    Runtime.trap("not implemented");
  };

  public func getAllRemindersByEngagement(reminderMap : Map.Map<Text, Types.Reminder>, engagementId : Text) : [Types.Reminder] {
    Runtime.trap("not implemented");
  };

  public func addUpdateReminder(reminderMap : Map.Map<Text, Types.Reminder>, record : Types.Reminder) {
    Runtime.trap("not implemented");
  };

  public func removeReminder(reminderMap : Map.Map<Text, Types.Reminder>, id : Text) {
    Runtime.trap("not implemented");
  };
};
