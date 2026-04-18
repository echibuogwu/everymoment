import Common "common";

module {
  public type ActivityKind = {
    #createdMoment;
    #rsvpdToMoment;
    #followedUser;
  };

  public type ActivityEvent = {
    id : Nat;
    actorId : Common.UserId;
    kind : ActivityKind;
    momentId : ?Common.MomentId;
    targetUserId : ?Common.UserId;
    createdAt : Common.Timestamp;
  };
};
