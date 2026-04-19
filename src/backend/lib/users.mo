import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Types "../types/users";
import Common "../types/common";

module {
  // ── Internal state types ──────────────────────────────────────────────────
  public type UsersState = {
    profiles : Map.Map<Common.UserId, Types.UserProfile>;
    usernameIndex : Map.Map<Text, Common.UserId>;
    followers : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    following : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    // Bookmarked moment IDs per user
    bookmarks : Map.Map<Common.UserId, Set.Set<Common.MomentId>>;
    // Follow requests (for private profiles): keyed by requestId
    followRequests : Map.Map<Text, Types.FollowRequest>;
    // Index: target user → list of pending request IDs
    pendingRequestsByUser : Map.Map<Common.UserId, List.List<Text>>;
    var nextFollowRequestId : Nat;
  };

  public func initState() : UsersState {
    {
      profiles = Map.empty<Common.UserId, Types.UserProfile>();
      usernameIndex = Map.empty<Text, Common.UserId>();
      followers = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      following = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      bookmarks = Map.empty<Common.UserId, Set.Set<Common.MomentId>>();
      followRequests = Map.empty<Text, Types.FollowRequest>();
      pendingRequestsByUser = Map.empty<Common.UserId, List.List<Text>>();
      var nextFollowRequestId = 0;
    };
  };

  // ── Internal helpers ──────────────────────────────────────────────────────

  func followerCount(state : UsersState, userId : Common.UserId) : Nat {
    switch (state.followers.get(userId)) {
      case (?set) set.size();
      case null 0;
    };
  };

  func followingCount(state : UsersState, userId : Common.UserId) : Nat {
    switch (state.following.get(userId)) {
      case (?set) set.size();
      case null 0;
    };
  };

  // Full public view (for the profile owner or followers of a public profile)
  // hostedCount / attendedCount must be supplied by callers that have access to moments state;
  // pass 0 when moments state is not available (e.g. follower/following list helpers).
  func _toPublicFull(state : UsersState, profile : Types.UserProfile, hostedCount : Nat, attendedCount : Nat) : Types.UserProfilePublic {
    {
      id = profile.id;
      username = profile.username;
      photo = profile.photo;
      name = profile.name;
      location = profile.location;
      socials = profile.socials;
      paymentDetails = profile.paymentDetails;
      followersCount = followerCount(state, profile.id);
      followingCount = followingCount(state, profile.id);
      createdAt = profile.createdAt;
      isPrivateProfile = profile.isPrivateProfile;
      hideAttendingList = profile.hideAttendingList;
      hostedCount;
      attendedCount;
      isPrivateHidden = false;
    };
  };

  // Minimal view for non-followers of a private profile
  func _toPublicMinimal(state : UsersState, profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      username = profile.username;
      photo = profile.photo;
      name = profile.name;
      location = null;
      socials = null;
      paymentDetails = null;
      followersCount = followerCount(state, profile.id);
      followingCount = followingCount(state, profile.id);
      createdAt = profile.createdAt;
      isPrivateProfile = profile.isPrivateProfile;
      hideAttendingList = profile.hideAttendingList;
      hostedCount = 0;
      attendedCount = 0;
      isPrivateHidden = true;
    };
  };

  // Kept for internal use by getFollowers/getFollowing (always full view, counts = 0)
  func _toPublic(state : UsersState, profile : Types.UserProfile) : Types.UserProfilePublic {
    _toPublicFull(state, profile, 0, 0);
  };

  // ── Profile management ────────────────────────────────────────────────────

  public func hasProfile(state : UsersState, userId : Common.UserId) : Bool {
    state.profiles.containsKey(userId);
  };

  public func isUsernameTaken(state : UsersState, username : Text) : Bool {
    state.usernameIndex.containsKey(username);
  };

  public func saveProfile(state : UsersState, userId : Common.UserId, input : Types.SaveProfileInput) : () {
    // Validate username uniqueness: allow if taken only by this same user
    switch (state.usernameIndex.get(input.username)) {
      case (?existingId) {
        if (not Principal.equal(existingId, userId)) {
          Runtime.trap("Username is already taken");
        };
      };
      case null {};
    };

    // Remove old username index entry if user already has a profile with a different username
    switch (state.profiles.get(userId)) {
      case (?existing) {
        if (existing.username != input.username) {
          state.usernameIndex.remove(existing.username);
        };
      };
      case null {};
    };

    // Build the profile record
    let now = Time.now();
    let createdAt : Common.Timestamp = switch (state.profiles.get(userId)) {
      case (?existing) existing.createdAt;
      case null now;
    };

    let profile : Types.UserProfile = {
      id = userId;
      username = input.username;
      photo = input.photo;
      name = input.name;
      location = input.location;
      socials = input.socials;
      paymentDetails = input.paymentDetails;
      createdAt = createdAt;
      isPrivateProfile = input.isPrivateProfile;
      hideAttendingList = input.hideAttendingList;
    };

    state.profiles.add(userId, profile);
    state.usernameIndex.add(input.username, userId);
  };

  // Get profile with privacy enforcement
  // requesterId = null means anonymous/public access
  // hostedCount / attendedCount: pass real values when available (mixin layer),
  // or 0 when moments state is not accessible.
  public func getProfileWithPrivacy(
    state : UsersState,
    targetId : Common.UserId,
    requesterId : ?Common.UserId,
    hostedCount : Nat,
    attendedCount : Nat
  ) : ?Types.UserProfilePublic {
    switch (state.profiles.get(targetId)) {
      case (?profile) {
        // Owner always gets full view
        let isOwner = switch (requesterId) {
          case (?rid) Principal.equal(rid, targetId);
          case null false;
        };
        if (isOwner) {
          return ?_toPublicFull(state, profile, hostedCount, attendedCount);
        };

        if (profile.isPrivateProfile) {
          // Check if requester follows target
          let isFollower = switch (requesterId) {
            case (?rid) isFollowing(state, rid, targetId);
            case null false;
          };
          if (isFollower) {
            ?_toPublicFull(state, profile, hostedCount, attendedCount);
          } else {
            ?_toPublicMinimal(state, profile);
          };
        } else {
          ?_toPublicFull(state, profile, hostedCount, attendedCount);
        };
      };
      case null null;
    };
  };

  public func getProfile(state : UsersState, userId : Common.UserId) : ?Types.UserProfilePublic {
    switch (state.profiles.get(userId)) {
      case (?profile) ?_toPublic(state, profile);
      case null null;
    };
  };

  // Resolve a username to its userId — used by the mixin layer to look up
  // hosted/attended counts before calling getProfileWithPrivacy.
  public func resolveUsername(state : UsersState, username : Text) : ?Common.UserId {
    state.usernameIndex.get(username);
  };

  public func getProfileByUsername(state : UsersState, username : Text) : ?Types.UserProfilePublic {
    switch (state.usernameIndex.get(username)) {
      case (?userId) {
        switch (state.profiles.get(userId)) {
          case (?profile) ?_toPublic(state, profile);
          case null null;
        };
      };
      case null null;
    };
  };

  // ── Follow graph ──────────────────────────────────────────────────────────

  // Returns true if an instant follow happened, false if a follow request was created
  public func follow(state : UsersState, follower : Common.UserId, target : Common.UserId) : Bool {
    // Check if target is a private profile
    let isPrivate = switch (state.profiles.get(target)) {
      case (?p) p.isPrivateProfile;
      case null false;
    };

    if (isPrivate) {
      // Create a follow request instead of instant follow
      _createFollowRequest(state, follower, target);
      false;
    } else {
      _doFollow(state, follower, target);
      true;
    };
  };

  func _doFollow(state : UsersState, follower : Common.UserId, target : Common.UserId) : () {
    // Add target to follower's following set
    let followerFollowing = switch (state.following.get(follower)) {
      case (?set) set;
      case null {
        let newSet = Set.empty<Common.UserId>();
        state.following.add(follower, newSet);
        newSet;
      };
    };
    followerFollowing.add(target);

    // Add follower to target's followers set
    let targetFollowers = switch (state.followers.get(target)) {
      case (?set) set;
      case null {
        let newSet = Set.empty<Common.UserId>();
        state.followers.add(target, newSet);
        newSet;
      };
    };
    targetFollowers.add(follower);
  };

  func _createFollowRequest(state : UsersState, fromId : Common.UserId, toId : Common.UserId) : () {
    // Don't create duplicate pending requests
    let pendingList = switch (state.pendingRequestsByUser.get(toId)) {
      case (?list) list;
      case null {
        let newList = List.empty<Text>();
        state.pendingRequestsByUser.add(toId, newList);
        newList;
      };
    };

    // Check if there's already a pending request from this user
    let hasPending = pendingList.find(func(reqId : Text) : Bool {
      switch (state.followRequests.get(reqId)) {
        case (?req) Principal.equal(req.fromId, fromId) and (req.status == #pending);
        case null false;
      }
    });
    if (hasPending != null) return; // Already pending

    let id = state.nextFollowRequestId.toText();
    state.nextFollowRequestId += 1;

    let req : Types.FollowRequest = {
      id;
      fromId;
      toId;
      status = #pending;
      createdAt = Time.now();
    };

    state.followRequests.add(id, req);
    pendingList.add(id);
  };

  public func unfollow(state : UsersState, follower : Common.UserId, target : Common.UserId) : () {
    // Remove target from follower's following set
    switch (state.following.get(follower)) {
      case (?set) set.remove(target);
      case null {};
    };

    // Remove follower from target's followers set
    switch (state.followers.get(target)) {
      case (?set) set.remove(follower);
      case null {};
    };
  };

  // ── Follow requests ───────────────────────────────────────────────────────

  public func acceptFollowRequest(state : UsersState, requestId : Text, callerId : Common.UserId) : () {
    switch (state.followRequests.get(requestId)) {
      case (?req) {
        if (not Principal.equal(req.toId, callerId)) {
          Runtime.trap("Not authorized: only the target user can accept this request");
        };
        if (req.status != #pending) {
          Runtime.trap("Follow request is not pending");
        };

        // Update request status
        state.followRequests.add(requestId, { req with status = #accepted });

        // Remove from pending index
        switch (state.pendingRequestsByUser.get(callerId)) {
          case (?list) {
            let filtered = list.filter(func(id : Text) : Bool { not Text.equal(id, requestId) });
            list.clear();
            list.append(filtered);
          };
          case null {};
        };

        // Perform the actual follow
        _doFollow(state, req.fromId, req.toId);
      };
      case null { Runtime.trap("Follow request not found") };
    };
  };

  public func rejectFollowRequest(state : UsersState, requestId : Text, callerId : Common.UserId) : () {
    switch (state.followRequests.get(requestId)) {
      case (?req) {
        if (not Principal.equal(req.toId, callerId)) {
          Runtime.trap("Not authorized: only the target user can reject this request");
        };
        if (req.status != #pending) {
          Runtime.trap("Follow request is not pending");
        };

        state.followRequests.add(requestId, { req with status = #rejected });

        // Remove from pending index
        switch (state.pendingRequestsByUser.get(callerId)) {
          case (?list) {
            let filtered = list.filter(func(id : Text) : Bool { not Text.equal(id, requestId) });
            list.clear();
            list.append(filtered);
          };
          case null {};
        };
      };
      case null { Runtime.trap("Follow request not found") };
    };
  };

  public func cancelFollowRequest(state : UsersState, requestId : Text, callerId : Common.UserId) : () {
    switch (state.followRequests.get(requestId)) {
      case (?req) {
        if (not Principal.equal(req.fromId, callerId)) {
          Runtime.trap("Not authorized: only the sender can cancel this request");
        };
        if (req.status != #pending) {
          Runtime.trap("Follow request is not pending");
        };

        state.followRequests.add(requestId, { req with status = #rejected });

        // Remove from pending index of target user
        switch (state.pendingRequestsByUser.get(req.toId)) {
          case (?list) {
            let filtered = list.filter(func(id : Text) : Bool { not Text.equal(id, requestId) });
            list.clear();
            list.append(filtered);
          };
          case null {};
        };
      };
      case null { Runtime.trap("Follow request not found") };
    };
  };

  public func getPendingFollowRequests(state : UsersState, userId : Common.UserId) : [Types.FollowRequest] {
    switch (state.pendingRequestsByUser.get(userId)) {
      case (?list) {
        let result = List.empty<Types.FollowRequest>();
        list.forEach(func(reqId : Text) {
          switch (state.followRequests.get(reqId)) {
            case (?req) {
              if (req.status == #pending) result.add(req);
            };
            case null {};
          };
        });
        result.toArray();
      };
      case null [];
    };
  };

  public func getFollowRequestStatus(state : UsersState, fromId : Common.UserId, toId : Common.UserId) : ?Types.FollowRequest {
    // Find any request from fromId to toId
    var found : ?Types.FollowRequest = null;
    state.followRequests.forEach(func(_id : Text, req : Types.FollowRequest) {
      if (Principal.equal(req.fromId, fromId) and Principal.equal(req.toId, toId)) {
        found := ?req;
      };
    });
    found;
  };

  public func getFollowers(state : UsersState, userId : Common.UserId, requesterId : ?Common.UserId) : [Types.UserProfilePublic] {
    // Apply hideAttendingList privacy
    let isOwner = switch (requesterId) {
      case (?rid) Principal.equal(rid, userId);
      case null false;
    };
    let profile = state.profiles.get(userId);
    let hideList = switch (profile) {
      case (?p) p.hideAttendingList and not isOwner;
      case null false;
    };
    if (hideList) return [];

    switch (state.followers.get(userId)) {
      case (?followerSet) {
        let result = List.empty<Types.UserProfilePublic>();
        followerSet.forEach(func(followerId) {
          switch (state.profiles.get(followerId)) {
            case (?p) result.add(_toPublic(state, p));
            case null {};
          };
        });
        result.toArray();
      };
      case null [];
    };
  };

  public func getFollowing(state : UsersState, userId : Common.UserId, requesterId : ?Common.UserId) : [Types.UserProfilePublic] {
    // Apply hideAttendingList privacy
    let isOwner = switch (requesterId) {
      case (?rid) Principal.equal(rid, userId);
      case null false;
    };
    let profile = state.profiles.get(userId);
    let hideList = switch (profile) {
      case (?p) p.hideAttendingList and not isOwner;
      case null false;
    };
    if (hideList) return [];

    switch (state.following.get(userId)) {
      case (?followingSet) {
        let result = List.empty<Types.UserProfilePublic>();
        followingSet.forEach(func(followingId) {
          switch (state.profiles.get(followingId)) {
            case (?p) result.add(_toPublic(state, p));
            case null {};
          };
        });
        result.toArray();
      };
      case null [];
    };
  };

  public func isFollowing(state : UsersState, follower : Common.UserId, target : Common.UserId) : Bool {
    switch (state.following.get(follower)) {
      case (?set) set.contains(target);
      case null false;
    };
  };

  public func getFollowingSet(state : UsersState, userId : Common.UserId) : Set.Set<Common.UserId> {
    switch (state.following.get(userId)) {
      case (?set) set;
      case null Set.empty<Common.UserId>();
    };
  };

  public func getFollowersSet(state : UsersState, userId : Common.UserId) : Set.Set<Common.UserId> {
    switch (state.followers.get(userId)) {
      case (?set) set;
      case null Set.empty<Common.UserId>();
    };
  };

  // ── Search ────────────────────────────────────────────────────────────────

  // Prefix-based user search: iterates usernameIndex (B-tree, sorted by key).
  // Starts iteration from the prefix position using entriesFrom, then
  // takes entries while the lowercase username starts with lowercase prefix.
  // O(k) where k = number of results scanned until prefix no longer matches.
  public func searchUsers(state : UsersState, prefix : Text, limit : Nat) : [Types.UserProfilePublic] {
    if (prefix.size() == 0) return [];
    let maxResults = if (limit > 20) 20 else limit;
    let result = List.empty<Types.UserProfilePublic>();
    let lowerPrefix = prefix.toLower();

    // entriesFrom starts at the first key >= lowerPrefix (case-sensitive B-tree)
    // We iterate and do case-insensitive prefix matching
    let iter = state.usernameIndex.entriesFrom(lowerPrefix);
    label scan loop {
      switch (iter.next()) {
        case (?(username, userId)) {
          let lowerUsername = username.toLower();
          // Stop once we've passed the prefix range
          if (not lowerUsername.startsWith(#text lowerPrefix)) {
            break scan;
          };
          if (result.size() >= maxResults) {
            break scan;
          };
          switch (state.profiles.get(userId)) {
            case (?profile) result.add(_toPublicFull(state, profile, 0, 0));
            case null {};
          };
        };
        case null { break scan };
      };
    };
    result.toArray();
  };

  // ── Admin helpers ─────────────────────────────────────────────────────────

  public func listAllUsers(state : UsersState) : [Types.UserProfilePublic] {
    let result = List.empty<Types.UserProfilePublic>();
    state.profiles.forEach(func(_id, profile) {
      result.add(_toPublic(state, profile));
    });
    result.toArray();
  };

  public func deleteUser(state : UsersState, userId : Common.UserId) : () {
    // Remove username from index
    switch (state.profiles.get(userId)) {
      case (?profile) {
        state.usernameIndex.remove(profile.username);
      };
      case null {};
    };

    // Remove from profiles
    state.profiles.remove(userId);

    // Remove from all followers sets of users this user follows
    switch (state.following.get(userId)) {
      case (?followingSet) {
        followingSet.forEach(func(targetId) {
          switch (state.followers.get(targetId)) {
            case (?set) set.remove(userId);
            case null {};
          };
        });
      };
      case null {};
    };

    // Remove from all following sets of users who follow this user
    switch (state.followers.get(userId)) {
      case (?followerSet) {
        followerSet.forEach(func(followerId) {
          switch (state.following.get(followerId)) {
            case (?set) set.remove(userId);
            case null {};
          };
        });
      };
      case null {};
    };

    // Remove own follower/following/bookmark maps
    state.followers.remove(userId);
    state.following.remove(userId);
    state.bookmarks.remove(userId);
    state.pendingRequestsByUser.remove(userId);
  };

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  public func bookmarkMoment(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : () {
    let bookmarkSet = switch (state.bookmarks.get(userId)) {
      case (?set) set;
      case null {
        let newSet = Set.empty<Common.MomentId>();
        state.bookmarks.add(userId, newSet);
        newSet;
      };
    };
    bookmarkSet.add(momentId);
  };

  public func unbookmarkMoment(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : () {
    switch (state.bookmarks.get(userId)) {
      case (?set) set.remove(momentId);
      case null {};
    };
  };

  public func getBookmarks(state : UsersState, userId : Common.UserId) : [Common.MomentId] {
    switch (state.bookmarks.get(userId)) {
      case (?set) set.toArray();
      case null [];
    };
  };

  public func isBookmarked(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : Bool {
    switch (state.bookmarks.get(userId)) {
      case (?set) set.contains(momentId);
      case null false;
    };
  };
};
