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
  };
};
