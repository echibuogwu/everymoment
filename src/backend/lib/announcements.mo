import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/announcements";

module {
  public type AnnouncementsState = {
    // Keyed by momentId → list of announcements
    announcements : Map.Map<Common.MomentId, List.List<T.Announcement>>;
    var nextAnnouncementId : Nat;
  };

  public func initState() : AnnouncementsState {
    {
      announcements = Map.empty<Common.MomentId, List.List<T.Announcement>>();
      var nextAnnouncementId = 0;
    };
  };

  public func postAnnouncement(
    state : AnnouncementsState,
    momentId : Common.MomentId,
    authorId : Common.UserId,
    text : Text
  ) : T.Announcement {
    Runtime.trap("not implemented");
  };

  public func getAnnouncementsForMoment(
    state : AnnouncementsState,
    momentId : Common.MomentId
  ) : [T.Announcement] {
    Runtime.trap("not implemented");
  };

  public func deleteAnnouncement(
    state : AnnouncementsState,
    momentId : Common.MomentId,
    authorId : Common.UserId,
    announcementId : Nat
  ) : () {
    Runtime.trap("not implemented");
  };
};
