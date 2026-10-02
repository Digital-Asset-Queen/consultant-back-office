import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/documents";
import Time "mo:core/Time";

mixin (
  accessControlState : AccessControl.AccessControlState,
  docMap : Map.Map<Text, Types.Document>,
) {
  public query ({ caller }) func getDocuments(clientId : ?Text, engagementId : ?Text) : async [Types.Document] {
    ignore caller;
    let list = List.empty<Types.Document>();
    for (d in docMap.values()) {
      let matchClient = switch (clientId) {
        case null true;
        case (?cid) switch (d.clientId) { case null false; case (?dcid) dcid == cid };
      };
      let matchEng = switch (engagementId) {
        case null true;
        case (?eid) switch (d.engagementId) { case null false; case (?deid) deid == eid };
      };
      if (matchClient and matchEng) { list.add(d) };
    };
    list.toArray();
  };

  public shared ({ caller }) func createDocument(doc : Types.Document) : async () {
    ignore caller;
    docMap.add(doc.id, doc);
  };

  public shared ({ caller }) func updateDocument(doc : Types.Document) : async () {
    ignore caller;
    let now = Time.now();
    docMap.add(doc.id, { doc with updatedAt = now });
  };

  public shared ({ caller }) func deleteDocument(id : Text) : async () {
    ignore caller;
    docMap.remove(id);
  };

  // Legacy aliases
  public query ({ caller }) func getAllDocuments() : async [Types.Document] {
    ignore caller;
    let list = List.empty<Types.Document>();
    for (d in docMap.values()) { list.add(d) };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateDocument(doc : Types.Document) : async () {
    ignore caller;
    docMap.add(doc.id, doc);
  };

  public shared ({ caller }) func removeDocument(id : Text) : async () {
    ignore caller;
    docMap.remove(id);
  };
};
