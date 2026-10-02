import Time "mo:core/Time";

module {
  public type Engagement = {
    id : Text;
    clientId : Text;
    name : Text;
    description : ?Text;
    startDate : Time.Time;
    endDate : ?Time.Time;
    // status: active | paused | completed | cancelled
    status : Text;
    rateCardId : ?Text;
    // healthStatus: green | yellow | red
    healthStatus : ?Text;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    profileId : Text;
    contactId : Text;
  };

  public type Deliverable = {
    id : Text;
    engagementId : Text;
    name : Text;
    dueDate : ?Time.Time;
    // status: pending | in-progress | done
    status : Text;
    notes : ?Text;
    createdAt : Time.Time;
    // legacy field kept for compatibility
    title : Text;
  };

  public type TimeEntry = {
    id : Text;
    engagementId : Text;
    date : Time.Time;
    hours : Nat;
    description : ?Text;
    billable : Bool;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    deliverableId : Text;
    rateCardId : Text;
  };

  public type Expense = {
    id : Text;
    engagementId : Text;
    date : Time.Time;
    amount : Nat;
    category : Text;
    description : ?Text;
    billable : Bool;
    createdAt : Time.Time;
  };
};
