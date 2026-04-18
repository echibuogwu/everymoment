import Runtime "mo:core/Runtime";
import List "mo:core/List";
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

  // searchMoments: full-featured search with optional date range and location filters.
  // Recurring moments are expanded into virtual occurrences within the date range.
  // dateRangeStart / dateRangeEnd: nanosecond timestamps (null = no range filter)
  // locationLat / locationLng / radiusKm: for "near me" filtering (null = no location filter)
  public query func searchMoments(
    searchText : ?Text,
    tags : [Text],
    dateRangeStart : ?Common.Timestamp,
    dateRangeEnd : ?Common.Timestamp,
    locationLat : ?Float,
    locationLng : ?Float,
    radiusKm : ?Float,
    offset : Nat,
    limit : Nat
  ) : async [T.MomentListItem] {
    MomentsLib.listPublicMoments(
      momentsState,
      searchText,
      tags,
      dateRangeStart,
      dateRangeEnd,
      locationLat,
      locationLng,
      radiusKm,
      offset,
      limit
    );
  };

  public query ({ caller }) func getMyMoments() : async [T.MomentListItem] {
    MomentsLib.listMomentsForUser(momentsState, caller, caller);
  };

  // Returns all moments the caller is associated with for calendar display within a date range.
  // Recurring moments are expanded into virtual occurrences within [rangeStart, rangeEnd].
  // Each occurrence has occurrenceDate set; callerRelation differentiates owned vs RSVP'd moments.
  public query ({ caller }) func getMyCalendarMoments(
    rangeStart : Common.Timestamp,
    rangeEnd : Common.Timestamp
  ) : async [T.MomentListItem] {
    MomentsLib.listCalendarMomentsForUser(momentsState, caller, rangeStart, rangeEnd);
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

  // Returns the ordered waitlist for a moment (userId array, first = next to be promoted)
  public query func getMomentWaitlist(momentId : Common.MomentId) : async [Common.UserId] {
    MomentsLib.getMomentWaitlist(momentsState, momentId);
  };

  // Returns the caller's attendance info for a moment, used to generate the
  // Event Pass QR code. Only returns data when the caller is attending the moment.
  public query ({ caller }) func getMyAttendanceInfo(momentId : Common.MomentId) : async ?T.AttendanceInfo {
    if (caller.isAnonymous()) {
      return null;
    };
    MomentsLib.getAttendanceInfo(momentsState, usersState, caller, momentId);
  };

  // Public endpoint: returns attendance info for any user+moment combination.
  // No authentication required — callable by anonymous users (e.g. QR code scanners).
  // Returns #err if the moment or attendee record does not exist.
  public query func getEventPassInfo(momentId : Common.MomentId, userId : Common.UserId) : async { #ok : T.AttendanceInfo; #err : Text } {
    switch (MomentsLib.getAttendanceInfo(momentsState, usersState, userId, momentId)) {
      case null #err("Attendance record not found");
      case (?info) #ok(info);
    };
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

  public shared ({ caller }) func adminDeleteAllMoments() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    MomentsLib.adminDeleteAllMoments(momentsState);
  };

  // Bulk import moments from a structured row list (e.g. parsed from CSV on frontend).
  // Each row is validated; required fields are title and startDate.
  // Invalid rows are collected in BulkImportResult.errors; valid rows are created.
  // visibility field: "public" → #public_, "private" → #private_, invalid → defaults to #public_.
  // coverImageUrl field: when provided, the image is fetched via http-outcall and stored.
  //   If fetch fails, the moment is still created but a warning is added for that row.
  // This cover image fetch logic ONLY runs in this admin import function — normal createMoment
  // is completely unaffected.
  public shared ({ caller }) func adminBulkImportMoments(rows : [T.BulkImportMomentRow]) : async T.BulkImportResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };

    // IC management canister for http_request
    let ic = actor "aaaaa-aa" : actor {
      http_request : ({
        url : Text;
        max_response_bytes : ?Nat64;
        method : { #get; #head; #post };
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        transform : ?{
          function : shared query ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
          context : Blob;
        };
        is_replicated : ?Bool;
      }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
    };

    // Fetch cover image blobs in sequence — one http-outcall per row that has a coverImageUrl
    let coverImageBlobs = List.empty<?Blob>();
    for (row in rows.values()) {
      switch (row.coverImageUrl) {
        case (?url) {
          if (url != "") {
            try {
              let response = await (with cycles = 1_000_000_000) ic.http_request({
                url;
                max_response_bytes = ?2_097_152; // 2 MB cap
                method = #get;
                headers = [];
                body = null;
                transform = null;
                is_replicated = ?false;
              });
              if (response.status >= 200 and response.status < 300 and response.body.size() > 0) {
                coverImageBlobs.add(?response.body);
              } else {
                coverImageBlobs.add(null);
              };
            } catch (_) {
              coverImageBlobs.add(null);
            };
          } else {
            coverImageBlobs.add(null);
          };
        };
        case null {
          coverImageBlobs.add(null);
        };
      };
    };

    MomentsLib.adminBulkImport(momentsState, caller, rows, coverImageBlobs.toArray());
  };
};
