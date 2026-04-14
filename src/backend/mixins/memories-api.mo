import AccessControl "mo:caffeineai-authorization/access-control";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import MomentsLib "../lib/moments";
import MemoriesLib "../lib/memories";
import UsersLib "../lib/users";
import Common "../types/common";
import T "../types/memories";

mixin (
  accessControlState : AccessControl.AccessControlState,
  momentsState : MomentsLib.MomentsState,
  memoriesState : MemoriesLib.MemoriesState,
  usersState : UsersLib.UsersState
) {
  // Post a new memory to a moment — caller must be an attending user.
  // The frontend uploads media to object-storage first, then passes the resulting
  // ExternalBlob here. Text-only memories pass null for mediaBlob and mediaKind.
  public shared ({ caller }) func postMemory(
    momentId : Common.MomentId,
    content : Text,
    mediaBlob : ?Storage.ExternalBlob,
    mediaKind : ?T.MemoryMediaKind
  ) : async { #ok : T.MemoryId; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };
    MemoriesLib.postMemory(memoriesState, caller, momentsState, momentId, content, mediaBlob, mediaKind);
  };

  // Get memories for a moment with pagination — newest first, paginated by timestamp
  public query ({ caller }) func getMemories(
    momentId : Common.MomentId,
    limit : Nat,
    before : ?Common.Timestamp
  ) : async { #ok : [T.MemoryWithAuthor]; #err : Text } {
    #ok(MemoriesLib.getMemoriesForMoment(memoriesState, usersState, momentId, limit, before));
  };

  // Delete a memory — only the author can delete their own memory
  public shared ({ caller }) func deleteMemory(
    memoryId : T.MemoryId
  ) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };
    MemoriesLib.deleteMemory(memoriesState, caller, memoryId);
  };
};
