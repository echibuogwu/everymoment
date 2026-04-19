import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/messaging";
import UserTypes "../types/users";
import MessagingLib "../lib/messaging";
import NotificationsLib "../lib/notifications";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  messagingState : MessagingLib.MessagingState,
  notificationsState : NotificationsLib.NotificationsState,
  usersState : UsersLib.UsersState
) {
  // Send a message to a user; returns the new message id
  public shared ({ caller }) func sendMessage(
    recipientId : Common.UserId,
    text : Text
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };

    let senderFollowsRecipient = UsersLib.isFollowing(usersState, caller, recipientId);
    let msg = MessagingLib.sendMessage(messagingState, caller, recipientId, text, senderFollowsRecipient);

    // Notify recipient
    NotificationsLib.createNotification(
      notificationsState,
      recipientId,
      #newMessage,
      ?msg.id.toText(),
      "You have a new message"
    );

    msg.id;
  };

  // Get full message history with a specific user
  public query ({ caller }) func getConversation(
    otherUserId : Common.UserId
  ) : async [T.Message] {
    if (caller.isAnonymous()) {
      return [];
    };
    MessagingLib.getConversation(messagingState, caller, otherUserId);
  };

  // Get split inbox: accepted conversations and message requests
  public query ({ caller }) func getMyConversations() : async T.ConversationInboxResult {
    if (caller.isAnonymous()) {
      return { accepted = []; requests = [] };
    };
    let followingSet = UsersLib.getFollowingSet(usersState, caller);
    let followersSet = UsersLib.getFollowersSet(usersState, caller);
    MessagingLib.getConversationSummaries(messagingState, caller, followingSet, followersSet);
  };

  // Mark all messages in a conversation as read
  public shared ({ caller }) func markConversationRead(
    otherUserId : Common.UserId
  ) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MessagingLib.markConversationRead(messagingState, caller, otherUserId);
  };

  // Get total unread message count across accepted conversations only
  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    if (caller.isAnonymous()) {
      return 0;
    };
    let followingSet = UsersLib.getFollowingSet(usersState, caller);
    let followersSet = UsersLib.getFollowersSet(usersState, caller);
    MessagingLib.unreadMessageCount(messagingState, caller, followingSet, followersSet);
  };

  // Accept a message request (move from requests inbox to accepted inbox)
  public shared ({ caller }) func acceptMessageRequest(
    fromId : Common.UserId
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MessagingLib.acceptMessageRequest(messagingState, caller, fromId);
  };

  // Delete / decline a message request
  public shared ({ caller }) func deleteMessageRequest(
    fromId : Common.UserId
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    MessagingLib.deleteMessageRequest(messagingState, caller, fromId);
  };

  // Search users by username prefix — for DM recipient search and @mention autocomplete
  public query func searchUsers(prefix : Text, limit : Nat) : async [UserTypes.UserProfilePublic] {
    UsersLib.searchUsers(usersState, prefix, limit);
  };
};
