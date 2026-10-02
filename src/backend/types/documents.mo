import Time "mo:core/Time";

module {
  public type Document = {
    id : Text;
    name : Text;
    category : Text;
    // status: draft | review | signed | archived
    status : Text;
    clientId : ?Text;
    engagementId : ?Text;
    notes : ?Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    // legacy fields kept for compatibility
    title : Text;
    docType : Text;
  };
};
