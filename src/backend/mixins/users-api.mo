import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import UsersLib "../lib/users";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  usersState : UsersLib.UsersState,
) {
  // ── Onboarding ────────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.getProfile(usersState, caller);
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

  public query func getUserProfile(userId : Common.UserId) : async ?UserTypes.UserProfilePublic {
    UsersLib.getProfile(usersState, userId);
  };

  public query func getUserProfileByUsername(username : Text) : async ?UserTypes.UserProfilePublic {
    UsersLib.getProfileByUsername(usersState, username);
  };

  // ── Follow system ─────────────────────────────────────────────────────────

  public shared ({ caller }) func followUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };
    UsersLib.follow(usersState, caller, target);
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.unfollow(usersState, caller, target);
  };

  public query func getFollowers(userId : Common.UserId) : async [UserTypes.UserProfilePublic] {
    UsersLib.getFollowers(usersState, userId);
  };

  public query func getFollowing(userId : Common.UserId) : async [UserTypes.UserProfilePublic] {
    UsersLib.getFollowing(usersState, userId);
  };

  public query ({ caller }) func isFollowingUser(target : Common.UserId) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    UsersLib.isFollowing(usersState, caller, target);
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
};
