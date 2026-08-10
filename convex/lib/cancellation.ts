import { groupReservation } from '../../features/guest-area/reservations-grouping';
import { todayIsoDate } from '../../lib/dates';
import type { ReservationStatus } from './reservations';

/** WO-038's original default, per spec §47's example -- WO-057 promotes the *live* value to
 *  the admin-configurable `appSettings.cancellationWindowHours` (see convex/model/appSettings.ts),
 *  but this constant remains the fallback default and what existing tests exercise. */
export const CANCELLATION_WINDOW_HOURS = 48;

export type CancellationDenialReason =
    'already-cancelled' | 'not-upcoming' | 'within-window' | 'requires-admin';

export type CancellationCheck =
    { allowed: true } | { allowed: false; reason: CancellationDenialReason };

/**
 * Pure, framework-free (no Convex imports) -- unit-testable in isolation, same discipline
 * as `features/availability/availability-domain.ts`. `now` is supplied by the caller, never
 * read internally, so a mutation can pass its own server-derived `Date.now()`.
 *
 * Check order matters: an already-cancelled or no-longer-upcoming reservation is rejected
 * before the payment/window checks even run, since those checks are meaningless once a
 * reservation isn't a live, future stay.
 */
export function canSelfCancel(args: {
    checkIn: string;
    checkOut: string;
    status: ReservationStatus;
    paymentRequired: boolean;
    now: Date;
    /** Defaults to the hardcoded constant so existing callers/tests are unaffected --
     *  WO-057's admin settings screen passes the live, admin-configured value instead. */
    windowHours?: number;
}): CancellationCheck {
    if (args.status === 'cancelled') return { allowed: false, reason: 'already-cancelled' };

    const today = todayIsoDate(args.now);
    const group = groupReservation(
        { checkIn: args.checkIn, checkOut: args.checkOut, status: args.status },
        today,
    );
    if (group !== 'upcoming') return { allowed: false, reason: 'not-upcoming' };

    // Spec §47: paid reservations need admin intervention -- no self-cancel path at all,
    // not even outside the window. Checked before the window so the message is accurate.
    if (args.paymentRequired) return { allowed: false, reason: 'requires-admin' };

    // `checkIn` is a date-only string with no time component. Treat check-in as occurring
    // at local midnight (00:00) of that date -- the most conservative reading available: it
    // starts the countdown as early as possible, so a guest is never surprised by a cutoff
    // later than expected. `>=` (not `>`) so exactly-48h-out is still cancellable, favoring
    // the guest at the boundary.
    const checkInInstant = new Date(`${args.checkIn}T00:00:00`);
    const windowMs = (args.windowHours ?? CANCELLATION_WINDOW_HOURS) * 60 * 60 * 1000;

    if (checkInInstant.getTime() - args.now.getTime() < windowMs) {
        return { allowed: false, reason: 'within-window' };
    }

    return { allowed: true };
}
