import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Common "../types/common";
import T "../types/messaging";

module {
  public type MessagingState = {
    // Keyed by conversation key (sorted pair of user IDs joined with ":")
    messages : Map.Map<Text, List.List<T.Message>>;
    var nextMessageId : Nat;
    // Track which conversation keys have been accepted (non-follower request was accepted)
    acceptedRequests : Set.Set<Text>;
  };

  public func initState() : MessagingState {
    {
      messages = Map.empty<Text, List.List<T.Message>>();
      var nextMessageId = 0;
      acceptedRequests = Set.empty<Text>();
    };
  };

  // Produces a stable conversation key for the two user IDs (always sorted)
  public func conversationKey(a : Common.UserId, b : Common.UserId) : Text {
    let ta = a.toText();
    let tb = b.toText();
    switch (Text.compare(ta, tb)) {
      case (#less) ta # ":" # tb;
      case (#greater) tb # ":" # ta;
      case (#equal) ta # ":" # tb;
    };
  };

  // isFollowing: caller provides this check (pass following state from UsersLib)
  // If sender does NOT follow recipient, message goes to request inbox.
  // senderFollowsRecipient: whether the sender is in the recipient's followers (checked externally)
  public func sendMessage(
    state : MessagingState,
    senderId : Common.UserId,
    recipientId : Common.UserId,
    text : Text,
    _senderFollowsRecipient : Bool
  ) : T.Message {
    let id = state.nextMessageId;
    state.nextMessageId += 1;

    let msg : T.Message = {
      id;
      senderId;
      recipientId;
      text;
      createdAt = Time.now();
      isRead = false;
    };

    let key = conversationKey(senderId, recipientId);
    let list = switch (state.messages.get(key)) {
      case (?existing) existing;
      case null {
        let newList = List.empty<T.Message>();
        state.messages.add(key, newList);
        newList;
      };
    };
    list.add(msg);
    msg;
  };

  public func getConversation(
    state : MessagingState,
    callerId : Common.UserId,
    otherId : Common.UserId
  ) : [T.Message] {
    let key = conversationKey(callerId, otherId);
    switch (state.messages.get(key)) {
      case (?list) list.toArray();
      case null [];
    };
  };

  // Returns split inbox: accepted conversations and message requests.
  // A conversation is a "request" if:
  //   - The other party doesn't follow the caller (caller is recipient)
  //   - AND the request has not been explicitly accepted
  // followingSet: the set of principals that the caller follows (to determine direction)
  // followersSet: the set of principals that follow the caller
  public func getConversationSummaries(
    state : MessagingState,
    userId : Common.UserId,
    followingSet : Set.Set<Common.UserId>,
    followersSet : Set.Set<Common.UserId>
  ) : T.ConversationInboxResult {
    let accepted = List.empty<T.ConversationSummary>();
    let requests = List.empty<T.ConversationSummary>();

    let userIdText = userId.toText();

    state.messages.forEach(func(key : Text, list : List.List<T.Message>) {
      // Determine if this conversation involves userId
      let parts = key.split(#char ':');
      let partsArr = List.fromIter(parts).toArray();
      if (partsArr.size() != 2) return;

      let aText = partsArr[0];
      let bText = partsArr[1];

      if (aText != userIdText and bText != userIdText) return;

      let otherText = if (aText == userIdText) bText else aText;
      let otherId = Principal.fromText(otherText);

      // Get last message
      let msgArray = list.toArray();
      if (msgArray.size() == 0) return;
      let lastMsg = msgArray[msgArray.size() - 1];

      // Count unread messages for userId as recipient
      var unread = 0;
      for (m in msgArray.values()) {
        if (m.recipientId == userId and not m.isRead) {
          unread += 1;
        };
      };

      // Determine if this is a message request:
      // It's a request if the other user does NOT follow caller AND it hasn't been accepted
      let otherFollowsCaller = followersSet.contains(otherId);
      let callerFollowsOther = followingSet.contains(otherId);
      let isAccepted = state.acceptedRequests.contains(key);

      // Message from a non-mutual stranger to caller = request, unless accepted
      // If caller sent the first message, it's in their sent/outbox — treat as accepted
      let firstMsg = msgArray[0];
      let isRequest = (not otherFollowsCaller and not callerFollowsOther and not isAccepted and firstMsg.senderId != userId);

      let summary : T.ConversationSummary = {
        userId = otherId;
        lastMessage = lastMsg;
        unreadCount = unread;
        isMessageRequest = isRequest;
      };

      if (isRequest) {
        requests.add(summary);
      } else {
        accepted.add(summary);
      };
    });

    {
      accepted = accepted.toArray();
      requests = requests.toArray();
    };
  };

  public func markConversationRead(
    state : MessagingState,
    callerId : Common.UserId,
    otherId : Common.UserId
  ) : () {
    let key = conversationKey(callerId, otherId);
    switch (state.messages.get(key)) {
      case (?list) {
        list.mapInPlace(func(m : T.Message) : T.Message {
          if (m.recipientId == callerId and not m.isRead) {
            { m with isRead = true }
          } else {
            m
          }
        });
      };
      case null {};
    };
  };

  // Only counts unread in accepted conversations (not requests)
  public func unreadMessageCount(
    state : MessagingState,
    userId : Common.UserId,
    followingSet : Set.Set<Common.UserId>,
    followersSet : Set.Set<Common.UserId>
  ) : Nat {
    var count = 0;
    let userIdText = userId.toText();

    state.messages.forEach(func(key : Text, list : List.List<T.Message>) {
      let parts = key.split(#char ':');
      let partsArr = List.fromIter(parts).toArray();
      if (partsArr.size() != 2) return;

      let aText = partsArr[0];
      let bText = partsArr[1];
      if (aText != userIdText and bText != userIdText) return;

      let otherText = if (aText == userIdText) bText else aText;
      let otherId = Principal.fromText(otherText);

      let otherFollowsCaller = followersSet.contains(otherId);
      let callerFollowsOther = followingSet.contains(otherId);
      let isAccepted = state.acceptedRequests.contains(key);

      let msgArray = list.toArray();
      if (msgArray.size() == 0) return;
      let firstMsg = msgArray[0];
      let isRequest = (not otherFollowsCaller and not callerFollowsOther and not isAccepted and firstMsg.senderId != userId);

      if (not isRequest) {
        for (m in msgArray.values()) {
          if (m.recipientId == userId and not m.isRead) {
            count += 1;
          };
        };
      };
    });

    count;
  };

  // Accept a message request: moves the conversation to accepted inbox
  public func acceptMessageRequest(
    state : MessagingState,
    userId : Common.UserId,
    fromId : Common.UserId
  ) : () {
    let key = conversationKey(userId, fromId);
    state.acceptedRequests.add(key);
  };

  // Delete a message request: removes all messages in this conversation
  public func deleteMessageRequest(
    state : MessagingState,
    userId : Common.UserId,
    fromId : Common.UserId
  ) : () {
    let key = conversationKey(userId, fromId);
    state.messages.remove(key);
    state.acceptedRequests.remove(key);
  };
};
