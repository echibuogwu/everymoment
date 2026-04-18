import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import T "../types/notifications";

module {
  public type NotificationsState = {
    // Keyed by recipientId → list of notifications
    notifications : Map.Map<Common.UserId, List.List<T.Notification>>;
    var nextNotificationId : Nat;
  };

  public func initState() : NotificationsState {
    {
      notifications = Map.empty<Common.UserId, List.List<T.Notification>>();
      var nextNotificationId = 0;
    };
  };

  // Create a notification for a recipient
  public func createNotification(
    state : NotificationsState,
    recipientId : Common.UserId,
    kind : T.NotificationKind,
    referenceId : ?Text,
    message : Text
  ) : () {
    Runtime.trap("not implemented");
  };

  public func getNotifications(
    state : NotificationsState,
    userId : Common.UserId
  ) : [T.Notification] {
    Runtime.trap("not implemented");
  };

  public func markRead(
    state : NotificationsState,
    userId : Common.UserId,
    notificationId : Nat
  ) : () {
    Runtime.trap("not implemented");
  };

  public func markAllRead(
    state : NotificationsState,
    userId : Common.UserId
  ) : () {
    Runtime.trap("not implemented");
  };

  public func unreadCount(
    state : NotificationsState,
    userId : Common.UserId
  ) : Nat {
    Runtime.trap("not implemented");
  };
};
