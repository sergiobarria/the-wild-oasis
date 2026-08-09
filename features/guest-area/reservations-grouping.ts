export type ReservationGroup = 'upcoming' | 'past' | 'cancelled';

type GroupableReservation = {
    checkIn: string;
    checkOut: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

/**
 * Nothing transitions a reservation's stored `status` from `confirmed` to `completed`
 * (no such job exists yet), so Upcoming/Past is derived from dates, not status.
 * `checkOut > today` (not `checkIn`): a currently-in-progress stay -- checked in, not
 * yet checked out -- is still "upcoming" from the guest's point of view, and matches the
 * half-open `[checkIn, checkOut)` convention already used for availability. `today` is
 * passed in rather than read internally, same discipline as `checkAvailability`'s `now`
 * argument, so this stays testable without mocking the clock.
 */
export function groupReservation(
    reservation: GroupableReservation,
    today: string,
): ReservationGroup {
    if (reservation.status === 'cancelled') return 'cancelled';

    return reservation.checkOut > today ? 'upcoming' : 'past';
}

/** The single soonest-`checkIn` upcoming reservation, for the Overview screen's
 *  "Upcoming Stay" card (spec §44: "if an upcoming reservation exists" implies at most
 *  one is featured). `undefined` if there is none. */
export function pickUpcomingReservation<T extends GroupableReservation>(
    reservations: T[],
    today: string,
): T | undefined {
    return reservations
        .filter((reservation) => groupReservation(reservation, today) === 'upcoming')
        .sort((a, b) => (a.checkIn < b.checkIn ? -1 : a.checkIn > b.checkIn ? 1 : 0))[0];
}
