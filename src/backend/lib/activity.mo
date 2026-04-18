import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/activity";
import UsersLib "users";

module {
  public type ActivityState = {
    // Global ordered list of all activity events (newest first)
    events : List.List<T.ActivityEvent>;
    var nextEventId : Nat;
  };

  public func initState() : ActivityState {
    {
      events = List.empty<T.ActivityEvent>();
      var nextEventId = 0;
    };
  };

  public func recordEvent(
    state : ActivityState,
    actorId : Common.UserId,
    kind : T.ActivityKind,
    momentId : ?Common.MomentId,
    targetUserId : ?Common.UserId
  ) : () {
    Runtime.trap("not implemented");
  };

  // Returns activity events from users the caller follows, max 50, newest first
  public func getFeedForUser(
    state : ActivityState,
    usersState : UsersLib.UsersState,
    callerId : Common.UserId
  ) : [T.ActivityEvent] {
    Runtime.trap("not implemented");
  };
};
