// migration.mo — adds endDate : ?Int to each Moment in momentsState.
// Old type (pre-upgrade) is defined inline; new types are imported from the current modules.
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "types/common";
import T "types/moments";
import MomentsLib "lib/moments";

module {
  // ── Old types (inline — do NOT import from .old/) ────────────────────────

  type OldVisibility = { #public_; #private_ };
  type OldRecurrenceFrequency = { #daily; #weekly; #monthly; #yearly };
  type OldRecurrenceEndCondition = {
    #endDate : Int;
    #count : Nat;
    #never;
  };
  type OldRecurrenceRule = {
    frequency : OldRecurrenceFrequency;
    interval : Nat;
    daysOfWeek : [Nat];
    endCondition : OldRecurrenceEndCondition;
  };
  type OldAgendaItem = {
    id : Nat;
    time : Text;
    title : Text;
    description : ?Text;
  };
  type OldMoment = {
    id : Text;
    owner : Principal;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Int;
    // NOTE: endDate is intentionally absent — this is the old shape
    tags : [Text];
    coverImage : ?Storage.ExternalBlob;
    visibility : OldVisibility;
    createdAt : Int;
    updatedAt : Int;
    recurrence : ?OldRecurrenceRule;
    maxAttendees : ?Nat;
    agendaItems : [OldAgendaItem];
  };

  type OldAccessStatus = { #approved; #pending; #denied; #revoked };
  type OldAccessRequest = {
    momentId : Text;
    requester : Principal;
    status : OldAccessStatus;
    requestedAt : Int;
    resolvedAt : ?Int;
  };
  type OldRsvpStatus = { #attending; #maybe; #notAttending };
  type OldAttendee = {
    momentId : Text;
    userId : Principal;
    rsvpStatus : OldRsvpStatus;
    joinedAt : Int;
  };

  type OldMomentsState = {
    moments : Map.Map<Text, OldMoment>;
    accessRequests : Map.Map<(Text, Principal), OldAccessRequest>;
    attendees : Map.Map<(Text, Principal), OldAttendee>;
    grantedAccess : Map.Map<Text, Set.Set<Principal>>;
    waitlists : Map.Map<Text, List.List<Principal>>;
    var idCounter : Nat;
    var agendaIdCounter : Nat;
  };

  // ── Actor state shapes ─────────────────────────────────────────────────────

  type OldActor = {
    momentsState : OldMomentsState;
  };

  type NewActor = {
    momentsState : MomentsLib.MomentsState;
  };

  // ── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Map each OldMoment to a new Moment by injecting endDate = null
    let newMoments = old.momentsState.moments.map<Text, OldMoment, T.Moment>(
      func(_id, m) {
        {
          m with
          endDate = null : ?Int;
        }
      }
    );

    let newMomentsState : MomentsLib.MomentsState = {
      moments = newMoments;
      accessRequests = old.momentsState.accessRequests;
      attendees = old.momentsState.attendees;
      grantedAccess = old.momentsState.grantedAccess;
      waitlists = old.momentsState.waitlists;
      var idCounter = old.momentsState.idCounter;
      var agendaIdCounter = old.momentsState.agendaIdCounter;
    };

    { momentsState = newMomentsState };
  };
};
