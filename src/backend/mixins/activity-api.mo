import T "../types/activity";
import ActivityLib "../lib/activity";
import UsersLib "../lib/users";

mixin (
  activityState : ActivityLib.ActivityState,
  usersState : UsersLib.UsersState
) {
  // Returns activity events from users the caller follows, max 50, newest first
  public query ({ caller }) func getActivityFeed() : async [T.ActivityEvent] {
    if (caller.isAnonymous()) {
      return [];
    };
    ActivityLib.getFeedForUser(activityState, usersState, caller);
  };
};
