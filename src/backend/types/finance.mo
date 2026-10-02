import Time "mo:core/Time";

module {
  public type LineItem = {
    description : Text;
    quantity : Float;
    unitPrice : Float;
  };

  public type Invoice = {
    id : Text;
    clientId : Text;
    engagementId : ?Text;
    invoiceNumber : Text;
    issueDate : Time.Time;
    dueDate : Time.Time;
    // status: draft | sent | paid | overdue | cancelled
    status : Text;
    lineItems : [LineItem];
    notes : ?Text;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    totalAmount : Float;
    subtotalAmount : Float;
    taxes : Float;
    paymentTerms : Text;
    paymentMethod : Text;
    contractId : Text;
  };

  public type Payment = {
    id : Text;
    invoiceId : Text;
    date : Time.Time;
    amount : Float;
    method : ?Text;
    notes : ?Text;
    createdAt : Time.Time;
    // legacy fields kept for compatibility
    clientId : Text;
    paymentDate : Time.Time;
  };

  public type Contract = {
    id : Text;
    engagementId : Text;
    // status: draft | active | expiring | expired
    status : Text;
    startDate : Time.Time;
    endDate : ?Time.Time;
    renewalDate : ?Time.Time;
    notes : ?Text;
    createdAt : Time.Time;
  };

  public type Proposal = {
    id : Text;
    clientId : Text;
    contactId : Text;
    name : Text;
    description : Text;
    amount : Float;
    status : Text;
    notes : Text;
    createdAt : Time.Time;
  };
};
