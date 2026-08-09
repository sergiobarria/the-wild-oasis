/**
 * Pure, framework-free availability logic (spec §32). Deliberately typed against generic
 * date-range shapes rather than Convex documents -- this module predates and outlives the
 * `reservations` table (Phase 5) and the `availabilityBlocks` table (Phase 8), so callers on
 * both sides (client-side live UI feedback, server-side authoritative check) adapt their real
 * data into these shapes rather than this module depending on either.
 *
 * Dates are ISO `YYYY-MM-DD` calendar-day strings throughout, never `Date`/timestamps -- a
 * calendar day isn't an instant, and lexicographic string comparison is exact for this format.
 * Ranges are half-open `[checkIn, checkOut)`: a checkout on day X and a new check-in on day X
 * is same-day turnover, not an overlap.
 */

export type DateRange = { checkIn: string; checkOut: string };

/** The only reservation statuses that can occupy a cabin's calendar. Duplicated (not imported)
 *  from `convex/lib/reservations.ts`'s `RESERVATION_STATUS` by design -- see that module's test
 *  for the assertion keeping the two in sync. */
export const BLOCKING_RESERVATION_STATUSES = ['pending', 'confirmed'] as const;

export type ExistingReservationLike = DateRange & {
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

/** Shape-compatible stand-in for Phase 8's `availabilityBlocks` rows. Phase 5 callers always
 *  pass an empty array; Phase 8 wires real rows in without changing this module's signature. */
export type AvailabilityBlockLike = DateRange;

/** The full set of violation codes, as a runtime array -- lets a Convex return validator derive
 *  its `v.union(v.literal(...))` from this instead of hand-duplicating the list, so a new code
 *  added here can't silently drift out of sync with what a public query is allowed to return. */
export const AVAILABILITY_VIOLATION_CODES = [
    'INVALID_RANGE',
    'PAST_CHECK_IN',
    'INVALID_GUEST_COUNT',
    'GUESTS_EXCEED_CAPACITY',
    'DATE_UNAVAILABLE',
] as const;

export type AvailabilityViolation = { code: (typeof AVAILABILITY_VIOLATION_CODES)[number] };

export type AvailabilityResult =
    { available: true } | { available: false; violations: AvailabilityViolation[] };

function rangesOverlap(a: DateRange, b: DateRange): boolean {
    return a.checkIn < b.checkOut && b.checkIn < a.checkOut;
}

/** A blocking-status reservation that hasn't fully elapsed yet -- a confirmed stay whose
 *  check-out is in the past never blocks new bookings, even with no completed-transition job. */
function isActiveBlock(reservation: ExistingReservationLike, now: string): boolean {
    return (
        (BLOCKING_RESERVATION_STATUSES as readonly string[]).includes(reservation.status) &&
        reservation.checkOut > now
    );
}

export function checkAvailability(input: {
    range: DateRange;
    guests: number;
    capacity: number;
    now: string;
    existingReservations: ExistingReservationLike[];
    blocks?: AvailabilityBlockLike[];
}): AvailabilityResult {
    const { range, guests, capacity, now, existingReservations, blocks = [] } = input;
    const violations: AvailabilityViolation[] = [];

    if (range.checkOut <= range.checkIn) {
        violations.push({ code: 'INVALID_RANGE' });
    }

    if (range.checkIn < now) {
        violations.push({ code: 'PAST_CHECK_IN' });
    }

    if (guests < 1) {
        violations.push({ code: 'INVALID_GUEST_COUNT' });
    } else if (guests > capacity) {
        violations.push({ code: 'GUESTS_EXCEED_CAPACITY' });
    }

    const blockingRanges: DateRange[] = [
        ...existingReservations.filter((reservation) => isActiveBlock(reservation, now)),
        ...blocks,
    ];

    if (blockingRanges.some((blocked) => rangesOverlap(range, blocked))) {
        violations.push({ code: 'DATE_UNAVAILABLE' });
    }

    if (violations.length > 0) return { available: false, violations };

    return { available: true };
}
