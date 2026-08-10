import { todayIsoDate } from '../../lib/dates';
import { nightsBetween } from '../../lib/pricing';

/** The admin home's KPI/chart reporting window (WO-044/WO-045) -- trailing N days ending
 *  "today," consistently applied to occupancy, bookings-over-time, and revenue-over-time. */
export const OCCUPANCY_WINDOW_DAYS = 30;

/** `now` is supplied by the caller (never read here) -- same discipline as
 *  `checkAvailability`'s `now` argument, so this stays safe to call from a `query`. */
export function occupancyWindowStart(now: string): string {
    const date = new Date(`${now}T00:00:00`);
    date.setDate(date.getDate() - OCCUPANCY_WINDOW_DAYS);
    return todayIsoDate(date);
}

export type OccupancyReservationLike = { checkIn: string; checkOut: string };

/**
 * Occupancy over a trailing window (WO-044): `bookedCabinNights` counts only the nights each
 * reservation's `[checkIn, checkOut)` range overlaps the window -- clipped, not the full stay
 * length, so a booking straddling the window boundary doesn't over-count. The caller is
 * responsible for pre-filtering `reservations` to whichever statuses should count toward
 * occupancy (this module stays status-agnostic and pure).
 */
export function calculateOccupancy(args: {
    publishedCabinCount: number;
    reservations: OccupancyReservationLike[];
    windowStart: string;
    windowEnd: string;
}): { bookedCabinNights: number; availableCabinNights: number; occupancyRate: number } {
    const windowDays = nightsBetween(args.windowStart, args.windowEnd);
    const availableCabinNights = args.publishedCabinCount * windowDays;

    const bookedCabinNights = args.reservations.reduce((sum, reservation) => {
        const clippedCheckIn =
            reservation.checkIn > args.windowStart ? reservation.checkIn : args.windowStart;
        const clippedCheckOut =
            reservation.checkOut < args.windowEnd ? reservation.checkOut : args.windowEnd;

        return sum + nightsBetween(clippedCheckIn, clippedCheckOut);
    }, 0);

    return {
        bookedCabinNights,
        availableCabinNights,
        occupancyRate: availableCabinNights === 0 ? 0 : bookedCabinNights / availableCabinNights,
    };
}
