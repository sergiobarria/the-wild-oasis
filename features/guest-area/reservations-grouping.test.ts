import { describe, expect, it } from 'vitest';

import { groupReservation, pickUpcomingReservation } from './reservations-grouping';

const TODAY = '2026-08-10';

function reservation(
    overrides: Partial<{
        checkIn: string;
        checkOut: string;
        status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    }> = {},
) {
    return {
        checkIn: '2026-08-15',
        checkOut: '2026-08-18',
        status: 'confirmed' as const,
        ...overrides,
    };
}

describe('groupReservation', () => {
    it('groups a future reservation as upcoming', () => {
        expect(groupReservation(reservation(), TODAY)).toBe('upcoming');
    });

    it('groups a reservation whose checkout has already passed as past', () => {
        expect(
            groupReservation(reservation({ checkIn: '2026-08-01', checkOut: '2026-08-05' }), TODAY),
        ).toBe('past');
    });

    it('treats checkout today as already past (half-open convention)', () => {
        expect(
            groupReservation(reservation({ checkIn: '2026-08-08', checkOut: TODAY }), TODAY),
        ).toBe('past');
    });

    it('groups a currently-in-progress stay (checked in, not yet out) as upcoming', () => {
        expect(
            groupReservation(reservation({ checkIn: '2026-08-08', checkOut: '2026-08-12' }), TODAY),
        ).toBe('upcoming');
    });

    it('groups a cancelled reservation as cancelled regardless of dates', () => {
        expect(groupReservation(reservation({ status: 'cancelled' }), TODAY)).toBe('cancelled');
        expect(
            groupReservation(
                reservation({ status: 'cancelled', checkIn: '2026-08-01', checkOut: '2026-08-05' }),
                TODAY,
            ),
        ).toBe('cancelled');
    });
});

describe('pickUpcomingReservation', () => {
    it('returns undefined for an empty list', () => {
        expect(pickUpcomingReservation([], TODAY)).toBeUndefined();
    });

    it('returns undefined when nothing is upcoming', () => {
        const reservations = [
            reservation({ checkIn: '2026-08-01', checkOut: '2026-08-05' }),
            reservation({ status: 'cancelled' }),
        ];
        expect(pickUpcomingReservation(reservations, TODAY)).toBeUndefined();
    });

    it('picks the soonest of multiple upcoming reservations', () => {
        const soonest = reservation({ checkIn: '2026-08-12', checkOut: '2026-08-14' });
        const later = reservation({ checkIn: '2026-09-01', checkOut: '2026-09-05' });

        expect(pickUpcomingReservation([later, soonest], TODAY)).toBe(soonest);
    });

    it('ignores past and cancelled reservations when picking', () => {
        const upcoming = reservation({ checkIn: '2026-08-20', checkOut: '2026-08-22' });
        const past = reservation({ checkIn: '2026-07-01', checkOut: '2026-07-05' });
        const cancelled = reservation({
            status: 'cancelled',
            checkIn: '2026-08-11',
            checkOut: '2026-08-13',
        });

        expect(pickUpcomingReservation([past, cancelled, upcoming], TODAY)).toBe(upcoming);
    });
});
