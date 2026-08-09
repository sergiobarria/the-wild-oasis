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
import { assertIntegerCents } from '../lib/money';
import { isBlockingStatus, PAYMENT_STATUS, RESERVATION_STATUS } from '../lib/reservations';
import { requireUser } from './auth';
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
