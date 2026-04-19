import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
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
    let id = state.nextNotificationId;
    state.nextNotificationId += 1;

    let notif : T.Notification = {
      id;
      recipientId;
      kind;
      referenceId;
      message;
      createdAt = Time.now();
      isRead = false;
    };

    let list = switch (state.notifications.get(recipientId)) {
      case (?existing) existing;
      case null {
        let newList = List.empty<T.Notification>();
        state.notifications.add(recipientId, newList);
        newList;
      };
    };
    list.add(notif);
  };

  public func getNotifications(
    state : NotificationsState,
    userId : Common.UserId
  ) : [T.Notification] {
    switch (state.notifications.get(userId)) {
      case (?list) {
        // Return newest first
        list.reverse().toArray();
      };
      case null [];
    };
  };

  public func markRead(
    state : NotificationsState,
    userId : Common.UserId,
    notificationId : Nat
  ) : () {
    switch (state.notifications.get(userId)) {
      case (?list) {
        list.mapInPlace(func(n : T.Notification) : T.Notification {
          if (n.id == notificationId) { { n with isRead = true } } else { n }
        });
      };
      case null {};
    };
  };

  public func markAllRead(
    state : NotificationsState,
    userId : Common.UserId
  ) : () {
    switch (state.notifications.get(userId)) {
      case (?list) {
        list.mapInPlace(func(n : T.Notification) : T.Notification {
          { n with isRead = true }
        });
      };
      case null {};
    };
  };

  public func unreadCount(
    state : NotificationsState,
    userId : Common.UserId
  ) : Nat {
    switch (state.notifications.get(userId)) {
      case (?list) {
        var count = 0;
        list.forEach(func(n : T.Notification) {
          if (not n.isRead) count += 1;
        });
        count;
      };
      case null 0;
    };
  };
};
