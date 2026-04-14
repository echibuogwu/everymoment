import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Common "../types/common";
import T "../types/media";

module {
  // ── Internal state types ──────────────────────────────────────────────────
  public type MediaState = {
    folders : Map.Map<Common.FolderId, T.Folder>;
    media : Map.Map<Common.MediaId, T.Media>;
    comments : Map.Map<Common.CommentId, T.Comment>;
    likes : Map.Map<Common.MediaId, Set.Set<Common.UserId>>;
    var nextFolderId : Common.FolderId;
    var nextMediaId : Common.MediaId;
    var nextCommentId : Common.CommentId;
  };

  public func initState() : MediaState {
    {
      folders = Map.empty<Common.FolderId, T.Folder>();
      media = Map.empty<Common.MediaId, T.Media>();
      comments = Map.empty<Common.CommentId, T.Comment>();
      likes = Map.empty<Common.MediaId, Set.Set<Common.UserId>>();
      var nextFolderId = 1;
      var nextMediaId = 1;
      var nextCommentId = 1;
    };
  };

  // ── Folders ───────────────────────────────────────────────────────────────
  public func createDefaultFolder(state : MediaState, momentId : Common.MomentId) : Common.FolderId {
    let folderId = state.nextFolderId;
    state.nextFolderId += 1;
    let folder : T.Folder = {
      id = folderId;
      momentId = momentId;
      name = "Default";
      isDefault = true;
      createdAt = Time.now();
    };
    state.folders.add(folderId, folder);
    folderId;
  };

  public func createFolder(state : MediaState, _owner : Common.UserId, input : T.CreateFolderInput) : Common.FolderId {
    let folderId = state.nextFolderId;
    state.nextFolderId += 1;
    let folder : T.Folder = {
      id = folderId;
      momentId = input.momentId;
      name = input.name;
      isDefault = false;
      createdAt = Time.now();
    };
    state.folders.add(folderId, folder);
    folderId;
  };

  public func deleteFolder(state : MediaState, _owner : Common.UserId, folderId : Common.FolderId) : () {
    let folder = switch (state.folders.get(folderId)) {
      case (?f) f;
      case null Runtime.trap("Folder not found");
    };
    if (folder.isDefault) {
      Runtime.trap("Cannot delete the default folder");
    };
    state.folders.remove(folderId);
  };

  public func listFolders(state : MediaState, momentId : Common.MomentId) : [T.Folder] {
    let result = List.empty<T.Folder>();
    for ((_, folder) in state.folders.entries()) {
      if (folder.momentId == momentId) {
        result.add(folder);
      };
    };
    result.toArray();
  };

  // ── Media ─────────────────────────────────────────────────────────────────
  public func uploadMedia(state : MediaState, uploader : Common.UserId, input : T.UploadMediaInput) : Common.MediaId {
    // Verify folder exists and belongs to the moment
    let folder = switch (state.folders.get(input.folderId)) {
      case (?f) f;
      case null Runtime.trap("Folder not found");
    };
    if (folder.momentId != input.momentId) {
      Runtime.trap("Folder does not belong to this moment");
    };
    let mediaId = state.nextMediaId;
    state.nextMediaId += 1;
    let item : T.Media = {
      id = mediaId;
      momentId = input.momentId;
      folderId = input.folderId;
      uploadedBy = uploader;
      filename = input.filename;
      kind = input.kind;
      blob = input.blob;
      likeCount = 0;
      createdAt = Time.now();
    };
    state.media.add(mediaId, item);
    mediaId;
  };

  public func deleteMedia(state : MediaState, caller : Common.UserId, mediaId : Common.MediaId) : () {
    let item = switch (state.media.get(mediaId)) {
      case (?m) m;
      case null Runtime.trap("Media not found");
    };
    if (not Principal.equal(item.uploadedBy, caller)) {
      Runtime.trap("Unauthorized: Only the uploader can delete this media");
    };
    state.media.remove(mediaId);
    state.likes.remove(mediaId);
    // Remove all comments for this media
    let toRemove = List.empty<Common.CommentId>();
    for ((commentId, comment) in state.comments.entries()) {
      if (comment.mediaId == mediaId) {
        toRemove.add(commentId);
      };
    };
    for (commentId in toRemove.values()) {
      state.comments.remove(commentId);
    };
  };

  public func getMedia(state : MediaState, mediaId : Common.MediaId) : ?T.Media {
    state.media.get(mediaId);
  };

  public func listMedia(state : MediaState, momentId : Common.MomentId, offset : Nat, limit : Nat) : T.MediaPage {
    let all = List.empty<T.Media>();
    for ((_, item) in state.media.entries()) {
      if (item.momentId == momentId) {
        all.add(item);
      };
    };
    // Sort by createdAt descending
    all.sortInPlace(func(a, b) = Int.compare(b.createdAt, a.createdAt));
    let total = all.size();
    let pageItems = all.sliceToArray(offset.toInt(), (offset + limit).toInt());
    let nextOffset = if (offset + limit < total) ?(offset + limit) else null;
    { items = pageItems; nextOffset; total };
  };

  public func listMediaByFolder(state : MediaState, folderId : Common.FolderId, offset : Nat, limit : Nat) : T.MediaPage {
    let all = List.empty<T.Media>();
    for ((_, item) in state.media.entries()) {
      if (item.folderId == folderId) {
        all.add(item);
      };
    };
    // Sort by createdAt descending
    all.sortInPlace(func(a, b) = Int.compare(b.createdAt, a.createdAt));
    let total = all.size();
    let pageItems = all.sliceToArray(offset.toInt(), (offset + limit).toInt());
    let nextOffset = if (offset + limit < total) ?(offset + limit) else null;
    { items = pageItems; nextOffset; total };
  };

  // ── Likes ─────────────────────────────────────────────────────────────────
  public func toggleLike(state : MediaState, userId : Common.UserId, mediaId : Common.MediaId) : Nat {
    let item = switch (state.media.get(mediaId)) {
      case (?m) m;
      case null Runtime.trap("Media not found");
    };
    let likeSet = switch (state.likes.get(mediaId)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.likes.add(mediaId, s);
        s;
      };
    };
    let newCount : Nat = if (likeSet.contains(userId)) {
      likeSet.remove(userId);
      if (item.likeCount > 0) item.likeCount - 1 else 0;
    } else {
      likeSet.add(userId);
      item.likeCount + 1;
    };
    state.media.add(mediaId, { item with likeCount = newCount });
    newCount;
  };

  public func hasLiked(state : MediaState, userId : Common.UserId, mediaId : Common.MediaId) : Bool {
    switch (state.likes.get(mediaId)) {
      case (?s) s.contains(userId);
      case null false;
    };
  };

  // ── Comments ──────────────────────────────────────────────────────────────
  public func addComment(state : MediaState, author : Common.UserId, input : T.AddCommentInput) : Common.CommentId {
    // Verify media exists
    switch (state.media.get(input.mediaId)) {
      case null Runtime.trap("Media not found");
      case _ {};
    };
    // Verify parent comment exists if provided
    switch (input.parentId) {
      case (?pid) {
        switch (state.comments.get(pid)) {
          case null Runtime.trap("Parent comment not found");
          case _ {};
        };
      };
      case null {};
    };
    let commentId = state.nextCommentId;
    state.nextCommentId += 1;
    let comment : T.Comment = {
      id = commentId;
      mediaId = input.mediaId;
      author = author;
      parentId = input.parentId;
      text = input.text;
      createdAt = Time.now();
    };
    state.comments.add(commentId, comment);
    commentId;
  };

  public func deleteComment(state : MediaState, caller : Common.UserId, commentId : Common.CommentId) : () {
    let comment = switch (state.comments.get(commentId)) {
      case (?c) c;
      case null Runtime.trap("Comment not found");
    };
    if (not Principal.equal(comment.author, caller)) {
      Runtime.trap("Unauthorized: Only the author can delete this comment");
    };
    state.comments.remove(commentId);
  };

  public func listComments(state : MediaState, mediaId : Common.MediaId) : [T.Comment] {
    let result = List.empty<T.Comment>();
    for ((_, comment) in state.comments.entries()) {
      if (comment.mediaId == mediaId) {
        result.add(comment);
      };
    };
    // Sort by createdAt ascending for threaded display
    result.sortInPlace(func(a, b) = Int.compare(a.createdAt, b.createdAt));
    result.toArray();
  };

  // ── Admin helpers ─────────────────────────────────────────────────────────
  public func adminListAllMedia(state : MediaState) : [T.Media] {
    let result = List.empty<T.Media>();
    for ((_, item) in state.media.entries()) {
      result.add(item);
    };
    result.toArray();
  };

  public func adminDeleteMedia(state : MediaState, mediaId : Common.MediaId) : () {
    switch (state.media.get(mediaId)) {
      case null Runtime.trap("Media not found");
      case _ {};
    };
    state.media.remove(mediaId);
    state.likes.remove(mediaId);
    // Remove all comments for this media
    let toRemove = List.empty<Common.CommentId>();
    for ((commentId, comment) in state.comments.entries()) {
      if (comment.mediaId == mediaId) {
        toRemove.add(commentId);
      };
    };
    for (commentId in toRemove.values()) {
      state.comments.remove(commentId);
    };
  };

  public func deleteMomentData(state : MediaState, momentId : Common.MomentId) : () {
    // Collect all media ids for this moment
    let mediaToRemove = List.empty<Common.MediaId>();
    for ((mediaId, item) in state.media.entries()) {
      if (item.momentId == momentId) {
        mediaToRemove.add(mediaId);
      };
    };
    // Remove media, likes, and their comments
    for (mediaId in mediaToRemove.values()) {
      state.media.remove(mediaId);
      state.likes.remove(mediaId);
      let commentsToRemove = List.empty<Common.CommentId>();
      for ((commentId, comment) in state.comments.entries()) {
        if (comment.mediaId == mediaId) {
          commentsToRemove.add(commentId);
        };
      };
      for (commentId in commentsToRemove.values()) {
        state.comments.remove(commentId);
      };
    };
    // Remove all folders for this moment
    let foldersToRemove = List.empty<Common.FolderId>();
    for ((folderId, folder) in state.folders.entries()) {
      if (folder.momentId == momentId) {
        foldersToRemove.add(folderId);
      };
    };
    for (folderId in foldersToRemove.values()) {
      state.folders.remove(folderId);
    };
  };
};
