import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
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
    // Waitlist per moment (ordered list of userIds waiting for capacity)
    waitlists : Map.Map<Common.MomentId, List.List<Common.UserId>>;
    // Counter used as part of UUID generation to ensure uniqueness within same nanosecond
    var idCounter : Nat;
    // Counter for auto-assigning agenda item IDs
    var agendaIdCounter : Nat;
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
      waitlists = Map.empty<Common.MomentId, List.List<Common.UserId>>();
      var idCounter = 0;
      var agendaIdCounter = 0;
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

  // ── Helper: count waitlist entries for a moment ────────────────────────────
  func _waitlistCount(state : MomentsState, momentId : Common.MomentId) : Nat {
    switch (state.waitlists.get(momentId)) {
      case (?wl) wl.size();
      case null 0;
    };
  };

  // ── Helper: convert Moment to MomentListItem ──────────────────────────────
  func _toListItem(state : MomentsState, m : T.Moment, callerRelation : ?T.CallerRelation, occurrenceDate : ?Common.Timestamp) : T.MomentListItem {
    {
      id = m.id;
      owner = m.owner;
      title = m.title;
      description = m.description;
      location = m.location;
      locationLat = m.locationLat;
      locationLng = m.locationLng;
      eventDate = m.eventDate;
      endDate = m.endDate;
      tags = m.tags;
      coverImage = m.coverImage;
      visibility = m.visibility;
      attendeeCount = _attendeeCount(state, m.id);
      createdAt = m.createdAt;
      callerRelation = callerRelation;
      occurrenceDate = occurrenceDate;
      recurrence = m.recurrence;
      maxAttendees = m.maxAttendees;
      waitlistCount = _waitlistCount(state, m.id);
    };
  };

  // ── Recurrence expansion ──────────────────────────────────────────────────

  // Nanoseconds-per-unit helpers used by expandRecurrenceInRange.
  // Exposed for testing — not part of the public mixin API.
  public func nanosPerDay() : Nat { 86_400 * 1_000_000_000 };

  // Expand a recurring moment's rule into concrete occurrence timestamps within
  // [rangeStart, rangeEnd] (both in nanoseconds).
  // Returns an array of occurrence timestamps (nanoseconds since epoch).
  // "edit all" semantics: the rule on the moment defines ALL occurrences.
  public func expandRecurrenceInRange(
    m : T.Moment,
    rangeStart : Common.Timestamp,
    rangeEnd : Common.Timestamp
  ) : [Common.Timestamp] {
    let rule = switch (m.recurrence) {
      case null return [];
      case (?r) r;
    };

    let nsPerDay : Int = 86_400 * 1_000_000_000;
    let interval : Int = if (rule.interval >= 1) rule.interval else 1;

    // Step size in nanoseconds depending on frequency
    let stepNs : Int = switch (rule.frequency) {
      case (#daily)   nsPerDay * interval;
      case (#weekly)  nsPerDay * 7 * interval;
      case (#monthly) nsPerDay * 30 * interval;
      case (#yearly)  nsPerDay * 365 * interval;
    };

    let results = List.empty<Common.Timestamp>();
    var current : Int = m.eventDate;
    var occurrenceCount : Nat = 0;

    // Walk occurrences forward from the event date
    while (current <= rangeEnd) {
      // Check end condition
      switch (rule.endCondition) {
        case (#endDate(ed)) {
          if (current > ed) return results.toArray();
        };
        case (#count(n)) {
          if (occurrenceCount >= n) return results.toArray();
        };
        case (#never) {};
      };

      // For weekly with daysOfWeek, emit one item per matching day-of-week offset
      if (rule.frequency == #weekly and rule.daysOfWeek.size() > 0) {
        // Each element of daysOfWeek is an offset (0 = event's day, 1 = +1 day, etc.)
        for (dayOffset in rule.daysOfWeek.values()) {
          let occTs = current + nsPerDay * dayOffset;
          if (occTs >= rangeStart and occTs <= rangeEnd) {
            // Re-check end condition per sub-occurrence
            var subExceeded = false;
            switch (rule.endCondition) {
              case (#endDate(ed)) { if (occTs > ed) subExceeded := true };
              case _ {};
            };
            if (not subExceeded) {
              results.add(occTs);
              occurrenceCount += 1;
            };
          } else if (occTs >= rangeStart) {
            occurrenceCount += 1;
          };
        };
      } else {
        // Single occurrence per step
        if (current >= rangeStart) {
          results.add(current);
        };
        occurrenceCount += 1;
      };

      current := current + stepNs;
    };

    results.toArray();
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  public func createMoment(state : MomentsState, owner : Common.UserId, input : T.CreateMomentInput) : Common.MomentId {
    let id = _generateId(state, owner);
    let now = Time.now();

    // Auto-assign IDs to agenda items
    let agendaItems = input.agendaItems.mapEntries(func(item : { time : Text; title : Text; description : ?Text }, idx : Nat) : T.AgendaItem {
      {
        id = state.agendaIdCounter + idx;
        time = item.time;
        title = item.title;
        description = item.description;
      }
    });
    state.agendaIdCounter += input.agendaItems.size();

    let moment : T.Moment = {
      id;
      owner;
      title = input.title;
      description = input.description;
      location = input.location;
      locationLat = input.locationLat;
      locationLng = input.locationLng;
      eventDate = input.eventDate;
      endDate = input.endDate;
      tags = input.tags;
      coverImage = input.coverImage;
      visibility = input.visibility;
      createdAt = now;
      updatedAt = now;
      recurrence = input.recurrence;
      maxAttendees = input.maxAttendees;
      agendaItems;
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

        // Re-assign IDs to agenda items
        let agendaItems = input.agendaItems.mapEntries(func(item : { time : Text; title : Text; description : ?Text }, idx : Nat) : T.AgendaItem {
          {
            id = state.agendaIdCounter + idx;
            time = item.time;
            title = item.title;
            description = item.description;
          }
        });
        state.agendaIdCounter += input.agendaItems.size();

        let updated : T.Moment = {
          existing with
          title = input.title;
          description = input.description;
          location = input.location;
          locationLat = input.locationLat;
          locationLng = input.locationLng;
          eventDate = input.eventDate;
          endDate = input.endDate;
          tags = input.tags;
          coverImage = input.coverImage;
          visibility = input.visibility;
          updatedAt = Time.now();
          recurrence = input.recurrence;
          maxAttendees = input.maxAttendees;
          agendaItems;
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

  // Haversine distance in km between two lat/lng points
  func _distanceKm(lat1 : Float, lng1 : Float, lat2 : Float, lng2 : Float) : Float {
    let r : Float = 6371.0;
    let dLat = (lat2 - lat1) * 3.14159265358979 / 180.0;
    let dLng = (lng2 - lng1) * 3.14159265358979 / 180.0;
    let la1 = lat1 * 3.14159265358979 / 180.0;
    let la2 = lat2 * 3.14159265358979 / 180.0;
    // sin^2(dLat/2)
    let sinDLat = _sin(dLat / 2.0);
    let sinDLng = _sin(dLng / 2.0);
    let a = sinDLat * sinDLat + _cos(la1) * _cos(la2) * sinDLng * sinDLng;
    let c = 2.0 * _atan2(_sqrt(a), _sqrt(1.0 - a));
    r * c;
  };

  // Simple float math helpers (IC Motoko Float has these via WASM)
  func _sin(x : Float) : Float {
    // Use series approximation: sin(x) ≈ x - x^3/6 + x^5/120 - x^7/5040
    let x2 = x * x;
    x * (1.0 - x2 / 6.0 * (1.0 - x2 / 20.0 * (1.0 - x2 / 42.0)));
  };

  func _cos(x : Float) : Float {
    let x2 = x * x;
    1.0 - x2 / 2.0 * (1.0 - x2 / 12.0 * (1.0 - x2 / 30.0));
  };

  func _sqrt(x : Float) : Float {
    if (x <= 0.0) return 0.0;
    var guess = x / 2.0;
    var i = 0;
    while (i < 20) {
      guess := (guess + x / guess) / 2.0;
      i += 1;
    };
    guess;
  };

  func _atan2(y : Float, x : Float) : Float {
    // atan2 approximation: atan(y/x) with quadrant handling
    if (x == 0.0) {
      if (y > 0.0) return 1.5707963267948966;
      if (y < 0.0) return -1.5707963267948966;
      return 0.0;
    };
    let r = y / x;
    let atan = r / (1.0 + 0.28125 * r * r); // fast atan approx
    if (x > 0.0) return atan;
    if (y >= 0.0) return atan + 3.14159265358979;
    atan - 3.14159265358979;
  };

  // listPublicMoments: search public moments with optional date range for recurrence expansion.
  // dateRangeStart / dateRangeEnd: when provided, recurring moments are expanded into their
  // occurrences within the range. Non-recurring moments are included if their eventDate falls
  // within the range (or always if no range filter is given).
  public func listPublicMoments(
    state : MomentsState,
    searchText : ?Text,
    filterTags : [Text],
    dateRangeStart : ?Common.Timestamp,
    dateRangeEnd : ?Common.Timestamp,
    locationLat : ?Float,
    locationLng : ?Float,
    radiusKm : ?Float,
    offset : Nat,
    limit : Nat
  ) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();

    let searchLower : ?Text = switch (searchText) {
      case null null;
      case (?s) if (s == "") null else ?s.toLower();
    };

    state.moments.forEach(func(_, m) {
      if (m.visibility != #public_) return;

      // Text search filter
      switch (searchLower) {
        case (?q) {
          let titleMatch = m.title.toLower().contains(#text q);
          let descMatch = m.description.toLower().contains(#text q);
          let tagMatch = m.tags.any(func(t : Text) : Bool { t.toLower().contains(#text q) });
          if (not titleMatch and not descMatch and not tagMatch) return;
        };
        case null {};
      };

      // Tag filter
      if (filterTags.size() > 0) {
        let hasAllTags = filterTags.all(func(ft : Text) : Bool {
          m.tags.any(func(t : Text) : Bool { t.toLower() == ft.toLower() })
        });
        if (not hasAllTags) return;
      };

      // Location filter (near me)
      switch (locationLat, locationLng, radiusKm) {
        case (?lat, ?lng, ?radius) {
          switch (m.locationLat, m.locationLng) {
            case (?mLat, ?mLng) {
              let dist = _distanceKm(lat, lng, mLat, mLng);
              if (dist > radius) return;
            };
            case _ return; // no coordinates on moment — exclude from near-me filter
          };
        };
        case _ {};
      };

      // Date range filter + recurrence expansion
      switch (m.recurrence) {
        case null {
          // Non-recurring: include if eventDate is in range (or no range given)
          switch (dateRangeStart, dateRangeEnd) {
            case (?rs, ?re) {
              if (m.eventDate < rs or m.eventDate > re) return;
              results.add(_toListItem(state, m, null, null));
            };
            case (?rs, null) {
              if (m.eventDate < rs) return;
              results.add(_toListItem(state, m, null, null));
            };
            case (null, ?re) {
              if (m.eventDate > re) return;
              results.add(_toListItem(state, m, null, null));
            };
            case (null, null) {
              results.add(_toListItem(state, m, null, null));
            };
          };
        };
        case (?_) {
          // Recurring: expand within the date range
          switch (dateRangeStart, dateRangeEnd) {
            case (?rs, ?re) {
              let occurrences = expandRecurrenceInRange(m, rs, re);
              if (occurrences.size() == 0) return;
              // Return one item per occurrence
              for (occTs in occurrences.values()) {
                results.add(_toListItem(state, m, null, ?occTs));
              };
            };
            case _ {
              // No range — just show the moment itself (base eventDate)
              results.add(_toListItem(state, m, null, null));
            };
          };
        };
      };
    });

    // Sort by effective date descending
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      let dateA = switch (a.occurrenceDate) { case (?d) d; case null a.eventDate };
      let dateB = switch (b.occurrenceDate) { case (?d) d; case null b.eventDate };
      Int.compare(dateB, dateA)
    });

    // Apply pagination
    let total = results.size();
    if (offset >= total) return [];
    let end = Nat.min(offset + limit, total);
    results.sliceToArray(offset, end);
  };

  // listMyMoments: returns all moments the caller owns PLUS private moments where
  // the caller has been approved for access. This is used by getMyMoments so that
  // approved private-moment attendees see those moments in their list.
  public func listMyMoments(state : MomentsState, caller : Common.UserId) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      if (Principal.equal(m.owner, caller)) {
        // Caller owns this moment — always include
        results.add(_toListItem(state, m, null, null));
      } else if (m.visibility == #private_) {
        // Private moment: include only if caller has been granted access
        let hasAccess = switch (state.grantedAccess.get(m.id)) {
          case (?s) s.contains(caller);
          case null false;
        };
        if (hasAccess) {
          results.add(_toListItem(state, m, null, null));
        };
      };
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
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
          results.add(_toListItem(state, m, null, null));
        };
      };
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  // listCalendarMomentsForUser: returns all moments for the calendar view within a date range.
  // Recurring moments are expanded into virtual occurrences within [rangeStart, rangeEnd].
  // Each occurrence produces a separate MomentListItem with occurrenceDate set.
  public func listCalendarMomentsForUser(
    state : MomentsState,
    userId : Common.UserId,
    rangeStart : Common.Timestamp,
    rangeEnd : Common.Timestamp
  ) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();

    // Collect all moment IDs the user owns or attends/RSVP'd
    let relevantMomentIds = Set.empty<Common.MomentId>();

    state.moments.forEach(func(momentId, m) {
      if (Principal.equal(m.owner, userId)) {
        relevantMomentIds.add(momentId);
      };
    });

    state.attendees.forEach(func(key, att) {
      let (momentId, attendeeUserId) = key;
      if (Principal.equal(attendeeUserId, userId)) {
        relevantMomentIds.add(momentId);
      };
    });

    relevantMomentIds.forEach(func(momentId) {
      switch (state.moments.get(momentId)) {
        case null {};
        case (?m) {
          let isOwner = Principal.equal(m.owner, userId);
          let relation : T.CallerRelation = if (isOwner) {
            #owned
          } else {
            switch (state.attendees.get(_pairCompare, (momentId, userId))) {
              case (?att) #rsvp(att.rsvpStatus);
              case null #following;
            };
          };

          switch (m.recurrence) {
            case null {
              // Non-recurring: include if eventDate overlaps the range
              if (m.eventDate >= rangeStart and m.eventDate <= rangeEnd) {
                results.add(_toListItem(state, m, ?relation, null));
              };
            };
            case (?_) {
              // Recurring: expand into occurrences within the range
              let occurrences = expandRecurrenceInRange(m, rangeStart, rangeEnd);
              for (occTs in occurrences.values()) {
                results.add(_toListItem(state, m, ?relation, ?occTs));
              };
            };
          };
        };
      };
    });

    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      let dateA = switch (a.occurrenceDate) { case (?d) d; case null a.eventDate };
      let dateB = switch (b.occurrenceDate) { case (?d) d; case null b.eventDate };
      Int.compare(dateA, dateB)
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
          results.add(_toListItem(state, m, ?#following, null));
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
          if (not access) {
            // Return a limited preview record so the frontend can show the
            // access-request flow instead of treating this as a 404.
            let callerStatus : ?T.AccessStatus = switch (state.accessRequests.get(_pairCompare, (momentId, caller))) {
              case (?req) ?req.status;
              case null null; // no prior request — caller can request access
            };
            return ?{
              id = m.id;
              owner = m.owner;
              title = m.title;
              description = "";
              location = "";
              locationLat = null;
              locationLng = null;
              eventDate = m.eventDate;
              endDate = null;
              tags = [];
              coverImage = m.coverImage;
              visibility = m.visibility;
              createdAt = m.createdAt;
              updatedAt = m.updatedAt;
              attendeeCount = 0;
              callerAccessStatus = callerStatus;
              isOwner = false;
              recurrence = null;
              maxAttendees = null;
              waitlistCount = 0;
              agendaItems = [];
            };
          };
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
          endDate = m.endDate;
          tags = m.tags;
          coverImage = m.coverImage;
          visibility = m.visibility;
          createdAt = m.createdAt;
          updatedAt = m.updatedAt;
          attendeeCount = _attendeeCount(state, momentId);
          callerAccessStatus = callerAccessStatus;
          isOwner = isOwner;
          recurrence = m.recurrence;
          maxAttendees = m.maxAttendees;
          waitlistCount = _waitlistCount(state, momentId);
          agendaItems = m.agendaItems;
        };
      };
    };
  };

  // ── Profile stats helpers ─────────────────────────────────────────────────

  // Count moments owned by a user (hosted count)
  public func countHostedByUser(state : MomentsState, userId : Common.UserId) : Nat {
    var count = 0;
    state.moments.forEach(func(_, m) {
      if (Principal.equal(m.owner, userId)) count += 1;
    });
    count;
  };

  // Count moments a user is attending (rsvpStatus == #attending)
  public func countAttendedByUser(state : MomentsState, userId : Common.UserId) : Nat {
    var count = 0;
    state.attendees.forEach(func(key, att) {
      let (_, attendeeId) = key;
      if (Principal.equal(attendeeId, userId) and att.rsvpStatus == #attending) {
        count += 1;
      };
    });
    // Subtract 1 for each moment they own (owner is auto-added as attending, counted in hosted)
    // Actually keep both counts independent: hosted = created, attended = all attending entries
    count;
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

  // Returns the ordered waitlist for a moment (userId array, first = next to be promoted)
  public func getMomentWaitlist(state : MomentsState, momentId : Common.MomentId) : [Common.UserId] {
    switch (state.waitlists.get(momentId)) {
      case (?wl) wl.toArray();
      case null [];
    };
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

  // adminBulkImport: creates moments from a list of CSV rows.
  // When a row has coverImageUrl set, the caller (mixin) is responsible for
  // fetching the image via http-outcall and passing the result as coverImageBlob.
  // This function is synchronous — image fetching happens in the mixin layer (async).
  // coverImageBlobs: parallel array of ?Blob (null if fetch failed or no URL provided)
  public func adminBulkImport(
    state : MomentsState,
    owner : Common.UserId,
    rows : [T.BulkImportMomentRow],
    coverImageBlobs : [?Blob]
  ) : T.BulkImportResult {
    let errors = List.empty<{ row : Nat; message : Text }>();
    let warnings = List.empty<{ row : Nat; message : Text }>();
    var successCount = 0;

    for (i in rows.keys()) {
      let row = rows[i];

      // Validate required fields
      if (row.title == "") {
        errors.add({ row = i + 1; message = "Missing required field: title" });
        // continue via label
      } else {
        let visibility : T.Visibility = if (row.visibility == "private") #private_ else #public_;

        let coverImageBlob : ?Blob = if (i < coverImageBlobs.size()) coverImageBlobs[i] else null;

        // Warn if coverImageUrl was provided but blob is null (fetch failed)
        switch (row.coverImageUrl) {
          case (?url) {
            if (url != "") {
              switch (coverImageBlob) {
                case null {
                  warnings.add({ row = i + 1; message = "Cover image could not be fetched from: " # url });
                };
                case _ {};
              };
            };
          };
          case null {};
        };

        let input : T.CreateMomentInput = {
          title = row.title;
          description = switch (row.description) { case (?d) d; case null "" };
          location = switch (row.location) { case (?l) l; case null "" };
          locationLat = row.locationLat;
          locationLng = row.locationLng;
          eventDate = row.startDate;
          endDate = row.endDate;
          tags = row.tags;
          coverImage = coverImageBlob;
          visibility;
          recurrence = null;
          maxAttendees = row.maxAttendees;
          agendaItems = [];
        };

        ignore createMoment(state, owner, input);
        successCount += 1;
      };
    };

    {
      successCount;
      errors = errors.toArray();
      warnings = warnings.toArray();
    };
  };

  public func adminListAllMoments(state : MomentsState) : [T.MomentListItem] {
    let results = List.empty<T.MomentListItem>();
    state.moments.forEach(func(_, m) {
      results.add(_toListItem(state, m, null, null));
    });
    results.sortInPlace(func(a : T.MomentListItem, b : T.MomentListItem) : { #less; #equal; #greater } {
      Int.compare(b.eventDate, a.eventDate)
    });
    results.toArray();
  };

  public func adminDeleteMoment(state : MomentsState, momentId : Common.MomentId) : () {
    _removeMomentData(state, momentId);
  };

  public func adminDeleteAllMoments(state : MomentsState) : () {
    state.moments.clear();
    state.accessRequests.clear();
    state.attendees.clear();
    state.grantedAccess.clear();
  };
};
