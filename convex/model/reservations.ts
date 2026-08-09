import { ConvexError } from 'convex/values';

import {
    checkAvailability as checkAvailabilityDomain,
    type ExistingReservationLike,
} from '../../features/availability/availability-domain';
import type { Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { isBlockingStatus, RESERVATION_STATUS } from '../lib/reservations';

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
 * Server-side, authoritative availability check (spec §32) -- backs both the live client-side
 * check the booking panel calls on every date/guest change, and the re-validation the demo
 * reservation mutation runs before ever inserting a row. `now` is supplied by the caller rather
 * than read here, so this stays safe to call from a `query` (never read `Date.now()` inside one).
 *
 * A future caller re-running this from inside a mutation (e.g. the demo reservation mutation,
 * WO-030) MUST derive its own `now` server-side (`Date.now()` is fine inside a mutation) rather
 * than forwarding whatever `now` the client originally sent -- a client-supplied `now` is only
 * trustworthy for this query's own live-preview purpose, never for the authoritative pre-insert
 * check, which must not be spoofable into skipping a real overlap.
 */
export async function checkAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
) {
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

    return checkAvailabilityDomain({
        range: { checkIn: args.checkIn, checkOut: args.checkOut },
        guests: args.guests,
        capacity: cabin.maxGuests,
        now: args.now,
        existingReservations,
    });
}
