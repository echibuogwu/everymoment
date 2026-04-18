import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Visibility = { #public_; #private_ };

  // ── Recurrence types ──────────────────────────────────────────────────────

  public type RecurrenceFrequency = { #daily; #weekly; #monthly; #yearly };

  // End condition for a recurrence rule:
  //   #endDate  — series ends on or before this timestamp (Int nanoseconds)
  //   #count    — series ends after this many occurrences
  //   #never    — series repeats indefinitely
  public type RecurrenceEndCondition = {
    #endDate : Common.Timestamp;
    #count : Nat;
    #never;
  };

  // A recurrence rule stored on a Moment.
  // interval: repeat every N units (e.g. interval=2, frequency=#weekly → every 2 weeks)
  // daysOfWeek: only used when frequency=#weekly. 0=Sun … 6=Sat
  public type RecurrenceRule = {
    frequency : RecurrenceFrequency;
    interval : Nat;              // must be >= 1
    daysOfWeek : [Nat];          // empty = use the eventDate's day of week
    endCondition : RecurrenceEndCondition;
  };

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
    // null = non-recurring moment; ?rule = recurring moment
    recurrence : ?RecurrenceRule;
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
    recurrence : ?RecurrenceRule;
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
    // "edit all": replaces the recurrence rule for all future occurrences
    recurrence : ?RecurrenceRule;
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
    // For recurring moment virtual occurrences, this is the occurrence's date.
    // For non-recurring moments, this is null.
    occurrenceDate : ?Common.Timestamp;
    // Non-null when moment has a recurrence rule
    recurrence : ?RecurrenceRule;
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
    recurrence : ?RecurrenceRule;
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
    // Optional public URL to download and set as the moment's cover image (admin import only)
    coverImageUrl : ?Text;
  };

  public type BulkImportResult = {
    successCount : Nat;
    errors : [{ row : Nat; message : Text }];
    warnings : [{ row : Nat; message : Text }];
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
