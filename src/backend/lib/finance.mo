import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Types "../types/finance";
import EngagementTypes "../types/engagements";
import ClientTypes "../types/clients";

module {
  public func getAll(invoiceMap : Map.Map<Text, Types.Invoice>) : [Types.Invoice] {
    Runtime.trap("not implemented");
  };

  public func getOutstanding(invoiceMap : Map.Map<Text, Types.Invoice>) : [Types.Invoice] {
    Runtime.trap("not implemented");
  };

  public func getAllByClient(invoiceMap : Map.Map<Text, Types.Invoice>, clientId : Text) : [Types.Invoice] {
    Runtime.trap("not implemented");
  };

  public func getAllByEngagement(invoiceMap : Map.Map<Text, Types.Invoice>, engagementId : Text) : [Types.Invoice] {
    Runtime.trap("not implemented");
  };

  // Uses max(invoiceNumbers)+1 to avoid duplicates after deletion; starts at 1001
  public func addUpdate(invoiceMap : Map.Map<Text, Types.Invoice>, record : Types.Invoice) {
    Runtime.trap("not implemented");
  };

  public func remove(invoiceMap : Map.Map<Text, Types.Invoice>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func nextInvoiceNumber(invoiceMap : Map.Map<Text, Types.Invoice>) : Nat {
    Runtime.trap("not implemented");
  };

  public func getAllProposals(proposalMap : Map.Map<Text, Types.Proposal>) : [Types.Proposal] {
    Runtime.trap("not implemented");
  };

  public func getAllProposalsByContact(proposalMap : Map.Map<Text, Types.Proposal>, contactId : Text) : [Types.Proposal] {
    Runtime.trap("not implemented");
  };

  public func addUpdateProposal(proposalMap : Map.Map<Text, Types.Proposal>, record : Types.Proposal) {
    Runtime.trap("not implemented");
  };

  public func removeProposal(proposalMap : Map.Map<Text, Types.Proposal>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getAllPaymentsByInvoice(paymentMap : Map.Map<Text, Types.Payment>, invoiceId : Text) : [Types.Payment] {
    Runtime.trap("not implemented");
  };

  public func getAllPaymentsByClient(paymentMap : Map.Map<Text, Types.Payment>, clientId : Text) : [Types.Payment] {
    Runtime.trap("not implemented");
  };

  public func addUpdatePayment(paymentMap : Map.Map<Text, Types.Payment>, record : Types.Payment) {
    Runtime.trap("not implemented");
  };

  public func removePayment(paymentMap : Map.Map<Text, Types.Payment>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func convertProposalToEngagement(
    proposalMap : Map.Map<Text, Types.Proposal>,
    engagementMap : Map.Map<Text, EngagementTypes.Engagement>,
    proposalId : Text,
    now : Int,
  ) : Text {
    Runtime.trap("not implemented");
  };
};
