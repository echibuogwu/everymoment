import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import T "../types/activity";
import UsersLib "users";

module {
  public type ActivityState = {
    // Global ordered list of all activity events (insertion order; newest at highest index)
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
    let id = state.nextEventId;
    state.nextEventId += 1;
    let evt : T.ActivityEvent = {
      id;
      actorId;
      kind;
      momentId;
      targetUserId;
      createdAt = Time.now();
    };
    state.events.add(evt);
  };

  // Returns activity events from users the caller follows, max 50, newest first
  public func getFeedForUser(
    state : ActivityState,
    usersState : UsersLib.UsersState,
    callerId : Common.UserId
  ) : [T.ActivityEvent] {
    let followingSet = UsersLib.getFollowingSet(usersState, callerId);
    let results = List.empty<T.ActivityEvent>();

    // Iterate from the end of the list (newest events) backwards
    let all = state.events.toArray();
    var i = all.size();
    while (i > 0 and results.size() < 50) {
      i -= 1;
      let evt = all[i];
      if (followingSet.contains(evt.actorId)) {
        results.add(evt);
      };
    };

    results.toArray();
  };
};
