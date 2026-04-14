import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type MediaKind = { #image; #video; #audio; #document };

  public type Folder = {
    id : Common.FolderId;
    momentId : Common.MomentId;
    name : Text;
    isDefault : Bool;
    createdAt : Common.Timestamp;
  };

  public type Media = {
    id : Common.MediaId;
    momentId : Common.MomentId;
    folderId : Common.FolderId;
    uploadedBy : Common.UserId;
    filename : Text;
    kind : MediaKind;
    blob : Storage.ExternalBlob;
    likeCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type Comment = {
    id : Common.CommentId;
    mediaId : Common.MediaId;
    author : Common.UserId;
    parentId : ?Common.CommentId;
    text : Text;
    createdAt : Common.Timestamp;
  };

  public type MediaPage = {
    items : [Media];
    nextOffset : ?Nat;
    total : Nat;
  };

  public type CreateFolderInput = {
    momentId : Common.MomentId;
    name : Text;
  };

  public type UploadMediaInput = {
    momentId : Common.MomentId;
    folderId : Common.FolderId;
    filename : Text;
    kind : MediaKind;
    blob : Storage.ExternalBlob;
  };

  public type AddCommentInput = {
    mediaId : Common.MediaId;
    parentId : ?Common.CommentId;
    text : Text;
  };
};
