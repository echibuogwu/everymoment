import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import UsersLib "../lib/users";
import MomentsLib "../lib/moments";
import NotificationsLib "../lib/notifications";
import ActivityLib "../lib/activity";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  usersState : UsersLib.UsersState,
  momentsState : MomentsLib.MomentsState,
  notificationsState : NotificationsLib.NotificationsState,
  activityState : ActivityLib.ActivityState,
) {
  // ── Onboarding ────────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let hostedCount = MomentsLib.countHostedByUser(momentsState, caller);
    let attendedCount = MomentsLib.countAttendedByUser(momentsState, caller);
    UsersLib.getProfileWithPrivacy(usersState, caller, ?caller, hostedCount, attendedCount);
  };

  // Saves the caller's full profile, including name, location, socials, and
  // generic payment details (wallets, PayPal, Revolut, etc.)
  // Auto-registers the caller on first call (idempotent for existing users).
  public shared ({ caller }) func saveCallerUserProfile(input : UserTypes.SaveProfileInput) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    // Auto-register the caller if they are new (first call becomes admin, rest become users)
    AccessControl.initialize(accessControlState, caller);
    UsersLib.saveProfile(usersState, caller, input);
  };

  public query func isUsernameTaken(username : Text) : async Bool {
    UsersLib.isUsernameTaken(usersState, username);
  };

  // ── Profile lookup ────────────────────────────────────────────────────────

  // Privacy-aware profile lookup: returns minimal profile for private profiles
  // when the requester is not a follower.
  public query ({ caller }) func getUserProfile(userId : Common.UserId) : async ?UserTypes.UserProfilePublic {
    let requesterId : ?Common.UserId = if (caller.isAnonymous()) null else ?caller;
    let hostedCount = MomentsLib.countHostedByUser(momentsState, userId);
    let attendedCount = MomentsLib.countAttendedByUser(momentsState, userId);
    UsersLib.getProfileWithPrivacy(usersState, userId, requesterId, hostedCount, attendedCount);
  };

  public query ({ caller }) func getUserProfileByUsername(username : Text) : async ?UserTypes.UserProfilePublic {
    switch (UsersLib.resolveUsername(usersState, username)) {
      case (?userId) {
        let requesterId : ?Common.UserId = if (caller.isAnonymous()) null else ?caller;
        let hostedCount = MomentsLib.countHostedByUser(momentsState, userId);
        let attendedCount = MomentsLib.countAttendedByUser(momentsState, userId);
        UsersLib.getProfileWithPrivacy(usersState, userId, requesterId, hostedCount, attendedCount);
      };
      case null null;
    };
  };

  // ── Follow system ─────────────────────────────────────────────────────────

  // Returns true if instant follow occurred, false if a follow request was sent
  public shared ({ caller }) func followUser(target : Common.UserId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };
    let instantFollow = UsersLib.follow(usersState, caller, target);
    if (instantFollow) {
      // Notify the followed user
      NotificationsLib.createNotification(
        notificationsState,
        target,
        #newFollower,
        ?caller.toText(),
        "Someone started following you"
      );
      // Record activity event
      ActivityLib.recordEvent(activityState, caller, #followedUser, null, ?target);
    };
    instantFollow;
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.unfollow(usersState, caller, target);
  };

  public query ({ caller }) func getFollowers(userId : Common.UserId) : async [UserTypes.UserProfilePublic] {
    let requesterId : ?Common.UserId = if (caller.isAnonymous()) null else ?caller;
    UsersLib.getFollowers(usersState, userId, requesterId);
  };

  public query ({ caller }) func getFollowing(userId : Common.UserId) : async [UserTypes.UserProfilePublic] {
    let requesterId : ?Common.UserId = if (caller.isAnonymous()) null else ?caller;
    UsersLib.getFollowing(usersState, userId, requesterId);
  };

  public query ({ caller }) func isFollowingUser(target : Common.UserId) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    UsersLib.isFollowing(usersState, caller, target);
  };

  // ── Follow requests (private profiles) ───────────────────────────────────

  public shared ({ caller }) func acceptFollowRequest(requestId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.acceptFollowRequest(usersState, requestId, caller);
  };

  public shared ({ caller }) func rejectFollowRequest(requestId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.rejectFollowRequest(usersState, requestId, caller);
  };

  public shared ({ caller }) func cancelFollowRequest(requestId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.cancelFollowRequest(usersState, requestId, caller);
  };

  public query ({ caller }) func getPendingFollowRequests() : async [UserTypes.FollowRequest] {
    if (caller.isAnonymous()) {
      return [];
    };
    UsersLib.getPendingFollowRequests(usersState, caller);
  };

  public query ({ caller }) func getFollowRequestStatus(targetId : Common.UserId) : async ?UserTypes.FollowRequest {
    if (caller.isAnonymous()) {
      return null;
    };
    UsersLib.getFollowRequestStatus(usersState, caller, targetId);
  };

  // ── Admin ─────────────────────────────────────────────────────────────────

  public query ({ caller }) func adminListUsers() : async [UserTypes.UserProfilePublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UsersLib.listAllUsers(usersState);
  };

  public shared ({ caller }) func adminDeleteUser(userId : Common.UserId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UsersLib.deleteUser(usersState, userId);
  };

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func bookmarkMoment(momentId : Common.MomentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UsersLib.bookmarkMoment(usersState, caller, momentId);
  };

  public shared ({ caller }) func unbookmarkMoment(momentId : Common.MomentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    UsersLib.unbookmarkMoment(usersState, caller, momentId);
  };

  public query ({ caller }) func getMyBookmarks() : async [Common.MomentId] {
    if (caller.isAnonymous()) {
      return [];
    };
    UsersLib.getBookmarks(usersState, caller);
  };

  public query ({ caller }) func isBookmarked(momentId : Common.MomentId) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    UsersLib.isBookmarked(usersState, caller, momentId);
  };
};
