import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/documents";

module {
  public func getDocuments(docMap : Map.Map<Text, Types.Document>) : [Types.Document] {
    let buf = List.empty<Types.Document>();
    for ((_, doc) in docMap.entries()) {
      buf.add(doc);
    };
    buf.toArray();
  };

  public func getDocumentsByClient(docMap : Map.Map<Text, Types.Document>, clientId : Text) : [Types.Document] {
    let buf = List.empty<Types.Document>();
    for ((_, doc) in docMap.entries()) {
      if (doc.clientId == clientId) {
        buf.add(doc);
      };
    };
    buf.toArray();
  };

  public func addUpdateDocument(docMap : Map.Map<Text, Types.Document>, doc : Types.Document) {
    docMap.add(doc.id, doc);
  };

  public func removeDocument(docMap : Map.Map<Text, Types.Document>, id : Text) {
    docMap.remove(id);
  };
};
