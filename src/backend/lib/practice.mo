import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Types "../types/practice";

module {
  public func getAll(practiceProfileMap : Map.Map<Text, Types.PracticeProfile>) : [Types.PracticeProfile] {
    Runtime.trap("not implemented");
  };

  public func addUpdate(practiceProfileMap : Map.Map<Text, Types.PracticeProfile>, record : Types.PracticeProfile) {
    Runtime.trap("not implemented");
  };

  public func remove(practiceProfileMap : Map.Map<Text, Types.PracticeProfile>, id : Text) {
    Runtime.trap("not implemented");
  };

  public func getAllRateCards(rateCardMap : Map.Map<Text, Types.RateCard>) : [Types.RateCard] {
    Runtime.trap("not implemented");
  };

  public func addUpdateRateCard(rateCardMap : Map.Map<Text, Types.RateCard>, record : Types.RateCard) {
    Runtime.trap("not implemented");
  };

  public func removeRateCard(rateCardMap : Map.Map<Text, Types.RateCard>, id : Text) {
    Runtime.trap("not implemented");
  };
};
