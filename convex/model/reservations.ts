import { ConvexError } from 'convex/values';

import {
    type AvailabilityResult,
    checkAvailability as checkAvailabilityDomain,
    type ExistingReservationLike,
} from '../../features/availability/availability-domain';
import { todayIsoDate } from '../../lib/dates';
import { nightsBetween } from '../../lib/pricing';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { authComponent } from '../betterAuth/auth';
import { type CancellationDenialReason, canSelfCancel } from '../lib/cancellation';
import { assertIntegerCents } from '../lib/money';
import {
    isBlockingStatus,
    PAYMENT_STATUS,
    type PaymentStatus,
    RESERVATION_STATUS,
    type ReservationStatus,
} from '../lib/reservations';
import { requireAdmin, requireUser } from './auth';
import { isFeatureEnabled } from './featureFlags';

// Generous bound, same reasoning as cabins.ts's LISTING_RESULT_CAP -- never `.collect()`
// unbounded, `.take()` instead. A single cabin accumulating this many pending/confirmed
// reservations at once is far beyond this app's scale.
const BLOCKING_RESERVATIONS_CAP = 500;

// Derived from `isBlockingStatus` rather than hardcoded, so a future blocking status can't
// silently fall out of sync with the one query that actually fetches blocking reservations.
const BLOCKING_STATUSES = Object.values(RESERVATION_STATUS).filter(isBlockingStatus);

async function loadBlockingReservations(
    ctx: QueryCtx,
    cabinId: Id<'cabins'>,
): Promise<ExistingReservationLike[]> {
    const byStatus = await Promise.all(
        BLOCKING_STATUSES.map((status) =>
            ctx.db
                .query('reservations')
                .withIndex('by_cabinId_and_status', (q) =>
                    q.eq('cabinId', cabinId).eq('status', status),
                )
                .take(BLOCKING_RESERVATIONS_CAP),
        ),
    );

    return byStatus.flat().map((reservation) => ({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
    }));
}

/**
 * Shared by the public `checkAvailability` query and `createDemoReservation`'s pre-insert
 * re-check -- fetches the cabin once and runs the pure domain check against it, so a caller
 * that also needs the cabin doc (e.g. for pricing) doesn't have to fetch it a second time.
 */
async function resolveAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
): Promise<{ cabin: Doc<'cabins'>; result: AvailabilityResult }> {
    const [cabin, existingReservations] = await Promise.all([
        ctx.db.get(args.cabinId),
        loadBlockingReservations(ctx, args.cabinId),
    ]);

    // Same reasoning as cabins.ts's getBySlug: an unauthenticated public query must never leak
    // the existence or availability of a draft/unpublished cabin. One error for "missing" and
    // "unpublished" alike, so a caller can't distinguish the two.
    if (!cabin || !cabin.published) {
        throw new ConvexError(`Unknown cabin id "${args.cabinId}".`);
    }

    const result = checkAvailabilityDomain({
        range: { checkIn: args.checkIn, checkOut: args.checkOut },
        guests: args.guests,
        capacity: cabin.maxGuests,
        now: args.now,
        existingReservations,
    });

    return { cabin, result };
}

/**
 * Server-side, authoritative availability check (spec §32) -- backs the live client-side check
 * the booking panel calls on every date/guest change. `now` is supplied by the caller rather
 * than read here, so this stays safe to call from a `query` (never read `Date.now()` inside
 * one). `createDemoReservation`'s own pre-insert re-check derives its own `now` server-side
 * instead of trusting this argument -- a client-supplied `now` is only trustworthy for this
 * query's live-preview purpose, never for an authoritative check that must not be spoofable
 * into skipping a real overlap.
 */
export async function checkAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
) {
    const { result } = await resolveAvailability(ctx, args);
    return result;
}

/**
 * Creates a reservation via the demo (no-payment) path (spec §41). Every input is re-derived
 * or re-validated server-side -- the client's earlier live availability check and total are
 * never trusted, per docs/02_CODING_GUIDELINES.md §14.
 */
export async function createDemoReservation(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number },
) {
    const user = await requireUser(ctx);

    // WO-030's core requirement: the demo path is disabled server-side whenever Stripe is
    // enabled, not merely hidden behind a disabled button in the UI.
    if (await isFeatureEnabled(ctx, 'stripePaymentsEnabled')) {
        throw new ConvexError('Demo confirmation is unavailable while payments are enabled.');
    }

    const { cabin, result } = await resolveAvailability(ctx, {
        ...args,
        now: todayIsoDate(),
    });

    if (!result.available) {
        throw new ConvexError('These dates are no longer available.');
    }

    const nights = nightsBetween(args.checkIn, args.checkOut);
    const nightlySubtotal = cabin.nightlyRate * nights;
    const taxes = 0; // No tax engine exists yet (spec §4).
    const total = nightlySubtotal + cabin.cleaningFee + taxes;

    assertIntegerCents(nightlySubtotal, 'nightlySubtotal');
    assertIntegerCents(total, 'total');

    const timestamp = Date.now();

    const reservationId = await ctx.db.insert('reservations', {
        cabinId: args.cabinId,
        guestId: user._id,
        checkIn: args.checkIn,
        checkOut: args.checkOut,
        guests: args.guests,
        status: RESERVATION_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.NOT_REQUIRED,
        paymentRequired: false,
        pricing: { nightlySubtotal, cleaningFee: cabin.cleaningFee, taxes, total },
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    return { reservationId };
}

// Generous bound, same reasoning as BLOCKING_RESERVATIONS_CAP -- a guest's own booking
// history is small; `.take()` with a cap is simpler than pagination at this scale.
const OWN_RESERVATIONS_CAP = 200;

/**
 * All of a guest's own reservations (most recent first), for the guest dashboard's
 * Overview and Bookings screens (Phase 6). No server-side status/date filtering --
 * grouping into Upcoming/Past/Cancelled is a pure client-side concern (see
 * features/guest-area/reservations-grouping.ts), so this one query backs both screens
 * instead of near-duplicate queries.
 */
export async function listOwnReservations(ctx: QueryCtx) {
    const user = await requireUser(ctx);

    const reservations = await ctx.db
        .query('reservations')
        .withIndex('by_guestId', (q) => q.eq('guestId', user._id))
        .order('desc')
        .take(OWN_RESERVATIONS_CAP);

    // Resolve each distinct cabin once, not once per reservation -- a guest with several
    // stays at the same cabin would otherwise pay for the same doc + storage-url lookup
    // repeatedly.
    const uniqueCabinIds = [...new Set(reservations.map((reservation) => reservation.cabinId))];
    const cabinsById = new Map(
        await Promise.all(
            uniqueCabinIds.map(async (cabinId) => {
                const cabin = await ctx.db.get(cabinId);
                const coverImageUrl = cabin ? await ctx.storage.getUrl(cabin.coverImage) : null;
                return [cabinId, { cabin, coverImageUrl }] as const;
            }),
        ),
    );

    return reservations.map((reservation) => {
        const { cabin, coverImageUrl } = cabinsById.get(reservation.cabinId) ?? {
            cabin: null,
            coverImageUrl: null,
        };

        return {
            _id: reservation._id,
            cabinName: cabin?.name ?? 'Unknown cabin',
            cabinSlug: cabin?.slug ?? null,
            coverImageUrl,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            guests: reservation.guests,
            status: reservation.status,
            paymentStatus: reservation.paymentStatus,
            paymentRequired: reservation.paymentRequired,
            pricing: reservation.pricing,
            createdAt: reservation.createdAt,
        };
    });
}

/**
 * A guest's own reservation, for the checkout success page (spec §38) and later the guest
 * dashboard (Phase 6). Authorization is ownership, not just "signed in": `null` for a
 * reservation that exists but belongs to someone else, same as "doesn't exist" -- the caller
 * can't distinguish the two, so this never leaks another guest's booking.
 *
 * Takes the id as a plain string and normalizes it rather than validating as `v.id(...)` at the
 * boundary -- this is read from a URL query param (stale bookmark, manually edited, bot
 * crawler), so a malformed value is an expected "not found" case, not a 500.
 */
export async function getOwnReservation(ctx: QueryCtx, args: { reservationId: string }) {
    const user = await requireUser(ctx);
    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;

    if (!reservation || reservation.guestId !== user._id) return null;

    const cabin = await ctx.db.get(reservation.cabinId);

    return {
        _id: reservation._id,
        cabinName: cabin?.name ?? 'Unknown cabin',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        pricing: reservation.pricing,
        createdAt: reservation.createdAt,
    };
}

const CANCELLATION_DENIAL_MESSAGES: Record<CancellationDenialReason, string> = {
    'already-cancelled': 'This reservation has already been cancelled.',
    'not-upcoming': 'Only upcoming reservations can be cancelled.',
    'within-window': 'Cancellation is only available more than 48 hours before check-in.',
    'requires-admin': 'This reservation requires admin assistance to cancel.',
};

/**
 * Self-service cancellation (spec §47), gated by the guest's ownership and the 48h window
 * enforced in `canSelfCancel`. Patches `status` only -- never `paymentStatus`. Cancelling a
 * reservation and refunding a payment are explicitly distinct operations (spec §47); this
 * mutation only ever does the former. A future refund action would be a separate, its own
 * server-side operation, not a side effect of cancellation.
 */
export async function cancelReservation(ctx: MutationCtx, args: { reservationId: string }) {
    const user = await requireUser(ctx);
    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;

    if (!reservation || reservation.guestId !== user._id) {
        throw new ConvexError('Unknown reservation.');
    }

    const check = canSelfCancel({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
        paymentRequired: reservation.paymentRequired,
        now: new Date(Date.now()),
    });

    if (!check.allowed) {
        throw new ConvexError(CANCELLATION_DENIAL_MESSAGES[check.reason]);
    }

    await ctx.db.patch(reservation._id, {
        status: RESERVATION_STATUS.CANCELLED,
        updatedAt: Date.now(),
    });

    return null;
}

// Generous bound, same reasoning as cabins.ts's listFiltered -- not true infinite-scale
// pagination, a capped `.take()` narrowed in JS. Fine as long as the business's total
// reservation count stays under this; real cursor pagination is a follow-up if it doesn't.
const ADMIN_LISTING_RESULT_CAP = 500;

async function resolveGuestSummary(ctx: QueryCtx, guestId: string) {
    const user = await authComponent.getAnyUserById(ctx, guestId);
    return { name: user?.name ?? 'Unknown guest', email: user?.email ?? 'unknown' };
}

/**
 * All reservations across every guest, for the admin bookings table (spec §61/§75, WO-046).
 * Narrows by `cabinId`/`status` via the existing `by_cabinId_and_status` index when both are
 * supplied; otherwise reads the capped, most-recent-first set and filters the rest in JS --
 * guest name/email live in the Better Auth component, not this table, so free-text `search`
 * can never be pushed into a Convex index here.
 */
export async function adminListReservations(
    ctx: QueryCtx,
    args: {
        search?: string;
        status?: ReservationStatus;
        paymentStatus?: PaymentStatus;
        cabinId?: Id<'cabins'>;
        checkInFrom?: string;
        checkInTo?: string;
    },
) {
    await requireAdmin(ctx);

    const { cabinId, status } = args;

    const reservations =
        cabinId && status
            ? await ctx.db
                  .query('reservations')
                  .withIndex('by_cabinId_and_status', (q) =>
                      q.eq('cabinId', cabinId).eq('status', status),
                  )
                  .order('desc')
                  .take(ADMIN_LISTING_RESULT_CAP)
            : await ctx.db.query('reservations').order('desc').take(ADMIN_LISTING_RESULT_CAP);

    const uniqueCabinIds = [...new Set(reservations.map((reservation) => reservation.cabinId))];
    const cabinsById = new Map(
        await Promise.all(
            uniqueCabinIds.map(async (cabinId) => [cabinId, await ctx.db.get(cabinId)] as const),
        ),
    );

    const uniqueGuestIds = [...new Set(reservations.map((reservation) => reservation.guestId))];
    const guestsById = new Map(
        await Promise.all(
            uniqueGuestIds.map(
                async (guestId) => [guestId, await resolveGuestSummary(ctx, guestId)] as const,
            ),
        ),
    );

    const normalizedSearch = args.search?.trim().toLowerCase();

    const rows = reservations
        .filter((reservation) => !args.cabinId || reservation.cabinId === args.cabinId)
        .filter((reservation) => !args.status || reservation.status === args.status)
        .filter(
            (reservation) =>
                !args.paymentStatus || reservation.paymentStatus === args.paymentStatus,
        )
        .filter((reservation) => !args.checkInFrom || reservation.checkIn >= args.checkInFrom)
        .filter((reservation) => !args.checkInTo || reservation.checkIn <= args.checkInTo)
        .map((reservation) => {
            const cabin = cabinsById.get(reservation.cabinId) ?? null;
            const guest = guestsById.get(reservation.guestId) ?? {
                name: 'Unknown guest',
                email: 'unknown',
            };

            return {
                _id: reservation._id,
                cabinName: cabin?.name ?? 'Unknown cabin',
                guestName: guest.name,
                guestEmail: guest.email,
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                guests: reservation.guests,
                status: reservation.status,
                paymentStatus: reservation.paymentStatus,
                total: reservation.pricing.total,
                createdAt: reservation.createdAt,
            };
        })
        .filter((row) => {
            if (!normalizedSearch) return true;

            return (
                row.guestName.toLowerCase().includes(normalizedSearch) ||
                row.guestEmail.toLowerCase().includes(normalizedSearch) ||
                row._id.toLowerCase().includes(normalizedSearch)
            );
        });

    return rows;
}

/**
 * A single reservation for the admin booking detail view (WO-047) -- unlike
 * `getOwnReservation`, not ownership-scoped: any admin can view any reservation. `null`
 * for an unknown id (same normalize-then-get pattern as the guest-side query).
 */
export async function adminGetReservation(ctx: QueryCtx, args: { reservationId: string }) {
    await requireAdmin(ctx);

    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;
    if (!reservation) return null;

    const [cabin, guest] = await Promise.all([
        ctx.db.get(reservation.cabinId),
        resolveGuestSummary(ctx, reservation.guestId),
    ]);

    return {
        _id: reservation._id,
        cabinName: cabin?.name ?? 'Unknown cabin',
        guestName: guest.name,
        guestEmail: guest.email,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        paymentRequired: reservation.paymentRequired,
        pricing: reservation.pricing,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
    };
}

/**
 * Admin-initiated cancellation (WO-047) -- unlike the guest's `cancelReservation`, not gated
 * by ownership or the 48h window (an admin can cancel on a guest's behalf at any time). Same
 * discipline as the guest path regardless: patches `status` only, never `paymentStatus` --
 * cancelling isn't refunding, and no arbitrary post-payment financial edit belongs here.
 */
export async function adminCancelReservation(ctx: MutationCtx, args: { reservationId: string }) {
    await requireAdmin(ctx);

    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;
    if (!reservation) {
        throw new ConvexError('Unknown reservation.');
    }

    if (reservation.status === RESERVATION_STATUS.CANCELLED) {
        throw new ConvexError('This reservation has already been cancelled.');
    }

    await ctx.db.patch(reservation._id, {
        status: RESERVATION_STATUS.CANCELLED,
        updatedAt: Date.now(),
    });

    return null;
}
