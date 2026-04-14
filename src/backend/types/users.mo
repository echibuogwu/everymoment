import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  // ── Extended profile types ─────────────────────────────────────────────────

  // A social link, e.g. { name = "Twitter"; url = "https://twitter.com/..." }
  public type SocialLink = {
    name : Text;
    url : Text;
  };

  // Generic payment / wallet detail — not limited to crypto.
  // e.g. { name = "PayPal"; value = "user@example.com" }
  //      { name = "Bitcoin"; value = "bc1q..." }
  //      { name = "Revolut"; value = "@username" }
  public type PaymentDetail = {
    name : Text;
    value : Text;
  };

  public type UserProfile = {
    id : Common.UserId;
    username : Text;
    photo : ?Storage.ExternalBlob;
    name : ?Text;
    location : ?Text;
    socials : ?[SocialLink];
    paymentDetails : ?[PaymentDetail];
    createdAt : Common.Timestamp;
  };

  // Shared (API boundary) version — no mutable fields
  public type UserProfilePublic = {
    id : Common.UserId;
    username : Text;
    photo : ?Storage.ExternalBlob;
    name : ?Text;
    location : ?Text;
    socials : ?[SocialLink];
    paymentDetails : ?[PaymentDetail];
    followersCount : Nat;
    followingCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type SaveProfileInput = {
    username : Text;
    photo : ?Storage.ExternalBlob;
    name : ?Text;
    location : ?Text;
    socials : ?[SocialLink];
    paymentDetails : ?[PaymentDetail];
  };
};
