import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MomentsLib "../lib/moments";
import MediaLib "../lib/media";
import UsersLib "../lib/users";
import T "../types/moments";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  momentsState : MomentsLib.MomentsState,
  mediaState : MediaLib.MediaState,
  usersState : UsersLib.UsersState,
) {
  // ── Moment CRUD ───────────────────────────────────────────────────────────
  public shared ({ caller }) func createMoment(input : T.CreateMomentInput) : async Common.MomentId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    let momentId = MomentsLib.createMoment(momentsState, caller, input);
    // Create a default folder for the new moment
    ignore MediaLib.createDefaultFolder(mediaState, momentId);
    momentId;
  };

  public shared ({ caller }) func updateMoment(momentId : Common.MomentId, input : T.UpdateMomentInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MomentsLib.updateMoment(momentsState, caller, momentId, input);
  };

  public shared ({ caller }) func deleteMoment(momentId : Common.MomentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MomentsLib.deleteMoment(momentsState, caller, momentId);
    MediaLib.deleteMomentData(mediaState, momentId);
  };

  // ── Moment queries ────────────────────────────────────────────────────────
  public query ({ caller }) func getMomentDetail(momentId : Common.MomentId) : async ?T.MomentDetail {
    MomentsLib.getMomentDetail(momentsState, caller, momentId);
  };

  public query func searchMoments(searchText : ?Text, tags : [Text], offset : Nat, limit : Nat) : async [T.MomentListItem] {
    MomentsLib.listPublicMoments(momentsState, searchText, tags, offset, limit);
  };

  public query ({ caller }) func getMyMoments() : async [T.MomentListItem] {
    MomentsLib.listMomentsForUser(momentsState, caller, caller);
  };

  // Returns all moments the caller is associated with for calendar display.
  // Includes owned moments (callerRelation = #owned), moments with approved access,
  // and any moment the caller has RSVP'd to (callerRelation = #rsvp <status>).
  // Use callerRelation to color-differentiate on the calendar.
  public query ({ caller }) func getMyCalendarMoments() : async [T.MomentListItem] {
    MomentsLib.listCalendarMomentsForUser(momentsState, caller);
  };

  public query ({ caller }) func getFeedMoments() : async [T.MomentListItem] {
    let following = UsersLib.getFollowing(usersState, caller);
    let followingIds = following.map(func(p : UserTypes.UserProfilePublic) : Common.UserId { p.id });
    MomentsLib.listMomentsFromFollowing(momentsState, followingIds);
  };

  public query ({ caller }) func getMomentsForUser(userId : Common.UserId) : async [T.MomentListItem] {
    MomentsLib.listMomentsForUser(momentsState, caller, userId);
  };

  // ── Shareable links & QR ─────────────────────────────────────────────────
  public query func getMomentPublicUrl(momentId : Common.MomentId) : async Text {
    "/moment/" # momentId;
  };

  public query func getMomentShareUrl(momentId : Common.MomentId) : async Text {
    "/moment/" # momentId;
  };

  public query func getMomentQrCode(momentId : Common.MomentId) : async Text {
    momentId;
  };

  // ── Access control ────────────────────────────────────────────────────────
  public shared ({ caller }) func requestMomentAccess(momentId : Common.MomentId) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: must be logged in");
    };
    switch (MomentsLib.requestAccess(momentsState, caller, momentId)) {
      case (#ok(())) #ok;
      case (#err(msg)) #err(msg);
    };
  };

  public shared ({ caller }) func resolveAccessRequest(momentId : Common.MomentId, requester : Common.UserId, approved : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MomentsLib.resolveAccessRequest(momentsState, caller, momentId, requester, approved);
  };

  public shared ({ caller }) func revokeMomentAccess(momentId : Common.MomentId, userId : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MomentsLib.revokeAccess(momentsState, caller, momentId, userId);
  };

  public query ({ caller }) func listMomentAccessRequests(momentId : Common.MomentId) : async [T.AccessRequest] {
    MomentsLib.listAccessRequests(momentsState, caller, momentId);
  };

  public query ({ caller }) func getMomentAccessStatus(momentId : Common.MomentId) : async ?T.AccessStatus {
    MomentsLib.getAccessStatus(momentsState, caller, momentId);
  };

  // ── RSVP / Attendees ──────────────────────────────────────────────────────
  public shared ({ caller }) func setRsvp(momentId : Common.MomentId, status : T.RsvpStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MomentsLib.rsvp(momentsState, caller, momentId, status);
  };

  public query func getMomentAttendees(momentId : Common.MomentId) : async [T.Attendee] {
    MomentsLib.listAttendees(momentsState, momentId);
  };

  // Returns the caller's attendance info for a moment, used to generate the
  // Event Pass QR code. Only returns data when the caller is attending the moment.
  public query ({ caller }) func getMyAttendanceInfo(momentId : Common.MomentId) : async ?T.AttendanceInfo {
    if (caller.isAnonymous()) {
      return null;
    };
    MomentsLib.getAttendanceInfo(momentsState, usersState, caller, momentId);
  };

  // ── Admin ─────────────────────────────────────────────────────────────────
  public query ({ caller }) func adminListMoments() : async [T.MomentListItem] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    MomentsLib.adminListAllMoments(momentsState);
  };

  public shared ({ caller }) func adminDeleteMoment(momentId : Common.MomentId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    MomentsLib.adminDeleteMoment(momentsState, momentId);
    MediaLib.deleteMomentData(mediaState, momentId);
  };

  // Bulk import moments from a structured row list (e.g. parsed from CSV on frontend).
  // Each row is validated; required fields are title and startDate.
  // Invalid rows are collected in BulkImportResult.errors; valid rows are created.
  // visibility field: "public" → #public_, "private" → #private_, invalid → defaults to #public_.
  public shared ({ caller }) func adminBulkImportMoments(rows : [T.BulkImportMomentRow]) : async T.BulkImportResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let result = MomentsLib.adminBulkImport(momentsState, caller, rows);
    result;
  };
};
