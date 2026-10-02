import Map "mo:core/Map";
import Debug "mo:core/Debug";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/practice";
import List "mo:core/List";

mixin (
  accessControlState : AccessControl.AccessControlState,
  practiceProfileMap : Map.Map<Text, Types.PracticeProfile>,
  rateCardMap : Map.Map<Text, Types.RateCard>,
) {
  // ── Practice Profile ────────────────────────────────────────────────────────

  public query ({ caller }) func getPracticeProfile() : async ?Types.PracticeProfile {
    ignore caller;
    let list = List.empty<Types.PracticeProfile>();
    for (p in practiceProfileMap.values()) { list.add(p) };
    if (list.size() == 0) null
    else ?(list.at(0));
  };

  public shared ({ caller }) func upsertPracticeProfile(record : Types.PracticeProfile) : async Types.PracticeProfile {
    ignore caller;
    practiceProfileMap.add(record.id, record);
    record;
  };

  // Legacy aliases
  public query ({ caller }) func getAllPracticeProfiles() : async [Types.PracticeProfile] {
    ignore caller;
    let list = List.empty<Types.PracticeProfile>();
    for (p in practiceProfileMap.values()) { list.add(p) };
    list.toArray();
  };

  public shared ({ caller }) func addUpdatePracticeProfile(record : Types.PracticeProfile) : async () {
    ignore caller;
    practiceProfileMap.add(record.id, record);
  };

  public shared ({ caller }) func removePracticeProfile(id : Text) : async () {
    ignore caller;
    practiceProfileMap.remove(id);
  };

  // ── Rate Cards ──────────────────────────────────────────────────────────────

  public query ({ caller }) func getRateCards() : async [Types.RateCard] {
    ignore caller;
    let list = List.empty<Types.RateCard>();
    for (r in rateCardMap.values()) { list.add(r) };
    list.toArray();
  };

  public shared ({ caller }) func createRateCard(record : Types.RateCard) : async Types.RateCard {
    ignore caller;
    rateCardMap.add(record.id, record);
    record;
  };

  public shared ({ caller }) func updateRateCard(id : Text, record : Types.RateCard) : async ?Types.RateCard {
    ignore caller;
    switch (rateCardMap.get(id)) {
      case null null;
      case (?_) {
        rateCardMap.add(id, record);
        ?record;
      };
    };
  };

  public shared ({ caller }) func deleteRateCard(id : Text) : async Bool {
    ignore caller;
    switch (rateCardMap.get(id)) {
      case null false;
      case (?_) { rateCardMap.remove(id); true };
    };
  };

  // Legacy aliases
  public query ({ caller }) func getAllRateCards() : async [Types.RateCard] {
    ignore caller;
    let list = List.empty<Types.RateCard>();
    for (r in rateCardMap.values()) { list.add(r) };
    list.toArray();
  };

  public shared ({ caller }) func addUpdateRateCard(record : Types.RateCard) : async () {
    ignore caller;
    rateCardMap.add(record.id, record);
  };

  public shared ({ caller }) func removeRateCard(id : Text) : async () {
    ignore caller;
    rateCardMap.remove(id);
  };
};
