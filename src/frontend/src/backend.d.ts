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
    tags: Array<string>;
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
    owner: UserId;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    occurrenceDate?: Timestamp;
    callerRelation?: CallerRelation;
    visibility: Visibility;
    location: string;
    eventDate: Timestamp;
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
export interface PaymentDetail {
    value: string;
    name: string;
}
export interface UpdateMomentInput {
    locationLat?: number;
    locationLng?: number;
    title: string;
    tags: Array<string>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    visibility: Visibility;
    location: string;
    eventDate: Timestamp;
}
export interface SaveProfileInput {
    username: string;
    name?: string;
    socials?: Array<SocialLink>;
    paymentDetails?: Array<PaymentDetail>;
    photo?: ExternalBlob;
    location?: string;
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
export interface AddCommentInput {
    text: string;
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
export interface AttendanceInfo {
    status: string;
    rsvpTime: Timestamp;
    momentDate: Timestamp;
    username: string;
    momentTitle: string;
}
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
export interface UserProfilePublic {
    id: UserId;
    username: string;
    followersCount: bigint;
    name?: string;
    createdAt: Timestamp;
    socials?: Array<SocialLink>;
    paymentDetails?: Array<PaymentDetail>;
    followingCount: bigint;
    photo?: ExternalBlob;
    location?: string;
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
export interface MomentDetail {
    id: MomentId;
    locationLat?: number;
    locationLng?: number;
    title: string;
    attendeeCount: bigint;
    callerAccessStatus?: AccessStatus;
    owner: UserId;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    recurrence?: RecurrenceRule;
    coverImage?: ExternalBlob;
    updatedAt: Timestamp;
    visibility: Visibility;
    isOwner: boolean;
    location: string;
    eventDate: Timestamp;
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
export type MediaId = bigint;
export type FolderId = bigint;
export enum AccessStatus {
    revoked = "revoked",
    pending = "pending",
    denied = "denied",
    approved = "approved"
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
    createFolder(input: CreateFolderInput): Promise<FolderId>;
    createMoment(input: CreateMomentInput): Promise<MomentId>;
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
    deleteMoment(momentId: MomentId): Promise<void>;
    followUser(target: UserId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventPassInfo(momentId: MomentId, userId: UserId): Promise<{
        __kind__: "ok";
        ok: AttendanceInfo;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getFeedMoments(): Promise<Array<MomentListItem>>;
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
    getMomentsForUser(userId: UserId): Promise<Array<MomentListItem>>;
    getMyAttendanceInfo(momentId: MomentId): Promise<AttendanceInfo | null>;
    getMyCalendarMoments(rangeStart: Timestamp, rangeEnd: Timestamp): Promise<Array<MomentListItem>>;
    getMyMoments(): Promise<Array<MomentListItem>>;
    getUserProfile(userId: UserId): Promise<UserProfilePublic | null>;
    getUserProfileByUsername(username: string): Promise<UserProfilePublic | null>;
    hasLikedMedia(mediaId: MediaId): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFollowingUser(target: UserId): Promise<boolean>;
    isUsernameTaken(username: string): Promise<boolean>;
    listComments(mediaId: MediaId): Promise<Array<Comment>>;
    listFolders(momentId: MomentId): Promise<Array<Folder>>;
    listMedia(momentId: MomentId, offset: bigint, limit: bigint): Promise<MediaPage>;
    listMediaByFolder(folderId: FolderId, offset: bigint, limit: bigint): Promise<MediaPage>;
    listMomentAccessRequests(momentId: MomentId): Promise<Array<AccessRequest>>;
    postMemory(momentId: MomentId, content: string, mediaBlob: ExternalBlob | null, mediaKind: MemoryMediaKind | null): Promise<{
        __kind__: "ok";
        ok: MemoryId;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
    setRsvp(momentId: MomentId, status: RsvpStatus): Promise<void>;
    toggleLike(mediaId: MediaId): Promise<bigint>;
    unfollowUser(target: UserId): Promise<void>;
    updateMoment(momentId: MomentId, input: UpdateMomentInput): Promise<void>;
    uploadMedia(input: UploadMediaInput): Promise<MediaId>;
}
