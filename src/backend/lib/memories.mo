import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "../types/common";
import T "../types/memories";
import UsersLib "users";
import MomentsLib "moments";

module {
  // ── Internal state types ──────────────────────────────────────────────────
  public type MemoriesState = {
    memories : Map.Map<T.MemoryId, T.Memory>;
    var memoryCounter : Nat;
  };

  public func initState() : MemoriesState {
    {
      memories = Map.empty<T.MemoryId, T.Memory>();
      var memoryCounter = 0;
    };
  };

  // ── ID generation ─────────────────────────────────────────────────────────
  func generateId(state : MemoriesState, caller : Common.UserId) : T.MemoryId {
    let now = Time.now();
    let counter = state.memoryCounter;
    state.memoryCounter += 1;

    let ts = Int.abs(now);
    let callerHash = caller.toText().size();

    let a = ts % 0xFFFFFFFF;
    let b = (ts / 0xFFFFFFFF + counter) % 0xFFFF;
    let c = (counter * 1000003 + callerHash) % 0xFFFF;
    let d = (ts / 0x10000 + callerHash * 31 + counter) % 0xFFFF;
    let e = (ts + counter * 999983 + callerHash * 65537) % 0xFFFFFFFFFFFF;

    toHex8(a) # "-" # toHex4(b) # "-4" # toHex3(c % 0xFFF) # "-" #
    toHexVariant(d) # toHex3(d % 0xFFF) # "-" # toHex12(e);
  };

  func toHex(n : Nat) : Text {
    let digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    if (n == 0) return "0";
    var result = "";
    var remaining = n;
    while (remaining > 0) {
      result := digits[remaining % 16] # result;
      remaining := remaining / 16;
    };
    result;
  };

  func padLeft(s : Text, len : Nat, pad : Text) : Text {
    var result = s;
    while (result.size() < len) {
      result := pad # result;
    };
    result;
  };

  func toHex8(n : Nat) : Text { padLeft(toHex(n % 0xFFFFFFFF), 8, "0") };
  func toHex4(n : Nat) : Text { padLeft(toHex(n % 0xFFFF), 4, "0") };
  func toHex3(n : Nat) : Text { padLeft(toHex(n % 0xFFF), 3, "0") };
  func toHex12(n : Nat) : Text { padLeft(toHex(n % 0xFFFFFFFFFFFF), 12, "0") };

  func toHexVariant(n : Nat) : Text {
    let variants = ["8", "9", "a", "b"];
    variants[n % 4];
  };

  // ── Attendance check ──────────────────────────────────────────────────────
  func pairCompare(a : (Common.MomentId, Common.UserId), b : (Common.MomentId, Common.UserId)) : { #less; #equal; #greater } {
    let (aId, aUser) = a;
    let (bId, bUser) = b;
    switch (Text.compare(aId, bId)) {
      case (#equal) Principal.compare(aUser, bUser);
      case (other) other;
    };
  };

  func isAttending(momentsState : MomentsLib.MomentsState, momentId : Common.MomentId, userId : Common.UserId) : Bool {
    switch (momentsState.moments.get(momentId)) {
      case null false;
      case (?m) {
        if (Principal.equal(m.owner, userId)) return true;
        switch (momentsState.attendees.get(pairCompare, (momentId, userId))) {
          case null false;
          case (?_) true;
        };
      };
    };
  };

  // ── Core operations ───────────────────────────────────────────────────────
  public func postMemory(
    state : MemoriesState,
    caller : Common.UserId,
    momentsState : MomentsLib.MomentsState,
    momentId : Common.MomentId,
    content : Text,
    mediaBlob : ?Storage.ExternalBlob,
    mediaKind : ?T.MemoryMediaKind
  ) : { #ok : T.MemoryId; #err : Text } {
    if (not isAttending(momentsState, momentId, caller)) {
      return #err("Only attending users can post memories");
    };
    if (content.size() == 0 and mediaBlob == null) {
      return #err("Memory must have content or media");
    };
    let id = generateId(state, caller);
    let memory : T.Memory = {
      id;
      momentId;
      authorId = caller;
      content;
      mediaBlob;
      mediaKind;
      createdAt = Time.now();
    };
    state.memories.add(id, memory);
    #ok(id);
  };

  public func getMemoriesForMoment(
    state : MemoriesState,
    usersState : UsersLib.UsersState,
    momentId : Common.MomentId,
    limit : Nat,
    before : ?Common.Timestamp
  ) : [T.MemoryWithAuthor] {
    // Collect matching memories
    let collected = List.empty<T.Memory>();
    state.memories.forEach(func(_, mem) {
      if (mem.momentId == momentId) {
        let shouldInclude = switch (before) {
          case null true;
          case (?ts) mem.createdAt < ts;
        };
        if (shouldInclude) collected.add(mem);
      };
    });

    // Sort newest first
    let sorted = collected.sort(func(a : T.Memory, b : T.Memory) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });

    // Slice to limit
    let total = sorted.size();
    let take = if (limit > total) total else limit;
    let limited = sorted.sliceToArray(0, take);

    // Enrich with author info
    limited.map<T.Memory, T.MemoryWithAuthor>(func(mem) {
      let (username, displayName) = switch (usersState.profiles.get(mem.authorId)) {
        case (?profile) (profile.username, profile.username);
        case null (mem.authorId.toText(), mem.authorId.toText());
      };
      {
        id = mem.id;
        momentId = mem.momentId;
        authorId = mem.authorId;
        authorUsername = username;
        authorDisplayName = displayName;
        content = mem.content;
        mediaBlob = mem.mediaBlob;
        mediaKind = mem.mediaKind;
        createdAt = mem.createdAt;
      };
    });
  };

  public func deleteMemory(
    state : MemoriesState,
    caller : Common.UserId,
    memoryId : T.MemoryId
  ) : { #ok; #err : Text } {
    switch (state.memories.get(memoryId)) {
      case null #err("Memory not found");
      case (?mem) {
        if (not Principal.equal(mem.authorId, caller)) {
          return #err("Only the author can delete this memory");
        };
        state.memories.remove(memoryId);
        #ok;
      };
    };
  };

  public func getMemoryCount(state : MemoriesState, momentId : Common.MomentId) : Nat {
    var count = 0;
    state.memories.forEach(func(_, mem) {
      if (mem.momentId == momentId) count += 1;
    });
    count;
  };
};
