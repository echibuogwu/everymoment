import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/announcements";
import MomentsLib "../lib/moments";
import AnnouncementsLib "../lib/announcements";

mixin (
  accessControlState : AccessControl.AccessControlState,
  momentsState : MomentsLib.MomentsState,
  announcementsState : AnnouncementsLib.AnnouncementsState
) {
  // Post an announcement to a moment (owner only)
  public shared ({ caller }) func postAnnouncement(
    momentId : Common.MomentId,
    text : Text
  ) : async T.Announcement {
    Runtime.trap("not implemented");
  };

  // Get all announcements for a moment (visible to all with access)
  public query ({ caller }) func getAnnouncementsForMoment(
    momentId : Common.MomentId
  ) : async [T.Announcement] {
    Runtime.trap("not implemented");
  };

  // Delete an announcement (owner only)
  public shared ({ caller }) func deleteAnnouncement(
    momentId : Common.MomentId,
    announcementId : Nat
  ) : async () {
    Runtime.trap("not implemented");
  };
};
