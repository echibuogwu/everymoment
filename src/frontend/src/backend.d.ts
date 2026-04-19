import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CreateMomentInput {
    locationLat?: number;
    locationLng?: number;
    title: string;
    endDate?: Timestamp;
    maxAttendees?: bigint;
    tags: Array<string>;
    agendaItems: Array<{
        title: string;
        time: string;
        description?: string;
    }>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    visibility: Visibility;
    location: string;
    eventDate: Timestamp;
}
export interface Attendee {
    rsvpStatus: RsvpStatus;
    userId: UserId;
    joinedAt: Timestamp;
    momentId: MomentId;
}
export type Timestamp = bigint;
export interface AccessRequest {
    status: AccessStatus;
    requester: UserId;
    momentId: MomentId;
    requestedAt: Timestamp;
    resolvedAt?: Timestamp;
}
export interface SocialLink {
    url: string;
    name: string;
}
export interface MomentListItem {
    id: MomentId;
    locationLat?: number;
    locationLng?: number;
    title: string;
    attendeeCount: bigint;
    endDate?: Timestamp;
    owner: UserId;
    maxAttendees?: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    occurrenceDate?: Timestamp;
    callerRelation?: CallerRelation;
    waitlistCount: bigint;
    visibility: Visibility;
    location: string;
    eventDate: Timestamp;
}
export interface ActivityEvent {
    id: bigint;
    kind: ActivityKind;
    createdAt: Timestamp;
    momentId?: MomentId;
    actorId: UserId;
    targetUserId?: UserId;
}
export interface Folder {
    id: FolderId;
    name: string;
    createdAt: Timestamp;
    momentId: MomentId;
    isDefault: boolean;
}
export type MemoryId = string;
export interface MediaPage {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Media>;
}
export interface PaymentDetail {
    value: string;
    name: string;
}
export interface Media {
    id: MediaId;
    likeCount: bigint;
    blob: ExternalBlob;
    kind: MediaKind;
    createdAt: Timestamp;
    momentId: MomentId;
    filename: string;
    folderId: FolderId;
    uploadedBy: UserId;
}
export interface FollowRequest {
    id: string;
    status: FollowRequestStatus;
    createdAt: Timestamp;
    toId: UserId;
    fromId: UserId;
}
export interface UpdateMomentInput {
    locationLat?: number;
    locationLng?: number;
    title: string;
    endDate?: Timestamp;
    maxAttendees?: bigint;
    tags: Array<string>;
    agendaItems: Array<{
        title: string;
        time: string;
        description?: string;
    }>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    visibility: Visibility;
    location: string;
    eventDate: Timestamp;
}
export interface SaveProfileInput {
    username: string;
    hideAttendingList: boolean;
    name?: string;
    socials?: Array<SocialLink>;
    paymentDetails?: Array<PaymentDetail>;
    isPrivateProfile: boolean;
    photo?: ExternalBlob;
    location?: string;
}
export interface ConversationSummary {
    userId: UserId;
    lastMessage: Message;
    isMessageRequest: boolean;
    unreadCount: bigint;
}
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    createdAt: Timestamp;
    text: string;
    author: UserId;
    parentId?: CommentId;
    mediaId: MediaId;
}
export type CallerRelation = {
    __kind__: "owned";
    owned: null;
} | {
    __kind__: "rsvp";
    rsvp: RsvpStatus;
} | {
    __kind__: "following";
    following: null;
};
export interface MemoryWithAuthor {
    id: MemoryId;
    authorUsername: string;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    momentId: MomentId;
    mediaBlob?: ExternalBlob;
    mediaKind?: MemoryMediaKind;
    authorDisplayName: string;
}
export interface BulkImportResult {
    errors: Array<{
        row: bigint;
        message: string;
    }>;
    successCount: bigint;
    warnings: Array<{
        row: bigint;
        message: string;
    }>;
}
export interface CreateFolderInput {
    name: string;
    momentId: MomentId;
}
export interface AttendanceInfo {
    status: string;
    rsvpTime: Timestamp;
    momentDate: Timestamp;
    username: string;
    momentTitle: string;
}
export interface UserProfilePublic {
    id: UserId;
    username: string;
    hideAttendingList: boolean;
    followersCount: bigint;
    name?: string;
    createdAt: Timestamp;
    socials?: Array<SocialLink>;
    paymentDetails?: Array<PaymentDetail>;
    isPrivateProfile: boolean;
    hostedCount: bigint;
    attendedCount: bigint;
    followingCount: bigint;
    photo?: ExternalBlob;
    isPrivateHidden: boolean;
    location?: string;
}
export interface AgendaItem {
    id: bigint;
    title: string;
    time: string;
    description?: string;
}
export interface Announcement {
    id: bigint;
    authorId: UserId;
    createdAt: Timestamp;
    text: string;
    momentId: MomentId;
}
export type UserId = Principal;
export interface UploadMediaInput {
    blob: ExternalBlob;
    kind: MediaKind;
    momentId: MomentId;
    filename: string;
    folderId: FolderId;
}
export interface RecurrenceRule {
    endCondition: RecurrenceEndCondition;
    interval: bigint;
    daysOfWeek: Array<bigint>;
    frequency: RecurrenceFrequency;
}
export interface ConversationInboxResult {
    requests: Array<ConversationSummary>;
    accepted: Array<ConversationSummary>;
}
export interface MomentDetail {
    id: MomentId;
    locationLat?: number;
    locationLng?: number;
    title: string;
    attendeeCount: bigint;
    endDate?: Timestamp;
    callerAccessStatus?: AccessStatus;
    owner: UserId;
    maxAttendees?: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    agendaItems: Array<AgendaItem>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    updatedAt: Timestamp;
    waitlistCount: bigint;
    visibility: Visibility;
    isOwner: boolean;
    location: string;
    eventDate: Timestamp;
}
export interface Notification {
    id: bigint;
    kind: NotificationKind;
    createdAt: Timestamp;
    referenceId?: string;
    isRead: boolean;
    message: string;
    recipientId: UserId;
}
export type RecurrenceEndCondition = {
    __kind__: "endDate";
    endDate: Timestamp;
} | {
    __kind__: "count";
    count: bigint;
} | {
    __kind__: "never";
    never: null;
};
export interface Message {
    id: bigint;
    createdAt: Timestamp;
    text: string;
    isRead: boolean;
    recipientId: UserId;
    senderId: UserId;
}
export interface BulkImportMomentRow {
    locationLat?: number;
    locationLng?: number;
    coverImageUrl?: string;
    title: string;
    endDate?: Timestamp;
    maxAttendees?: bigint;
    tags: Array<string>;
    description?: string;
    visibility: string;
    location?: string;
    startDate: Timestamp;
}
export type MomentId = string;
export interface AddCommentInput {
    text: string;
    parentId?: CommentId;
    mediaId: MediaId;
}
export type MediaId = bigint;
export type FolderId = bigint;
export enum AccessStatus {
    revoked = "revoked",
    pending = "pending",
    denied = "denied",
    approved = "approved"
}
export enum ActivityKind {
    rsvpdToMoment = "rsvpdToMoment",
    createdMoment = "createdMoment",
    followedUser = "followedUser"
}
export enum FollowRequestStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum MediaKind {
    audio = "audio",
    video = "video",
    document_ = "document",
    image = "image"
}
export enum MemoryMediaKind {
    audio = "audio",
    video = "video",
    image = "image"
}
export enum NotificationKind {
    accessRequestResolved = "accessRequestResolved",
    rsvpToYourMoment = "rsvpToYourMoment",
    mentioned = "mentioned",
    newAnnouncement = "newAnnouncement",
    newFollower = "newFollower",
    newMessage = "newMessage"
}
export enum RecurrenceFrequency {
    monthly = "monthly",
    yearly = "yearly",
    daily = "daily",
    weekly = "weekly"
}
export enum RsvpStatus {
    maybe = "maybe",
    notAttending = "notAttending",
    attending = "attending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Visibility {
    public_ = "public",
    private_ = "private"
}
export interface backendInterface {
    acceptFollowRequest(requestId: string): Promise<void>;
    acceptMessageRequest(fromId: UserId): Promise<void>;
    addComment(input: AddCommentInput): Promise<CommentId>;
    adminBulkImportMoments(rows: Array<BulkImportMomentRow>): Promise<BulkImportResult>;
    adminDeleteAllMoments(): Promise<void>;
    adminDeleteMedia(mediaId: MediaId): Promise<void>;
    adminDeleteMoment(momentId: MomentId): Promise<void>;
    adminDeleteUser(userId: UserId): Promise<void>;
    adminListMedia(): Promise<Array<Media>>;
    adminListMoments(): Promise<Array<MomentListItem>>;
    adminListUsers(): Promise<Array<UserProfilePublic>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkMoment(momentId: MomentId): Promise<void>;
    cancelFollowRequest(requestId: string): Promise<void>;
    createFolder(input: CreateFolderInput): Promise<FolderId>;
    createMoment(input: CreateMomentInput): Promise<MomentId>;
    deleteAnnouncement(momentId: MomentId, announcementId: bigint): Promise<void>;
    deleteComment(commentId: CommentId): Promise<void>;
    deleteFolder(folderId: FolderId): Promise<void>;
    deleteMedia(mediaId: MediaId): Promise<void>;
    deleteMemory(memoryId: MemoryId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteMessageRequest(fromId: UserId): Promise<void>;
    deleteMoment(momentId: MomentId): Promise<void>;
    followUser(target: UserId): Promise<boolean>;
    getActivityFeed(): Promise<Array<ActivityEvent>>;
    getAnnouncementsForMoment(momentId: MomentId): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(otherUserId: UserId): Promise<Array<Message>>;
    getEventPassInfo(momentId: MomentId, userId: UserId): Promise<{
        __kind__: "ok";
        ok: AttendanceInfo;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getFeedMoments(): Promise<Array<MomentListItem>>;
    getFollowRequestStatus(targetId: UserId): Promise<FollowRequest | null>;
    getFollowers(userId: UserId): Promise<Array<UserProfilePublic>>;
    getFollowing(userId: UserId): Promise<Array<UserProfilePublic>>;
    getMedia(mediaId: MediaId): Promise<Media | null>;
    getMemories(momentId: MomentId, limit: bigint, before: Timestamp | null): Promise<{
        __kind__: "ok";
        ok: Array<MemoryWithAuthor>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMomentAccessStatus(momentId: MomentId): Promise<AccessStatus | null>;
    getMomentAttendees(momentId: MomentId): Promise<Array<Attendee>>;
    getMomentDetail(momentId: MomentId): Promise<MomentDetail | null>;
    getMomentPublicUrl(momentId: MomentId): Promise<string>;
    getMomentQrCode(momentId: MomentId): Promise<string>;
    getMomentShareUrl(momentId: MomentId): Promise<string>;
    getMomentWaitlist(momentId: MomentId): Promise<Array<UserId>>;
    getMomentsForUser(userId: UserId): Promise<Array<MomentListItem>>;
    getMyAttendanceInfo(momentId: MomentId): Promise<AttendanceInfo | null>;
    getMyBookmarks(): Promise<Array<MomentId>>;
    getMyCalendarMoments(rangeStart: Timestamp, rangeEnd: Timestamp): Promise<Array<MomentListItem>>;
    getMyConversations(): Promise<ConversationInboxResult>;
    getMyMoments(): Promise<Array<MomentListItem>>;
    getMyNotifications(): Promise<Array<Notification>>;
    getPendingFollowRequests(): Promise<Array<FollowRequest>>;
    getUnreadMessageCount(): Promise<bigint>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUserProfile(userId: UserId): Promise<UserProfilePublic | null>;
    getUserProfileByUsername(username: string): Promise<UserProfilePublic | null>;
    hasLikedMedia(mediaId: MediaId): Promise<boolean>;
    isBookmarked(momentId: MomentId): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFollowingUser(target: UserId): Promise<boolean>;
    isUsernameTaken(username: string): Promise<boolean>;
    listComments(mediaId: MediaId): Promise<Array<Comment>>;
    listFolders(momentId: MomentId): Promise<Array<Folder>>;
    listMedia(momentId: MomentId, offset: bigint, limit: bigint): Promise<MediaPage>;
    listMediaByFolder(folderId: FolderId, offset: bigint, limit: bigint): Promise<MediaPage>;
    listMomentAccessRequests(momentId: MomentId): Promise<Array<AccessRequest>>;
    markAllNotificationsRead(): Promise<void>;
    markConversationRead(otherUserId: UserId): Promise<void>;
    markNotificationRead(id: bigint): Promise<void>;
    postAnnouncement(momentId: MomentId, text: string): Promise<Announcement>;
    postMemory(momentId: MomentId, content: string, mediaBlob: ExternalBlob | null, mediaKind: MemoryMediaKind | null): Promise<{
        __kind__: "ok";
        ok: MemoryId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rejectFollowRequest(requestId: string): Promise<void>;
    requestMomentAccess(momentId: MomentId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resolveAccessRequest(momentId: MomentId, requester: UserId, approved: boolean): Promise<void>;
    revokeMomentAccess(momentId: MomentId, userId: UserId): Promise<void>;
    saveCallerUserProfile(input: SaveProfileInput): Promise<void>;
    searchMoments(searchText: string | null, tags: Array<string>, dateRangeStart: Timestamp | null, dateRangeEnd: Timestamp | null, locationLat: number | null, locationLng: number | null, radiusKm: number | null, offset: bigint, limit: bigint): Promise<Array<MomentListItem>>;
    searchUsers(prefix: string, limit: bigint): Promise<Array<UserProfilePublic>>;
    sendMessage(recipientId: UserId, text: string): Promise<bigint>;
    setRsvp(momentId: MomentId, status: RsvpStatus): Promise<void>;
    toggleLike(mediaId: MediaId): Promise<bigint>;
    unbookmarkMoment(momentId: MomentId): Promise<void>;
    unfollowUser(target: UserId): Promise<void>;
    updateMoment(momentId: MomentId, input: UpdateMomentInput): Promise<void>;
    uploadMedia(input: UploadMediaInput): Promise<MediaId>;
}
