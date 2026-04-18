import Common "common";

module {
  public type Announcement = {
    id : Nat;
    momentId : Common.MomentId;
    authorId : Common.UserId;
    text : Text;
    createdAt : Common.Timestamp;
  };
};
