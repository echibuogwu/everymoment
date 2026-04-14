/**
 * Patches the broken Visibility variant encoding/decoding in auto-generated backend.ts.
 *
 * ROOT CAUSE (two separate bugs):
 *
 * 1. ENCODER — to_candid_variant_n31 compares `value == Visibility.public` but
 *    the enum only has `public_` and `private_` keys, so both `Visibility.public`
 *    and `Visibility.private` are `undefined`. The codec falls through and returns
 *    the raw string "public"/"private" instead of the required Candid variant object.
 *
 * 2. DECODER — from_candid_variant_n21 returns `Visibility.public` / `Visibility.private`
 *    which are BOTH `undefined`. Every decoded moment has `visibility: undefined`,
 *    making it impossible to distinguish public from private at the display layer.
 *
 * FIX STRATEGY:
 * - Encoder: override createMoment / updateMoment on Backend.prototype and call the
 *   raw IDL actor directly with correct Candid variant objects {public:null} / {private:null}.
 * - Decoder: override each moment-returning method. Temporarily wrap the raw actor call
 *   to capture the Candid visibility value BEFORE the broken decoder runs, then
 *   overwrite visibility in the decoded result with the correct Visibility enum value.
 *   This is exactly one network call per method — no double-fetching.
 */
import { Backend, Visibility } from "../backend";
import type {
  CreateMomentInput,
  MomentDetail,
  MomentId,
  MomentListItem,
  UpdateMomentInput,
  UserId,
} from "../types";

/** Convert a Visibility enum value to the correct Candid wire format */
function encodeVisibility(v: Visibility): { public: null } | { private: null } {
  return v === Visibility.private_ ? { private: null } : { public: null };
}

/** Convert a raw Candid visibility variant to the correct Visibility enum value */
function decodeVisibility(
  raw: { public: null } | { private: null } | null | undefined,
): Visibility {
  if (raw && "private" in raw) return Visibility.private_;
  return Visibility.public_;
}

let _patched = false;

export function applyBackendPatches() {
  if (_patched) return;
  _patched = true;

  // ─── ENCODER PATCHES ────────────────────────────────────────────────────────

  const origCreate = Backend.prototype.createMoment;
  const origUpdate = Backend.prototype.updateMoment;

  Backend.prototype.createMoment = async function (
    input: CreateMomentInput,
  ): Promise<MomentId> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    const rawActor = self.actor;
    const uploadFile = self._uploadFile;

    if (!rawActor || !uploadFile) {
      return origCreate.call(this, input);
    }

    let coverImageCandid: [] | [Uint8Array] = [];
    if (input.coverImage) {
      const bytes = await uploadFile(input.coverImage);
      coverImageCandid = [bytes];
    }

    return rawActor.createMoment({
      title: input.title,
      tags: input.tags,
      description: input.description,
      coverImage: coverImageCandid,
      visibility: encodeVisibility(input.visibility),
      location: input.location,
      eventDate: input.eventDate,
      locationLat: input.locationLat !== undefined ? [input.locationLat] : [],
      locationLng: input.locationLng !== undefined ? [input.locationLng] : [],
    });
  };

  Backend.prototype.updateMoment = async function (
    momentId: MomentId,
    input: UpdateMomentInput,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    const rawActor = self.actor;
    const uploadFile = self._uploadFile;

    if (!rawActor || !uploadFile) {
      return origUpdate.call(this, momentId, input);
    }

    let coverImageCandid: [] | [Uint8Array] = [];
    if (input.coverImage) {
      const bytes = await uploadFile(input.coverImage);
      coverImageCandid = [bytes];
    }

    return rawActor.updateMoment(momentId, {
      title: input.title,
      tags: input.tags,
      description: input.description,
      coverImage: coverImageCandid,
      visibility: encodeVisibility(input.visibility),
      location: input.location,
      eventDate: input.eventDate,
      locationLat: input.locationLat !== undefined ? [input.locationLat] : [],
      locationLng: input.locationLng !== undefined ? [input.locationLng] : [],
    });
  };

  // ─── DECODER PATCHES ────────────────────────────────────────────────────────
  // Strategy: temporarily wrap the raw actor method to capture the Candid visibility
  // value before the broken decoder converts it to `undefined`. After the original
  // Backend method returns (decoded result), overwrite visibility with the captured value.

  const origGetMyMoments = Backend.prototype.getMyMoments;
  const origGetFeedMoments = Backend.prototype.getFeedMoments;
  const origGetMomentsForUser = Backend.prototype.getMomentsForUser;
  const origSearchMoments = Backend.prototype.searchMoments;
  const origAdminListMoments = Backend.prototype.adminListMoments;
  const origGetMomentDetail = Backend.prototype.getMomentDetail;

  /** Wrap a raw actor list method to capture visibility from each item */
  function withCapturedListVisibilities(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    self: any,
    methodName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origMethod: (...args: any[]) => Promise<MomentListItem[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
  ): Promise<MomentListItem[]> {
    const rawActor = self.actor;
    if (!rawActor) return origMethod.apply(self, args);

    // Capture raw Candid results indexed by id
    const capturedMap = new Map<string, { public: null } | { private: null }>();
    const originalRaw = rawActor[methodName];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawActor[methodName] = async (...rawArgs: any[]) => {
      const result = await originalRaw.apply(rawActor, rawArgs);
      // Raw result is an array of Candid-decoded MomentListItem objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Array.isArray(result)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const item of result as any[]) {
          if (item?.id !== undefined && item?.visibility !== undefined) {
            capturedMap.set(String(item.id), item.visibility);
          }
        }
      }
      return result;
    };

    const promise = origMethod.apply(self, args);
    rawActor[methodName] = originalRaw; // restore immediately after scheduling

    return promise.then((items: MomentListItem[]) =>
      items.map((item) => {
        const rawVis = capturedMap.get(String(item.id));
        return rawVis !== undefined
          ? { ...item, visibility: decodeVisibility(rawVis) }
          : item;
      }),
    );
  }

  Backend.prototype.getMyMoments = async function (): Promise<
    MomentListItem[]
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return withCapturedListVisibilities(
      this as any,
      "getMyMoments",
      origGetMyMoments,
      [],
    );
  };

  Backend.prototype.getFeedMoments = async function (): Promise<
    MomentListItem[]
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return withCapturedListVisibilities(
      this as any,
      "getFeedMoments",
      origGetFeedMoments,
      [],
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Backend.prototype.getMomentsForUser = async function (
    userId: UserId,
  ): Promise<MomentListItem[]> {
    return withCapturedListVisibilities(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this as any,
      "getMomentsForUser",
      origGetMomentsForUser,
      [userId],
    );
  };

  Backend.prototype.searchMoments = async function (
    searchText: string | null,
    tags: string[],
    offset: bigint,
    limit: bigint,
  ): Promise<MomentListItem[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return withCapturedListVisibilities(
      this as any,
      "searchMoments",
      origSearchMoments,
      [searchText, tags, offset, limit],
    );
  };

  Backend.prototype.adminListMoments = async function (): Promise<
    MomentListItem[]
  > {
    return withCapturedListVisibilities(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this as any,
      "adminListMoments",
      origAdminListMoments,
      [],
    );
  };

  Backend.prototype.getMomentDetail = async function (
    momentId: MomentId,
  ): Promise<MomentDetail | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    const rawActor = self.actor;
    if (!rawActor) return origGetMomentDetail.call(this, momentId);

    let capturedVisibility: { public: null } | { private: null } | null = null;
    const originalRaw = rawActor.getMomentDetail;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawActor.getMomentDetail = async (...args: any[]) => {
      const result = await originalRaw.apply(rawActor, args);
      // Raw result is [] | [RawMomentDetail]
      if (Array.isArray(result) && result.length > 0 && result[0]?.visibility) {
        capturedVisibility = result[0].visibility;
      }
      return result;
    };

    const decoded = await origGetMomentDetail.call(this, momentId);
    rawActor.getMomentDetail = originalRaw; // restore

    if (decoded && capturedVisibility !== null) {
      (decoded as MomentDetail).visibility =
        decodeVisibility(capturedVisibility);
    }
    return decoded;
  };
}
