import Time "mo:core/Time";

module {
  public type PracticeProfile = {
    id : Text;
    practiceName : Text;
    ownerName : ?Text;
    hourlyRate : ?Nat;
    currency : Text;
    timezone : ?Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    name : Text;
    contactId : Text;
    billingAddress : Text;
    workStyle : Text;
    hasExistingClients : Bool;
  };

  public type RateCard = {
    id : Text;
    serviceName : Text;
    hourlyRate : ?Nat;
    dailyRate : ?Nat;
    projectRate : ?Nat;
    currency : Text;
    notes : ?Text;
    createdAt : Time.Time;
    // legacy field kept for compatibility
    name : Text;
  };
};
