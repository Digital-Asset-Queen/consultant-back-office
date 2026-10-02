import Time "mo:core/Time";

module {
  public type Note = {
    id : Text;
    clientId : Text;
    engagementId : ?Text;
    content : Text;
    // noteType: meeting | call | email | note | follow-up
    noteType : Text;
    followUpDate : ?Time.Time;
    followUpDone : Bool;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    reminderDate : ?Time.Time;
    followUp : Bool;
    isMeetingNote : Bool;
  };

  public type Reminder = {
    id : Text;
    text : Text;
    dueDate : Time.Time;
    engagementId : ?Text;
    clientId : ?Text;
    done : Bool;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    message : Text;
    completed : Bool;
  };
};
