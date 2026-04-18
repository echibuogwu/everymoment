import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/messaging";
import MessagingLib "../lib/messaging";
import NotificationsLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  messagingState : MessagingLib.MessagingState,
  notificationsState : NotificationsLib.NotificationsState
) {
  // Send a message to a user; returns the new message id
  public shared ({ caller }) func sendMessage(
    recipientId : Common.UserId,
    text : Text
  ) : async Nat {
    Runtime.trap("not implemented");
  };

  // Get full message history with a specific user
  public query ({ caller }) func getConversation(
    otherUserId : Common.UserId
  ) : async [T.Message] {
    Runtime.trap("not implemented");
  };

  // Get list of all conversations with last message and unread count
  public query ({ caller }) func getMyConversations() : async [T.ConversationSummary] {
    Runtime.trap("not implemented");
  };

  // Mark all messages in a conversation as read
  public shared ({ caller }) func markConversationRead(
    otherUserId : Common.UserId
  ) : async () {
    Runtime.trap("not implemented");
  };

  // Get total unread message count across all conversations
  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    Runtime.trap("not implemented");
  };
};
