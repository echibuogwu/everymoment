import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/notifications";
import NotificationsLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notificationsState : NotificationsLib.NotificationsState
) {
  // Get caller's notifications (newest first)
  public query ({ caller }) func getMyNotifications() : async [T.Notification] {
    if (caller.isAnonymous()) {
      return [];
    };
    NotificationsLib.getNotifications(notificationsState, caller);
  };

  // Mark a single notification as read
  public shared ({ caller }) func markNotificationRead(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    NotificationsLib.markRead(notificationsState, caller, id);
  };

  // Mark all caller's notifications as read
  public shared ({ caller }) func markAllNotificationsRead() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: must be logged in");
    };
    NotificationsLib.markAllRead(notificationsState, caller);
  };

  // Get count of unread notifications
  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    if (caller.isAnonymous()) {
      return 0;
    };
    NotificationsLib.unreadCount(notificationsState, caller);
  };
};
