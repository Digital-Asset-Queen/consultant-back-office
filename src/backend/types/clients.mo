import Time "mo:core/Time";

module {
  public type Client = {
    id : Text;
    name : Text;
    industry : ?Text;
    website : ?Text;
    phone : ?Text;
    email : ?Text;
    address : ?Text;
    notes : ?Text;
    // legacy field kept for compatibility
    primaryContactId : Text;
    createdAt : Time.Time;
  };

  public type Contact = {
    id : Text;
    clientId : Text;
    name : Text;
    email : ?Text;
    phone : ?Text;
    role : ?Text;
    lastContactDate : ?Time.Time;
    notes : ?Text;
    createdAt : Time.Time;
  };
};
