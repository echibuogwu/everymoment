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
    Runtime.trap("not implemented");
  };

  // Mark a single notification as read
  public shared ({ caller }) func markNotificationRead(id : Nat) : async () {
    Runtime.trap("not implemented");
  };

  // Mark all caller's notifications as read
  public shared ({ caller }) func markAllNotificationsRead() : async () {
    Runtime.trap("not implemented");
  };

  // Get count of unread notifications
  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    Runtime.trap("not implemented");
  };
};
