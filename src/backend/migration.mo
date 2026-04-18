// Migration from previous version to current version.
//
// Changes in momentsState:
//   - Moment gained `maxAttendees : ?Nat` and `agendaItems : [AgendaItem]`
//   - MomentsState gained `waitlists` and `agendaIdCounter`
//
// Changes in usersState:
//   - UserProfile gained `isPrivateProfile : Bool` and `hideAttendingList : Bool`
//   - UsersState gained `bookmarks`
//
// Old types are defined inline (copied from .old/src/backend/types/) — never import from .old/.

import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  // ── Shared primitive aliases ───────────────────────────────────────────────

  type UserId = Principal;
  type MomentId = Text;
  type Timestamp = Int;
  type ExternalBlob = Storage.ExternalBlob;

  // ── Old inline type definitions ────────────────────────────────────────────
  // (copied from .old/src/backend/types/)

  type OldVisibility = { #public_; #private_ };
  type OldRecurrenceFrequency = { #daily; #weekly; #monthly; #yearly };
  type OldRecurrenceEndCondition = {
    #endDate : Timestamp;
    #count : Nat;
    #never;
  };
  type OldRecurrenceRule = {
    frequency : OldRecurrenceFrequency;
    interval : Nat;
    daysOfWeek : [Nat];
    endCondition : OldRecurrenceEndCondition;
  };

  // Old Moment — no maxAttendees, no agendaItems
  type OldMoment = {
    id : MomentId;
    owner : UserId;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Timestamp;
    tags : [Text];
    coverImage : ?ExternalBlob;
    visibility : OldVisibility;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    recurrence : ?OldRecurrenceRule;
  };

  type OldAccessStatus = { #approved; #pending; #denied; #revoked };
  type OldAccessRequest = {
    momentId : MomentId;
    requester : UserId;
    status : OldAccessStatus;
    requestedAt : Timestamp;
    resolvedAt : ?Timestamp;
  };
  type OldRsvpStatus = { #attending; #maybe; #notAttending };
  type OldAttendee = {
    momentId : MomentId;
    userId : UserId;
    rsvpStatus : OldRsvpStatus;
    joinedAt : Timestamp;
  };

  // Old MomentsState — no waitlists, no agendaIdCounter
  type OldMomentsState = {
    moments : Map.Map<MomentId, OldMoment>;
    accessRequests : Map.Map<(MomentId, UserId), OldAccessRequest>;
    attendees : Map.Map<(MomentId, UserId), OldAttendee>;
    grantedAccess : Map.Map<MomentId, Set.Set<UserId>>;
    var idCounter : Nat;
  };

  // Old SocialLink / PaymentDetail
  type OldSocialLink = { name : Text; url : Text };
  type OldPaymentDetail = { name : Text; value : Text };

  // Old UserProfile — no isPrivateProfile, no hideAttendingList
  type OldUserProfile = {
    id : UserId;
    username : Text;
    photo : ?ExternalBlob;
    name : ?Text;
    location : ?Text;
    socials : ?[OldSocialLink];
    paymentDetails : ?[OldPaymentDetail];
    createdAt : Timestamp;
  };

  // Old UsersState — no bookmarks
  type OldUsersState = {
    profiles : Map.Map<UserId, OldUserProfile>;
    usernameIndex : Map.Map<Text, UserId>;
    followers : Map.Map<UserId, Set.Set<UserId>>;
    following : Map.Map<UserId, Set.Set<UserId>>;
  };

  // ── New inline type definitions ────────────────────────────────────────────
  // Mirror types from new types/ and lib/ files exactly.

  type NewVisibility = { #public_; #private_ };
  type NewRecurrenceFrequency = { #daily; #weekly; #monthly; #yearly };
  type NewRecurrenceEndCondition = {
    #endDate : Timestamp;
    #count : Nat;
    #never;
  };
  type NewRecurrenceRule = {
    frequency : NewRecurrenceFrequency;
    interval : Nat;
    daysOfWeek : [Nat];
    endCondition : NewRecurrenceEndCondition;
  };
  type NewAgendaItem = {
    id : Nat;
    time : Text;
    title : Text;
    description : ?Text;
  };

  // New Moment — adds maxAttendees and agendaItems
  type NewMoment = {
    id : MomentId;
    owner : UserId;
    title : Text;
    description : Text;
    location : Text;
    locationLat : ?Float;
    locationLng : ?Float;
    eventDate : Timestamp;
    tags : [Text];
    coverImage : ?ExternalBlob;
    visibility : NewVisibility;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    recurrence : ?NewRecurrenceRule;
    maxAttendees : ?Nat;
    agendaItems : [NewAgendaItem];
  };

  type NewAccessStatus = { #approved; #pending; #denied; #revoked };
  type NewAccessRequest = {
    momentId : MomentId;
    requester : UserId;
    status : NewAccessStatus;
    requestedAt : Timestamp;
    resolvedAt : ?Timestamp;
  };
  type NewRsvpStatus = { #attending; #maybe; #notAttending };
  type NewAttendee = {
    momentId : MomentId;
    userId : UserId;
    rsvpStatus : NewRsvpStatus;
    joinedAt : Timestamp;
  };

  // New MomentsState
  type NewMomentsState = {
    moments : Map.Map<MomentId, NewMoment>;
    accessRequests : Map.Map<(MomentId, UserId), NewAccessRequest>;
    attendees : Map.Map<(MomentId, UserId), NewAttendee>;
    grantedAccess : Map.Map<MomentId, Set.Set<UserId>>;
    waitlists : Map.Map<MomentId, List.List<UserId>>;
    var idCounter : Nat;
    var agendaIdCounter : Nat;
  };

  type NewSocialLink = { name : Text; url : Text };
  type NewPaymentDetail = { name : Text; value : Text };

  // New UserProfile — adds isPrivateProfile and hideAttendingList
  type NewUserProfile = {
    id : UserId;
    username : Text;
    photo : ?ExternalBlob;
    name : ?Text;
    location : ?Text;
    socials : ?[NewSocialLink];
    paymentDetails : ?[NewPaymentDetail];
    createdAt : Timestamp;
    isPrivateProfile : Bool;
    hideAttendingList : Bool;
  };

  // New UsersState
  type NewUsersState = {
    profiles : Map.Map<UserId, NewUserProfile>;
    usernameIndex : Map.Map<Text, UserId>;
    followers : Map.Map<UserId, Set.Set<UserId>>;
    following : Map.Map<UserId, Set.Set<UserId>>;
    bookmarks : Map.Map<UserId, Set.Set<MomentId>>;
  };

  // ── Combined old/new actor state ──────────────────────────────────────────

  type OldActor = {
    momentsState : OldMomentsState;
    usersState : OldUsersState;
  };

  type NewActor = {
    momentsState : NewMomentsState;
    usersState : NewUsersState;
  };

  // ── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate moments: add maxAttendees = null, agendaItems = []
    let newMoments = old.momentsState.moments.map<MomentId, OldMoment, NewMoment>(
      func(_id, m) {
        {
          m with
          maxAttendees = null : ?Nat;
          agendaItems = [] : [NewAgendaItem];
        }
      }
    );

    let newMomentsState : NewMomentsState = {
      moments = newMoments;
      accessRequests = old.momentsState.accessRequests;
      attendees = old.momentsState.attendees;
      grantedAccess = old.momentsState.grantedAccess;
      waitlists = Map.empty<MomentId, List.List<UserId>>();
      var idCounter = old.momentsState.idCounter;
      var agendaIdCounter = 0;
    };

    // Migrate profiles: add isPrivateProfile = false, hideAttendingList = false
    let newProfiles = old.usersState.profiles.map<UserId, OldUserProfile, NewUserProfile>(
      func(_id, p) {
        {
          p with
          isPrivateProfile = false;
          hideAttendingList = false;
        }
      }
    );

    let newUsersState : NewUsersState = {
      profiles = newProfiles;
      usernameIndex = old.usersState.usernameIndex;
      followers = old.usersState.followers;
      following = old.usersState.following;
      bookmarks = Map.empty<UserId, Set.Set<MomentId>>();
    };

    { momentsState = newMomentsState; usersState = newUsersState };
  };
};
