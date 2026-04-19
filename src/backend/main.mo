import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Migration "migration";
import UsersLib "lib/users";
import MomentsLib "lib/moments";
import MediaLib "lib/media";
import MemoriesLib "lib/memories";
import AnnouncementsLib "lib/announcements";
import NotificationsLib "lib/notifications";
import MessagingLib "lib/messaging";
import ActivityLib "lib/activity";
import UsersMixin "mixins/users-api";
import MomentsMixin "mixins/moments-api";
import MediaMixin "mixins/media-api";
import MemoriesMixin "mixins/memories-api";
import AnnouncementsMixin "mixins/announcements-api";
import NotificationsMixin "mixins/notifications-api";
import MessagingMixin "mixins/messaging-api";
import ActivityMixin "mixins/activity-api";



(with migration = Migration.run)
actor {
  // ── Core infrastructure ───────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  // ── Domain state ──────────────────────────────────────────────────────────
  let usersState = UsersLib.initState();
  let momentsState = MomentsLib.initState();
  let mediaState = MediaLib.initState();
  let memoriesState = MemoriesLib.initState();
  let announcementsState = AnnouncementsLib.initState();
  let notificationsState = NotificationsLib.initState();
  let messagingState = MessagingLib.initState();
  let activityState = ActivityLib.initState();

  // ── Domain API mixins ─────────────────────────────────────────────────────
  include UsersMixin(accessControlState, usersState, momentsState, notificationsState, activityState);
  include MomentsMixin(accessControlState, momentsState, mediaState, usersState, notificationsState, activityState);
  include MediaMixin(accessControlState, momentsState, mediaState);
  include MemoriesMixin(accessControlState, momentsState, memoriesState, usersState);
  include AnnouncementsMixin(accessControlState, momentsState, announcementsState);
  include NotificationsMixin(accessControlState, notificationsState);
  include MessagingMixin(accessControlState, messagingState, notificationsState, usersState);
  include ActivityMixin(activityState, usersState);
};
