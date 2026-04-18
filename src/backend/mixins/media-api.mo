import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MomentsLib "../lib/moments";
import MediaLib "../lib/media";
import T "../types/media";
import MomentsT "../types/moments";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  momentsState : MomentsLib.MomentsState,
  mediaState : MediaLib.MediaState,
) {
  // ── Folders ───────────────────────────────────────────────────────────────
  public shared ({ caller }) func createFolder(input : T.CreateFolderInput) : async Common.FolderId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    // Only moment owner can create folders
    let moment = switch (MomentsLib.getMoment(momentsState, input.momentId)) {
      case (?m) m;
      case null Runtime.trap("Moment not found");
    };
    if (not Principal.equal(moment.owner, caller)) {
      Runtime.trap("Unauthorized: Only the moment owner can create folders");
    };
    MediaLib.createFolder(mediaState, caller, input);
  };

  public shared ({ caller }) func deleteFolder(folderId : Common.FolderId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let folder = switch (mediaState.folders.get(folderId)) {
      case (?f) f;
      case null Runtime.trap("Folder not found");
    };
    // Only moment owner can delete folders
    let moment = switch (MomentsLib.getMoment(momentsState, folder.momentId)) {
      case (?m) m;
      case null Runtime.trap("Moment not found");
    };
    if (not Principal.equal(moment.owner, caller)) {
      Runtime.trap("Unauthorized: Only the moment owner can delete folders");
    };
    MediaLib.deleteFolder(mediaState, caller, folderId);
  };

  public query ({ caller }) func listFolders(momentId : Common.MomentId) : async [T.Folder] {
    MediaLib.listFolders(mediaState, momentId);
  };

  // ── Media ─────────────────────────────────────────────────────────────────
  // Upload permissions:
  //   - Default (public) folder: any attending user OR the moment owner can upload.
  //   - Non-default folders: only the moment owner can upload.
  public shared ({ caller }) func uploadMedia(input : T.UploadMediaInput) : async Common.MediaId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let moment = switch (MomentsLib.getMoment(momentsState, input.momentId)) {
      case (?m) m;
      case null Runtime.trap("Moment not found");
    };
    let folder = switch (mediaState.folders.get(input.folderId)) {
      case (?f) f;
      case null Runtime.trap("Folder not found");
    };
    if (folder.isDefault) {
      // Allow moment owner or any attending user
      if (not Principal.equal(moment.owner, caller)) {
        let attendees = MomentsLib.listAttendees(momentsState, input.momentId);
        let isAttending = attendees.any(func(att : MomentsT.Attendee) : Bool {
          Principal.equal(att.userId, caller)
        });
        if (not isAttending) {
          Runtime.trap("Unauthorized: Must be attending to upload to the public folder");
        };
      };
    } else {
      if (not Principal.equal(moment.owner, caller)) {
        Runtime.trap("Unauthorized: Only the moment owner can upload to this folder");
      };
    };
    MediaLib.uploadMedia(mediaState, caller, input);
  };

  // Delete permissions:
  //   - Moment owner can always delete any media in any folder.
  //   - Default (public) folder: only the media uploader can delete their own media (unless owner).
  //   - Non-default folders: only the moment owner can delete.
  public shared ({ caller }) func deleteMedia(mediaId : Common.MediaId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let item = switch (MediaLib.getMedia(mediaState, mediaId)) {
      case (?m) m;
      case null Runtime.trap("Media not found");
    };
    let moment = switch (MomentsLib.getMoment(momentsState, item.momentId)) {
      case (?m) m;
      case null Runtime.trap("Moment not found");
    };
    // Moment owner can always delete anything
    if (Principal.equal(moment.owner, caller)) {
      MediaLib.adminDeleteMedia(mediaState, mediaId);
      return;
    };
    // Non-owner: look up the folder to determine rules
    let folder = switch (mediaState.folders.get(item.folderId)) {
      case (?f) f;
      case null Runtime.trap("Folder not found");
    };
    if (folder.isDefault) {
      // Default folder: only the uploader can delete their own media
      if (not Principal.equal(item.uploadedBy, caller)) {
        Runtime.trap("Unauthorized: Only the uploader can delete their own media from the public folder");
      };
    } else {
      // Non-default folder: only the moment owner can delete (already handled above)
      Runtime.trap("Unauthorized: Only the moment owner can delete media from this folder");
    };
    MediaLib.adminDeleteMedia(mediaState, mediaId);
  };

  public query ({ caller }) func getMedia(mediaId : Common.MediaId) : async ?T.Media {
    MediaLib.getMedia(mediaState, mediaId);
  };

  public query ({ caller }) func listMedia(momentId : Common.MomentId, offset : Nat, limit : Nat) : async T.MediaPage {
    let pageLimit = if (limit == 0) 12 else limit;
    MediaLib.listMedia(mediaState, momentId, offset, pageLimit);
  };

  public query ({ caller }) func listMediaByFolder(folderId : Common.FolderId, offset : Nat, limit : Nat) : async T.MediaPage {
    let pageLimit = if (limit == 0) 12 else limit;
    MediaLib.listMediaByFolder(mediaState, folderId, offset, pageLimit);
  };

  // ── Likes ─────────────────────────────────────────────────────────────────
  public shared ({ caller }) func toggleLike(mediaId : Common.MediaId) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to like media");
    };
    MediaLib.toggleLike(mediaState, caller, mediaId);
  };

  public query ({ caller }) func hasLikedMedia(mediaId : Common.MediaId) : async Bool {
    MediaLib.hasLiked(mediaState, caller, mediaId);
  };

  // ── Comments ──────────────────────────────────────────────────────────────
  public shared ({ caller }) func addComment(input : T.AddCommentInput) : async Common.CommentId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to comment");
    };
    MediaLib.addComment(mediaState, caller, input);
  };

  public shared ({ caller }) func deleteComment(commentId : Common.CommentId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let comment = switch (mediaState.comments.get(commentId)) {
      case (?c) c;
      case null Runtime.trap("Comment not found");
    };
    if (not Principal.equal(comment.author, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the author or an admin can delete this comment");
    };
    // Call lib with comment author as caller to pass the ownership check (admin bypass handled above)
    MediaLib.deleteComment(mediaState, comment.author, commentId);
  };

  public query ({ caller }) func listComments(mediaId : Common.MediaId) : async [T.Comment] {
    MediaLib.listComments(mediaState, mediaId);
  };

  // ── Admin ─────────────────────────────────────────────────────────────────
  public query ({ caller }) func adminListMedia() : async [T.Media] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    MediaLib.adminListAllMedia(mediaState);
  };

  public shared ({ caller }) func adminDeleteMedia(mediaId : Common.MediaId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    MediaLib.adminDeleteMedia(mediaState, mediaId);
  };
};
