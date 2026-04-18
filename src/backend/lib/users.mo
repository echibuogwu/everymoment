import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
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
  };

  public func initState() : UsersState {
    {
      profiles = Map.empty<Common.UserId, Types.UserProfile>();
      usernameIndex = Map.empty<Text, Common.UserId>();
      followers = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      following = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      bookmarks = Map.empty<Common.UserId, Set.Set<Common.MomentId>>();
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

  func _toPublic(state : UsersState, profile : Types.UserProfile) : Types.UserProfilePublic {
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
      // hostedCount and attendedCount are derived from moments data;
      // the mixin layer is responsible for computing these when needed.
      hostedCount = 0;
      attendedCount = 0;
    };
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

  public func getProfile(state : UsersState, userId : Common.UserId) : ?Types.UserProfilePublic {
    switch (state.profiles.get(userId)) {
      case (?profile) ?_toPublic(state, profile);
      case null null;
    };
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

  public func follow(state : UsersState, follower : Common.UserId, target : Common.UserId) : () {
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

  public func getFollowers(state : UsersState, userId : Common.UserId) : [Types.UserProfilePublic] {
    switch (state.followers.get(userId)) {
      case (?followerSet) {
        let result = List.empty<Types.UserProfilePublic>();
        followerSet.forEach(func(followerId) {
          switch (state.profiles.get(followerId)) {
            case (?profile) result.add(_toPublic(state, profile));
            case null {};
          };
        });
        result.toArray();
      };
      case null [];
    };
  };

  public func getFollowing(state : UsersState, userId : Common.UserId) : [Types.UserProfilePublic] {
    switch (state.following.get(userId)) {
      case (?followingSet) {
        let result = List.empty<Types.UserProfilePublic>();
        followingSet.forEach(func(followingId) {
          switch (state.profiles.get(followingId)) {
            case (?profile) result.add(_toPublic(state, profile));
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
  };

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  public func bookmarkMoment(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : () {
    Runtime.trap("not implemented");
  };

  public func unbookmarkMoment(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : () {
    Runtime.trap("not implemented");
  };

  public func getBookmarks(state : UsersState, userId : Common.UserId) : [Common.MomentId] {
    Runtime.trap("not implemented");
  };

  public func isBookmarked(state : UsersState, userId : Common.UserId, momentId : Common.MomentId) : Bool {
    Runtime.trap("not implemented");
  };
};
