import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Types "../types/clients";

module {
  public func getAll(clientMap : Map.Map<Text, Types.Client>) : [Types.Client] {
    Runtime.trap("not implemented");
  };

  public func addUpdate(clientMap : Map.Map<Text, Types.Client>, record : Types.Client) {
    Runtime.trap("not implemented");
  };

  public func remove(clientMap : Map.Map<Text, Types.Client>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getAllContacts(contactMap : Map.Map<Text, Types.Contact>) : [Types.Contact] {
    Runtime.trap("not implemented");
  };

  public func getAllContactsByClient(contactMap : Map.Map<Text, Types.Contact>, clientId : Text) : [Types.Contact] {
    Runtime.trap("not implemented");
  };

  public func addUpdateContact(contactMap : Map.Map<Text, Types.Contact>, record : Types.Contact) {
    Runtime.trap("not implemented");
  };

  public func removeContact(contactMap : Map.Map<Text, Types.Contact>, id : Text) {
    Runtime.trap("not implemented");
  };
};
