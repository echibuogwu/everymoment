import Common "common";

module {
  public type NotificationKind = {
    #newFollower;
    #rsvpToYourMoment;
    #accessRequestResolved;
    #newMessage;
    #mentioned;
    #newAnnouncement;
  };

  public type Notification = {
    id : Nat;
    recipientId : Common.UserId;
    kind : NotificationKind;
    // Generic reference: momentId, userId text, or message id
    referenceId : ?Text;
    message : Text;
    createdAt : Common.Timestamp;
    isRead : Bool;
  };
};
