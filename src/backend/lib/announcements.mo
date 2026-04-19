import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
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
    let id = state.nextAnnouncementId;
    state.nextAnnouncementId += 1;

    let announcement : T.Announcement = {
      id;
      momentId;
      authorId;
      text;
      createdAt = Time.now();
    };

    let list = switch (state.announcements.get(momentId)) {
      case (?existing) existing;
      case null {
        let newList = List.empty<T.Announcement>();
        state.announcements.add(momentId, newList);
        newList;
      };
    };
    list.add(announcement);
    announcement;
  };

  public func getAnnouncementsForMoment(
    state : AnnouncementsState,
    momentId : Common.MomentId
  ) : [T.Announcement] {
    switch (state.announcements.get(momentId)) {
      case (?list) list.toArray();
      case null [];
    };
  };

  public func deleteAnnouncement(
    state : AnnouncementsState,
    momentId : Common.MomentId,
    requesterId : Common.UserId,
    announcementId : Nat
  ) : () {
    switch (state.announcements.get(momentId)) {
      case (?list) {
        // Find the announcement to verify requester is the author
        switch (list.find(func(a : T.Announcement) : Bool { a.id == announcementId })) {
          case (?a) {
            if (not (a.authorId == requesterId)) {
              // requesterId check: caller is author OR moment owner (moment owner check is in the mixin)
              Runtime.trap("Not authorized to delete this announcement");
            };
          };
          case null { Runtime.trap("Announcement not found") };
        };
        // Remove the matching announcement
        let filtered = list.filter(func(a : T.Announcement) : Bool { a.id != announcementId });
        list.clear();
        list.append(filtered);
      };
      case null { Runtime.trap("No announcements for this moment") };
    };
  };
};
