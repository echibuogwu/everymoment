import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Visibility = { #public_; #private_ };

  public type Moment = {
    id : Common.MomentId;
    owner : Common.UserId;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Common.Timestamp;
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : Visibility;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateMomentInput = {
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Common.Timestamp;
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : Visibility;
  };

  public type UpdateMomentInput = {
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Common.Timestamp;
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : Visibility;
  };

  public type AccessStatus = { #approved; #pending; #denied; #revoked };

  public type AccessRequest = {
    momentId : Common.MomentId;
    requester : Common.UserId;
    status : AccessStatus;
    requestedAt : Common.Timestamp;
    resolvedAt : ?Common.Timestamp;
  };

  public type RsvpStatus = { #attending; #maybe; #notAttending };

  public type Attendee = {
    momentId : Common.MomentId;
    userId : Common.UserId;
    rsvpStatus : RsvpStatus;
    joinedAt : Common.Timestamp;
  };

  // callerRelation: how the caller relates to this moment on the calendar
  // #owned = caller is the owner; #rsvp = caller has an RSVP entry (attending/maybe/etc.)
  public type CallerRelation = { #owned; #rsvp : RsvpStatus; #following };

  public type MomentListItem = {
    id : Common.MomentId;
    owner : Common.UserId;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Common.Timestamp;
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : Visibility;
    attendeeCount : Nat;
    createdAt : Common.Timestamp;
    // Optional: populated when listing caller's calendar moments so frontend can color-differentiate
    callerRelation : ?CallerRelation;
  };

  public type MomentDetail = {
    id : Common.MomentId;
    owner : Common.UserId;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Common.Timestamp;
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : Visibility;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    attendeeCount : Nat;
    callerAccessStatus : ?AccessStatus;
    isOwner : Bool;
  };

  // ── Bulk import ────────────────────────────────────────────────────────────

  // One row from a CSV bulk import. All optional fields default to empty/null.
  public type BulkImportMomentRow = {
    title : Text;
    description : ?Text;
    location : ?Text;
    locationLat : ?Float;
    locationLng : ?Float;
    startDate : Common.Timestamp;
    endDate : ?Common.Timestamp;
    tags : [Text];
    // "public" or "private" — invalid values default to "public"
    visibility : Text;
    maxAttendees : ?Nat;
  };

  public type BulkImportResult = {
    successCount : Nat;
    errors : [{ row : Nat; message : Text }];
  };

  // ── Event Pass / Attendance Info ──────────────────────────────────────────

  // Returned when a user queries their own attendance info for QR code generation.
  // Only populated when the caller has rsvpStatus = #attending.
  public type AttendanceInfo = {
    username : Text;
    rsvpTime : Common.Timestamp;
    momentDate : Common.Timestamp;
    momentTitle : Text;
    status : Text; // "attending" | "maybe" | "notAttending"
  };
};
