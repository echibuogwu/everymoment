import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type MemoryId = Text; // UUID Text

  // mediaKind tracks how to render the media in the frontend
  public type MemoryMediaKind = { #image; #video; #audio };

  public type Memory = {
    id : MemoryId;
    momentId : Common.MomentId;
    authorId : Common.UserId;
    content : Text;
    // Persistent media stored via object-storage; null = text-only memory
    mediaBlob : ?Storage.ExternalBlob;
    mediaKind : ?MemoryMediaKind;
    createdAt : Common.Timestamp;
  };

  public type MemoryWithAuthor = {
    id : MemoryId;
    momentId : Common.MomentId;
    authorId : Common.UserId;
    authorUsername : Text;
    authorDisplayName : Text;
    content : Text;
    mediaBlob : ?Storage.ExternalBlob;
    mediaKind : ?MemoryMediaKind;
    createdAt : Common.Timestamp;
  };

  public type PostMemoryInput = {
    momentId : Common.MomentId;
    content : Text;
    mediaBlob : ?Storage.ExternalBlob;
    mediaKind : ?MemoryMediaKind;
  };
};
