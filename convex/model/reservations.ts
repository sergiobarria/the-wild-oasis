import { ConvexError } from 'convex/values';

import {
    checkAvailability as checkAvailabilityDomain,
    type ExistingReservationLike,
} from '../../features/availability/availability-domain';
import type { Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { RESERVATION_STATUS } from '../lib/reservations';

// Generous bound, same reasoning as cabins.ts's LISTING_RESULT_CAP -- never `.collect()`
// unbounded, `.take()` instead. A single cabin accumulating this many pending/confirmed
// reservations at once is far beyond this app's scale.
const BLOCKING_RESERVATIONS_CAP = 500;

async function loadBlockingReservations(
    ctx: QueryCtx,
    cabinId: Id<'cabins'>,
): Promise<ExistingReservationLike[]> {
    const [pending, confirmed] = await Promise.all([
        ctx.db
            .query('reservations')
            .withIndex('by_cabinId_and_status', (q) =>
                q.eq('cabinId', cabinId).eq('status', RESERVATION_STATUS.PENDING),
            )
            .take(BLOCKING_RESERVATIONS_CAP),
        ctx.db
            .query('reservations')
            .withIndex('by_cabinId_and_status', (q) =>
                q.eq('cabinId', cabinId).eq('status', RESERVATION_STATUS.CONFIRMED),
            )
            .take(BLOCKING_RESERVATIONS_CAP),
    ]);

    return [...pending, ...confirmed].map((reservation) => ({
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
 */
export async function checkAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
) {
    const cabin = await ctx.db.get(args.cabinId);
    if (!cabin) throw new ConvexError(`Unknown cabin id "${args.cabinId}".`);

    const existingReservations = await loadBlockingReservations(ctx, args.cabinId);

    return checkAvailabilityDomain({
        range: { checkIn: args.checkIn, checkOut: args.checkOut },
        guests: args.guests,
        capacity: cabin.maxGuests,
        now: args.now,
        existingReservations,
    });
}
