import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/clients";
import EngagementTypes "../types/engagements";
import List "mo:core/List";

mixin (
  accessControlState : AccessControl.AccessControlState,
  clientMap : Map.Map<Text, Types.Client>,
  contactMap : Map.Map<Text, Types.Contact>,
  engagementMap : Map.Map<Text, EngagementTypes.Engagement>,
) {
  // ── Clients ───────────────────────────────────────────────────────────────────

  public query ({ caller }) func getClients() : async [Types.Client] {
    ignore caller;
    let list = List.empty<Types.Client>();
    for (c in clientMap.values()) { list.add(c) };
    list.toArray();
  };

  public query ({ caller }) func getClient(id : Text) : async ?Types.Client {
    ignore caller;
    clientMap.get(id);
  };

  public shared ({ caller }) func createClient(record : Types.Client) : async Types.Client {
    ignore caller;
    clientMap.add(record.id, record);
    record;
  };

  public shared ({ caller }) func updateClient(id : Text, record : Types.Client) : async ?Types.Client {
    ignore caller;
    switch (clientMap.get(id)) {
      case null null;
      case (?_) { clientMap.add(id, record); ?record };
    };
  };

  public shared ({ caller }) func deleteClient(id : Text) : async Bool {
    ignore caller;
    switch (clientMap.get(id)) {
      case null false;
      case (?_) { clientMap.remove(id); true };
    };
  };

  // ── Contacts ─────────────────────────────────────────────────────────────

  public query ({ caller }) func getContacts(clientId : ?Text) : async [Types.Contact] {
    ignore caller;
    let list = List.empty<Types.Contact>();
    for (c in contactMap.values()) {
      switch (clientId) {
        case (?cid) { if (c.clientId == cid) { list.add(c) } };
        case null { list.add(c) };
      };
    };
    list.toArray();
  };

  public shared ({ caller }) func createContact(record : Types.Contact) : async Types.Contact {
    ignore caller;
    contactMap.add(record.id, record);
    record;
  };

  public shared ({ caller }) func updateContact(id : Text, record : Types.Contact) : async ?Types.Contact {
    ignore caller;
    switch (contactMap.get(id)) {
      case null null;
      case (?_) { contactMap.add(id, record); ?record };
    };
  };

  public shared ({ caller }) func deleteContact(id : Text) : async Bool {
    ignore caller;
    switch (contactMap.get(id)) {
      case null false;
      case (?_) { contactMap.remove(id); true };
    };
  };

  // ── Legacy aliases ──────────────────────────────────────────────────────

  public query ({ caller }) func getAllClients() : async [Types.Client] {
    ignore caller;
    let list = List.empty<Types.Client>();
    for (c in clientMap.values()) { list.add(c) };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateClient(record : Types.Client) : async () {
    ignore caller;
    clientMap.add(record.id, record);
  };

  public shared ({ caller }) func removeClient(id : Text) : async () {
    ignore caller;
    clientMap.remove(id);
  };

  public query ({ caller }) func getAllContacts() : async [Types.Contact] {
    ignore caller;
    let list = List.empty<Types.Contact>();
    for (c in contactMap.values()) { list.add(c) };
    list.toArray();
  };

  public query ({ caller }) func getAllContactsByClient(clientId : Text) : async [Types.Contact] {
    ignore caller;
    let list = List.empty<Types.Contact>();
    for (c in contactMap.values()) {
      if (c.clientId == clientId) { list.add(c) };
    };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateContact(record : Types.Contact) : async () {
    ignore caller;
    contactMap.add(record.id, record);
  };

  public shared ({ caller }) func removeContact(id : Text) : async () {
    ignore caller;
    contactMap.remove(id);
  };

  public shared ({ caller }) func searchClientsContactsEngagements(searchTerm : Text) : async {
    clients : [Types.Client];
    contacts : [Types.Contact];
    engagements : [EngagementTypes.Engagement];
  } {
    ignore caller;
    let term = searchTerm.toLower();
    let clients = List.empty<Types.Client>();
    for (c in clientMap.values()) {
      if (c.name.toLower().contains(#text (term))) { clients.add(c) };
    };
    let contacts = List.empty<Types.Contact>();
    for (c in contactMap.values()) {
      let nameMatch = c.name.toLower().contains(#text (term));
      let emailMatch = switch (c.email) {
        case (?e) e.toLower().contains(#text (term));
        case null false;
      };
      if (nameMatch or emailMatch) { contacts.add(c) };
    };
    let engagements = List.empty<EngagementTypes.Engagement>();
    for (e in engagementMap.values()) {
      let nameMatch = e.name.toLower().contains(#text (term));
      let descMatch = switch (e.description) {
        case (?d) d.toLower().contains(#text (term));
        case null false;
      };
      if (nameMatch or descMatch) { engagements.add(e) };
    };
    { clients = clients.toArray(); contacts = contacts.toArray(); engagements = engagements.toArray() };
  };
};
