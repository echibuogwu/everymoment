import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/messaging";

module {
  public type MessagingState = {
    // Keyed by conversation key (sorted pair of user IDs joined with "-")
    messages : Map.Map<Text, List.List<T.Message>>;
    var nextMessageId : Nat;
  };

  public func initState() : MessagingState {
    {
      messages = Map.empty<Text, List.List<T.Message>>();
      var nextMessageId = 0;
    };
  };

  // Produces a stable conversation key for the two user IDs
  public func conversationKey(a : Common.UserId, b : Common.UserId) : Text {
    Runtime.trap("not implemented");
  };

  public func sendMessage(
    state : MessagingState,
    senderId : Common.UserId,
    recipientId : Common.UserId,
    text : Text
  ) : T.Message {
    Runtime.trap("not implemented");
  };

  public func getConversation(
    state : MessagingState,
    callerId : Common.UserId,
    otherId : Common.UserId
  ) : [T.Message] {
    Runtime.trap("not implemented");
  };

  public func getConversationSummaries(
    state : MessagingState,
    userId : Common.UserId
  ) : [T.ConversationSummary] {
    Runtime.trap("not implemented");
  };

  public func markConversationRead(
    state : MessagingState,
    callerId : Common.UserId,
    otherId : Common.UserId
  ) : () {
    Runtime.trap("not implemented");
  };

  public func unreadMessageCount(
    state : MessagingState,
    userId : Common.UserId
  ) : Nat {
    Runtime.trap("not implemented");
  };
};
