import Common "common";

module {
  public type Message = {
    id : Nat;
    senderId : Common.UserId;
    recipientId : Common.UserId;
    text : Text;
    createdAt : Common.Timestamp;
    isRead : Bool;
  };

  // Summary item in a conversation list
  public type ConversationSummary = {
    userId : Common.UserId;
    lastMessage : Message;
    unreadCount : Nat;
    // true = this conversation came from a non-follower (message request inbox)
    isMessageRequest : Bool;
  };

  // Split inbox result
  public type ConversationInboxResult = {
    accepted : [ConversationSummary];
    requests : [ConversationSummary];
  };
};
