export const QUERY_KEYS = {
  // Profile
  callerProfile: ["callerProfile"] as const,
  userProfile: (userId: string) => ["userProfile", userId] as const,
  userProfileByUsername: (username: string) =>
    ["userProfileByUsername", username] as const,
  callerRole: ["callerRole"] as const,

  // Social
  followers: (userId: string) => ["followers", userId] as const,
  following: (userId: string) => ["following", userId] as const,
  isFollowing: (userId: string) => ["isFollowing", userId] as const,

  // Moments
  feedMoments: ["feedMoments"] as const,
  myMoments: ["myMoments"] as const,
  myCalendarMoments: ["myCalendarMoments"] as const,
  momentsForUser: (userId: string) => ["momentsForUser", userId] as const,
  momentDetail: (momentId: string) => ["momentDetail", momentId] as const,
  searchMoments: (query: string, tags: string[]) =>
    ["searchMoments", query, tags] as const,

  // Access
  momentAccessStatus: (momentId: string) =>
    ["momentAccessStatus", momentId] as const,
  momentAccessRequests: (momentId: string) =>
    ["momentAccessRequests", momentId] as const,

  // Attendees
  momentAttendees: (momentId: string) => ["momentAttendees", momentId] as const,

  // Waitlist
  momentWaitlist: (momentId: string) => ["momentWaitlist", momentId] as const,

  // Folders
  folders: (momentId: string) => ["folders", momentId] as const,

  // Media
  media: (momentId: string, offset: number) =>
    ["media", momentId, offset] as const,
  mediaByFolder: (folderId: string, offset: number) =>
    ["mediaByFolder", folderId, offset] as const,
  mediaItem: (mediaId: string) => ["mediaItem", mediaId] as const,
  hasLiked: (mediaId: string) => ["hasLiked", mediaId] as const,

  // Comments
  comments: (mediaId: string) => ["comments", mediaId] as const,

  // Announcements
  announcements: (momentId: string) => ["announcements", momentId] as const,

  // Notifications
  notifications: ["notifications"] as const,
  unreadNotificationCount: ["unreadNotificationCount"] as const,

  // Messages
  conversations: ["conversations"] as const,
  conversation: (userId: string) => ["conversation", userId] as const,
  unreadMessageCount: ["unreadMessageCount"] as const,

  // Bookmarks
  bookmarks: ["bookmarks"] as const,
  isBookmarked: (momentId: string) => ["isBookmarked", momentId] as const,

  // Activity feed
  activityFeed: ["activityFeed"] as const,

  // Admin
  adminUsers: ["adminUsers"] as const,
  adminMoments: ["adminMoments"] as const,
  adminMedia: ["adminMedia"] as const,
} as const;
