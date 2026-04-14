import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UsersLib "lib/users";
import MomentsLib "lib/moments";
import MediaLib "lib/media";
import MemoriesLib "lib/memories";
import UsersMixin "mixins/users-api";
import MomentsMixin "mixins/moments-api";
import MediaMixin "mixins/media-api";
import MemoriesMixin "mixins/memories-api";



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

  // ── Domain API mixins ─────────────────────────────────────────────────────
  include UsersMixin(accessControlState, usersState);
  include MomentsMixin(accessControlState, momentsState, mediaState, usersState);
  include MediaMixin(accessControlState, momentsState, mediaState);
  include MemoriesMixin(accessControlState, momentsState, memoriesState, usersState);
};
