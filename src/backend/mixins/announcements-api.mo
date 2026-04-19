import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Common "../types/common";
import T "../types/announcements";
import MomentsLib "../lib/moments";
import AnnouncementsLib "../lib/announcements";

mixin (
  accessControlState : AccessControl.AccessControlState,
  momentsState : MomentsLib.MomentsState,
  announcementsState : AnnouncementsLib.AnnouncementsState
) {
  // Post an announcement to a moment (moment owner only)
  public shared ({ caller }) func postAnnouncement(
    momentId : Common.MomentId,
    text : Text
  ) : async T.Announcement {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    // Verify caller is the moment owner
    switch (momentsState.moments.get(momentId)) {
      case (?moment) {
        if (not Principal.equal(moment.owner, caller)) {
          Runtime.trap("Unauthorized: only the moment owner can post announcements");
        };
      };
      case null { Runtime.trap("Moment not found") };
    };
    AnnouncementsLib.postAnnouncement(announcementsState, momentId, caller, text);
  };

  // Get all announcements for a moment (visible to anyone who can see the moment)
  public query ({ caller }) func getAnnouncementsForMoment(
    momentId : Common.MomentId
  ) : async [T.Announcement] {
    AnnouncementsLib.getAnnouncementsForMoment(announcementsState, momentId);
  };

  // Delete an announcement — allowed for moment owner OR announcement author
  public shared ({ caller }) func deleteAnnouncement(
    momentId : Common.MomentId,
    announcementId : Nat
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };

    // Check if caller is the moment owner (allowed to delete any announcement)
    let isMomentOwner = switch (momentsState.moments.get(momentId)) {
      case (?moment) Principal.equal(moment.owner, caller);
      case null false;
    };

    if (isMomentOwner) {
      // Moment owner can delete any announcement — find the announcement to get its authorId
      let announcements = AnnouncementsLib.getAnnouncementsForMoment(announcementsState, momentId);
      var found : ?T.Announcement = null;
      for (a in announcements.vals()) {
        if (a.id == announcementId) { found := ?a };
      };
      switch (found) {
        case (?a) {
          // Call lib with the actual author id (owner can always delete)
          AnnouncementsLib.deleteAnnouncement(announcementsState, momentId, a.authorId, announcementId);
        };
        case null { Runtime.trap("Announcement not found") };
      };
    } else {
      // Non-owner: lib will enforce that caller is the author
      AnnouncementsLib.deleteAnnouncement(announcementsState, momentId, caller, announcementId);
    };
  };
};
