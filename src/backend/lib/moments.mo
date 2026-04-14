import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/moments";
import UsersLib "users";

module {
  // ── Internal state types ──────────────────────────────────────────────────
  public type MomentsState = {
    moments : Map.Map<Common.MomentId, T.Moment>;
    accessRequests : Map.Map<(Common.MomentId, Common.UserId), T.AccessRequest>;
    attendees : Map.Map<(Common.MomentId, Common.UserId), T.Attendee>;
    grantedAccess : Map.Map<Common.MomentId, Set.Set<Common.UserId>>;
    // Counter used as part of UUID generation to ensure uniqueness within same nanosecond
    var idCounter : Nat;
  };

  func _pairCompare(a : (Common.MomentId, Common.UserId), b : (Common.MomentId, Common.UserId)) : { #less; #equal; #greater } {
    let (aId, aUser) = a;
    let (bId, bUser) = b;
    switch (Text.compare(aId, bId)) {
      case (#equal) Principal.compare(aUser, bUser);
      case (other) other;
    };
  };

  public func initState() : MomentsState {
    {
      moments = Map.empty<Common.MomentId, T.Moment>();
      accessRequests = Map.empty<(Common.MomentId, Common.UserId), T.AccessRequest>();
      attendees = Map.empty<(Common.MomentId, Common.UserId), T.Attendee>();
      grantedAccess = Map.empty<Common.MomentId, Set.Set<Common.UserId>>();
      var idCounter = 0;
    };
  };

  // ── UUID generation (same approach as lib/memories.mo) ───────────────────
  func _generateId(state : MomentsState, caller : Common.UserId) : Common.MomentId {
    let now = Time.now();
    let counter = state.idCounter;
    state.idCounter += 1;

    let ts = Int.abs(now);
    let callerHash = caller.toText().size();

    let a = ts % 0xFFFFFFFF;
    let b = (ts / 0xFFFFFFFF + counter) % 0xFFFF;
    let c = (counter * 1000003 + callerHash) % 0xFFFF;
    let d = (ts / 0x10000 + callerHash * 31 + counter) % 0xFFFF;
    let e = (ts + counter * 999983 + callerHash * 65537) % 0xFFFFFFFFFFFF;

    _toHex8(a) # "-" # _toHex4(b) # "-4" # _toHex3(c % 0xFFF) # "-" #
    _toHexVariant(d) # _toHex3(d % 0xFFF) # "-" # _toHex12(e);
  };

  func _toHex(n : Nat) : Text {
    let digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    if (n == 0) return "0";
    var result = "";
    var remaining = n;
    while (remaining > 0) {
      result := digits[remaining % 16] # result;
      remaining := remaining / 16;
    };
    result;
  };

  func _padLeft(s : Text, len : Nat, pad : Text) : Text {
    var result = s;
    while (result.size() < len) {
      result := pad # result;
    };
    result;
  };

  func _toHex8(n : Nat) : Text { _padLeft(_toHex(n % 0xFFFFFFFF), 8, "0") };
  func _toHex4(n : Nat) : Text { _padLeft(_toHex(n % 0xFFFF), 4, "0") };
  func _toHex3(n : Nat) : Text { _padLeft(_toHex(n % 0xFFF), 3, "0") };
  func _toHex12(n : Nat) : Text { _padLeft(_toHex(n % 0xFFFFFFFFFFFF), 12, "0") };

  func _toHexVariant(n : Nat) : Text {
    let variants = ["8", "9", "a", "b"];
    variants[n % 4];
  };

  // ── Helper: count attendees for a moment ──────────────────────────────────
  func _attendeeCount(state : MomentsState, momentId : Common.MomentId) : Nat {
    var count = 0;
    state.attendees.forEach(func(key, _) {
      let (mid, _) = key;
      if (mid == momentId) count += 1;
    });
    count;
  };

  // ── Helper: convert Moment to MomentListItem ──────────────────────────────
  func _toListItem(state : MomentsState, m : T.Moment, callerRelation : ?T.CallerRelation) : T.MomentListItem {
    {
      id = m.id;
      owner = m.owner;
      title = m.title;
      description = m.description;
      location = m.location;
      locationLat = m.locationLat;
      locationLng = m.locationLng;
      eventDate = m.eventDate;
      tags = m.tags;
      coverImage = m.coverImage;
      visibility = m.visibility;
      attendeeCount = _attendeeCount(state, m.id);
      createdAt = m.createdAt;
      callerRelation = callerRelation;
    };
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  public func createMoment(state : MomentsState, owner : Common.UserId, input : T.CreateMomentInput) : Common.MomentId {
    let id = _generateId(state, owner);
    let now = Time.now();
    let moment : T.Moment = {
      id;
      owner;
      title = input.title;
      description = input.description;
      location = input.location;
      locationLat = input.locationLat;
      locationLng = input.locationLng;
      eventDate = input.eventDate;
      tags = input.tags;
      coverImage = input.coverImage;
      visibility = input.visibility;
      createdAt = now;
      updatedAt = now;
    };
    state.moments.add(id, moment);

    // Auto-add owner as attending
    let ownerAttendee : T.Attendee = {
      momentId = id;
      userId = owner;
      rsvpStatus = #attending;
      joinedAt = now;
    };
    state.attendees.add(_pairCompare, (id, owner), ownerAttendee);

    // Also add to grantedAccess set
    let accessSet = switch (state.grantedAccess.get(id)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.grantedAccess.add(id, s);
        s;
      };
    };
    accessSet.add(owner);

    id;
  };

  public func updateMoment(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId, input : T.UpdateMomentInput) : () {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) {
          Runtime.trap("Unauthorized: only owner can update");
        };
        let updated : T.Moment = {
          existing with
          title = input.title;
          description = input.description;
          location = input.location;
          locationLat = input.locationLat;
          locationLng = input.locationLng;
          eventDate = input.eventDate;
          tags = input.tags;
          coverImage = input.coverImage;
          visibility = input.visibility;
          updatedAt = Time.now();
        };
        state.moments.add(momentId, updated);
      };
    };
  };

  public func deleteMoment(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId) : () {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) {
          Runtime.trap("Unauthorized: only owner can delete");
        };
        _removeMomentData(state, momentId);
      };
    };
  };

  // Internal helper to remove all moment-related data (used by delete and admin delete)
  func _removeMomentData(state : MomentsState, momentId : Common.MomentId) {
    state.moments.remove(momentId);

    // Remove all attendees for this moment
    let keysToRemove = List.empty<(Common.MomentId, Common.UserId)>();
    state.attendees.forEach(func(key, _) {
      let (mid, _) = key;
      if (mid == momentId) keysToRemove.add(key);
    });
    keysToRemove.forEach(func(key) {
      state.attendees.remove(_pairCompare, key);
    });

    // Remove all access requests for this moment
    let arKeysToRemove = List.empty<(Common.MomentId, Common.UserId)>();
    state.accessRequests.forEach(func(key, _) {
      let (mid, _) = key;
      if (mid == momentId) arKeysToRemove.add(key);
    });
    arKeysToRemove.forEach(func(key) {
      state.accessRequests.remove(_pairCompare, key);
    });

    // Remove granted access set
    state.grantedAccess.remove(momentId);
  };

  public func getMoment(state : MomentsState, momentId : Common.MomentId) : ?T.Moment {
    state.moments.get(momentId);
  };

  // ── Listing / search ──────────────────────────────────────────────────────
  public func listPublicMoments(state : MomentsState, searchText : ?Text, filterTags : [Text], offset : Nat, limit : Nat) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      if (m.visibility == #public_) {
        // Text search filter
        let passesText = switch (searchText) {
          case null true;
          case (?q) {
            let lower = q.toLower();
            m.title.toLower().contains(#text lower) or
            m.description.toLower().contains(#text lower) or
            m.location.toLower().contains(#text lower);
          };
        };

        // Tag filter
        let passesTags = if (filterTags.size() == 0) {
          true
        } else {
          filterTags.any(func(tag : Text) : Bool {
            m.tags.any(func(t : Text) : Bool { t == tag })
          })
        };

        if (passesText and passesTags) {
          results.add(_toListItem(state, m, null));
        };
      };
    });

    // Sort by eventDate descending (newest first)
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });

    let total = results.size();
    let start = if (offset > total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    results.sliceToArray(start, end_);
  };

  // Returns moments owned by userId.
  // If caller == userId (owner viewing their own profile), all moments are returned (public + private).
  // If caller != userId (someone else viewing a profile), only public moments are returned.
  public func listMomentsForUser(state : MomentsState, caller : Common.UserId, userId : Common.UserId) : [T.MomentListItem] {
    let isOwner = Principal.equal(caller, userId);
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      if (Principal.equal(m.owner, userId)) {
        if (isOwner or m.visibility == #public_) {
          results.add(_toListItem(state, m, null));
        };
      };
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  public func listCalendarMomentsForUser(state : MomentsState, userId : Common.UserId) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    let seen = Set.empty<Common.MomentId>();

    // Add owned moments
    state.moments.forEach(func(_, m) {
      if (Principal.equal(m.owner, userId)) {
        results.add(_toListItem(state, m, ?#owned));
        seen.add(m.id);
      };
    });

    // Add moments where caller has an RSVP entry (attending/maybe/notAttending)
    state.attendees.forEach(func(key, att) {
      let (mid, uid) = key;
      if (Principal.equal(uid, userId) and not seen.contains(mid)) {
        switch (state.moments.get(mid)) {
          case (?m) {
            results.add(_toListItem(state, m, ?#rsvp(att.rsvpStatus)));
            seen.add(mid);
          };
          case null {};
        };
      };
    });

    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  public func listMomentsFromFollowing(state : MomentsState, followingIds : [Common.UserId]) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      if (m.visibility == #public_) {
        let ownerIsFollowed = followingIds.any(func(uid : Common.UserId) : Bool {
          Principal.equal(uid, m.owner)
        });
        if (ownerIsFollowed) {
          results.add(_toListItem(state, m, ?#following));
        };
      };
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  public func getMomentDetail(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId) : ?T.MomentDetail {
    switch (state.moments.get(momentId)) {
      case null null;
      case (?m) {
        let isOwner = Principal.equal(m.owner, caller);

        // For private moments, check access
        if (m.visibility == #private_ and not isOwner) {
          let access = switch (state.grantedAccess.get(momentId)) {
            case (?s) s.contains(caller);
            case null false;
          };
          if (not access) return null;
        };

        let callerAccessStatus : ?T.AccessStatus = if (isOwner) {
          null
        } else {
          switch (state.accessRequests.get(_pairCompare, (momentId, caller))) {
            case (?req) ?req.status;
            case null null;
          };
        };

        ?{
          id = m.id;
          owner = m.owner;
          title = m.title;
          description = m.description;
          location = m.location;
          locationLat = m.locationLat;
          locationLng = m.locationLng;
          eventDate = m.eventDate;
          tags = m.tags;
          coverImage = m.coverImage;
          visibility = m.visibility;
          createdAt = m.createdAt;
          updatedAt = m.updatedAt;
          attendeeCount = _attendeeCount(state, momentId);
          callerAccessStatus = callerAccessStatus;
          isOwner = isOwner;
        };
      };
    };
  };

  // ── Access control ────────────────────────────────────────────────────────
  public func hasAccess(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId) : Bool {
    switch (state.moments.get(momentId)) {
      case null false;
      case (?m) {
        if (m.visibility == #public_) return true;
        if (Principal.equal(m.owner, caller)) return true;
        switch (state.grantedAccess.get(momentId)) {
          case (?s) s.contains(caller);
          case null false;
        };
      };
    };
  };

  public func requestAccess(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId) : { #ok; #err : Text } {
    switch (state.moments.get(momentId)) {
      case null #err("Moment not found");
      case (?m) {
        if (m.visibility == #public_) return #err("Moment is public — no access request needed");
        if (Principal.equal(m.owner, caller)) return #err("You own this moment");

        // Check if already has access
        switch (state.grantedAccess.get(momentId)) {
          case (?s) {
            if (s.contains(caller)) return #err("You already have access");
          };
          case null {};
        };

        // Check if already has a pending/approved request
        switch (state.accessRequests.get(_pairCompare, (momentId, caller))) {
          case (?req) {
            switch (req.status) {
              case (#pending) return #err("You already have a pending request");
              case (#approved) return #err("You already have access");
              case _ {}; // denied or revoked — allow re-request
            };
          };
          case null {};
        };

        let req : T.AccessRequest = {
          momentId;
          requester = caller;
          status = #pending;
          requestedAt = Time.now();
          resolvedAt = null;
        };
        state.accessRequests.add(_pairCompare, (momentId, caller), req);
        #ok;
      };
    };
  };

  public func resolveAccessRequest(state : MomentsState, owner : Common.UserId, momentId : Common.MomentId, requester : Common.UserId, approved : Bool) : () {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?m) {
        if (not Principal.equal(m.owner, owner)) {
          Runtime.trap("Unauthorized: only owner can resolve access requests");
        };
        switch (state.accessRequests.get(_pairCompare, (momentId, requester))) {
          case null Runtime.trap("Access request not found");
          case (?req) {
            let newStatus : T.AccessStatus = if (approved) #approved else #denied;
            let updated : T.AccessRequest = {
              req with
              status = newStatus;
              resolvedAt = ?Time.now();
            };
            state.accessRequests.add(_pairCompare, (momentId, requester), updated);

            if (approved) {
              // Add to grantedAccess
              let accessSet = switch (state.grantedAccess.get(momentId)) {
                case (?s) s;
                case null {
                  let s = Set.empty<Common.UserId>();
                  state.grantedAccess.add(momentId, s);
                  s;
                };
              };
              accessSet.add(requester);

              // Add attendee record
              let attendee : T.Attendee = {
                momentId;
                userId = requester;
                rsvpStatus = #attending;
                joinedAt = Time.now();
              };
              state.attendees.add(_pairCompare, (momentId, requester), attendee);
            };
          };
        };
      };
    };
  };

  public func revokeAccess(state : MomentsState, owner : Common.UserId, momentId : Common.MomentId, userId : Common.UserId) : () {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?m) {
        if (not Principal.equal(m.owner, owner)) {
          Runtime.trap("Unauthorized: only owner can revoke access");
        };
        // Remove from grantedAccess
        switch (state.grantedAccess.get(momentId)) {
          case (?s) s.remove(userId);
          case null {};
        };
        // Remove attendee entry
        state.attendees.remove(_pairCompare, (momentId, userId));
        // Update access request status to revoked
        switch (state.accessRequests.get(_pairCompare, (momentId, userId))) {
          case null {};
          case (?req) {
            let updated : T.AccessRequest = {
              req with
              status = #revoked;
              resolvedAt = ?Time.now();
            };
            state.accessRequests.add(_pairCompare, (momentId, userId), updated);
          };
        };
      };
    };
  };

  public func listAccessRequests(state : MomentsState, owner : Common.UserId, momentId : Common.MomentId) : [T.AccessRequest] {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?m) {
        if (not Principal.equal(m.owner, owner)) {
          Runtime.trap("Unauthorized: only owner can list access requests");
        };
        let results = List.empty<T.AccessRequest>();
        state.accessRequests.forEach(func(key, req) {
          let (mid, _) = key;
          if (mid == momentId) results.add(req);
        });
        results.toArray();
      };
    };
  };

  public func getAccessStatus(state : MomentsState, caller : Common.UserId, momentId : Common.MomentId) : ?T.AccessStatus {
    switch (state.moments.get(momentId)) {
      case null null;
      case (?m) {
        if (Principal.equal(m.owner, caller)) return ?#approved;
        if (m.visibility == #public_) return ?#approved;
        switch (state.accessRequests.get(_pairCompare, (momentId, caller))) {
          case (?req) ?req.status;
          case null null;
        };
      };
    };
  };

  // ── Attendees / RSVP ─────────────────────────────────────────────────────
  public func rsvp(state : MomentsState, userId : Common.UserId, momentId : Common.MomentId, status : T.RsvpStatus) : () {
    switch (state.moments.get(momentId)) {
      case null Runtime.trap("Moment not found");
      case (?m) {
        // For private moments, verify caller has access
        if (m.visibility == #private_) {
          let access = switch (state.grantedAccess.get(momentId)) {
            case (?s) s.contains(userId) or Principal.equal(m.owner, userId);
            case null Principal.equal(m.owner, userId);
          };
          if (not access) Runtime.trap("Access denied: not approved for this private moment");
        };

        let existing = state.attendees.get(_pairCompare, (momentId, userId));
        let joinedAt = switch (existing) {
          case (?att) att.joinedAt;
          case null Time.now();
        };
        let attendee : T.Attendee = {
          momentId;
          userId;
          rsvpStatus = status;
          joinedAt;
        };
        state.attendees.add(_pairCompare, (momentId, userId), attendee);
      };
    };
  };

  public func listAttendees(state : MomentsState, momentId : Common.MomentId) : [T.Attendee] {
    let results = List.empty<T.Attendee>();
    state.attendees.forEach(func(key, att) {
      let (mid, _) = key;
      if (mid == momentId) results.add(att);
    });
    results.toArray();
  };

  public func getAttendanceInfo(state : MomentsState, usersState : UsersLib.UsersState, userId : Common.UserId, momentId : Common.MomentId) : ?T.AttendanceInfo {
    switch (state.moments.get(momentId)) {
      case null null;
      case (?m) {
        switch (state.attendees.get(_pairCompare, (momentId, userId))) {
          case null null;
          case (?att) {
            let statusText = switch (att.rsvpStatus) {
              case (#attending) "attending";
              case (#maybe) "maybe";
              case (#notAttending) "notAttending";
            };
            let username = switch (usersState.profiles.get(userId)) {
              case (?profile) profile.username;
              case null userId.toText();
            };
            ?{
              username;
              rsvpTime = att.joinedAt;
              momentDate = m.eventDate;
              momentTitle = m.title;
              status = statusText;
            };
          };
        };
      };
    };
  };

  // ── Admin helpers ─────────────────────────────────────────────────────────
  public func adminBulkImport(state : MomentsState, owner : Common.UserId, rows : [T.BulkImportMomentRow]) : T.BulkImportResult {
    var successCount = 0;
    let errors = List.empty<{ row : Nat; message : Text }>();

    let rowList = List.fromArray<T.BulkImportMomentRow>(rows);
    rowList.forEachEntry(func(idx : Nat, row : T.BulkImportMomentRow) {
      if (row.title.size() == 0) {
        errors.add({ row = idx; message = "Missing required field: title" });
      } else {
        let vis : T.Visibility = if (row.visibility == "private") #private_ else #public_;
        let input : T.CreateMomentInput = {
          title = row.title;
          description = switch (row.description) { case (?d) d; case null "" };
          location = switch (row.location) { case (?l) l; case null "" };
          locationLat = row.locationLat;
          locationLng = row.locationLng;
          eventDate = row.startDate;
          tags = row.tags;
          coverImage = null;
          visibility = vis;
        };
        ignore createMoment(state, owner, input);
        successCount += 1;
      };
    });

    { successCount; errors = errors.toArray() };
  };

  public func adminListAllMoments(state : MomentsState) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      results.add(_toListItem(state, m, null));
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  public func adminDeleteMoment(state : MomentsState, momentId : Common.MomentId) : () {
    _removeMomentData(state, momentId);
  };
};
