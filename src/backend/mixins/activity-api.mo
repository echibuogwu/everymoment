import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/activity";
import ActivityLib "../lib/activity";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  activityState : ActivityLib.ActivityState,
  usersState : UsersLib.UsersState
) {
  // Returns activity events from users the caller follows, max 50, newest first
  public query ({ caller }) func getActivityFeed() : async [T.ActivityEvent] {
    Runtime.trap("not implemented");
  };
};
