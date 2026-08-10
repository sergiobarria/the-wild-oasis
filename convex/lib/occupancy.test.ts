import { describe, expect, test } from 'vitest';

import { calculateOccupancy, occupancyWindowStart } from './occupancy';

describe('occupancyWindowStart', () => {
    test('returns the date 30 days before "now"', () => {
        expect(occupancyWindowStart('2026-08-30')).toBe('2026-07-31');
    });

    test('handles a month/year boundary', () => {
        expect(occupancyWindowStart('2026-01-15')).toBe('2025-12-16');
    });
});

describe('calculateOccupancy', () => {
    test('returns zero occupancy with no reservations', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 4,
            reservations: [],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result).toEqual({
            bookedCabinNights: 0,
            availableCabinNights: 120,
            occupancyRate: 0,
        });
    });

    test('returns zero occupancy when there are no published cabins, without dividing by zero', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 0,
            reservations: [{ checkIn: '2026-08-05', checkOut: '2026-08-10' }],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result).toEqual({ bookedCabinNights: 5, availableCabinNights: 0, occupancyRate: 0 });
    });

    test('counts a reservation fully inside the window at its full length', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 1,
            reservations: [{ checkIn: '2026-08-05', checkOut: '2026-08-10' }],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result.bookedCabinNights).toBe(5);
        expect(result.occupancyRate).toBeCloseTo(5 / 30);
    });

    test('clips a reservation that starts before the window', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 1,
            reservations: [{ checkIn: '2026-07-28', checkOut: '2026-08-05' }],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result.bookedCabinNights).toBe(4);
    });

    test('clips a reservation that ends after the window', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 1,
            reservations: [{ checkIn: '2026-08-28', checkOut: '2026-09-05' }],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result.bookedCabinNights).toBe(3);
    });

    test('sums across multiple reservations and multiple cabins', () => {
        const result = calculateOccupancy({
            publishedCabinCount: 2,
            reservations: [
                { checkIn: '2026-08-05', checkOut: '2026-08-10' },
                { checkIn: '2026-08-15', checkOut: '2026-08-18' },
            ],
            windowStart: '2026-08-01',
            windowEnd: '2026-08-31',
        });

        expect(result.bookedCabinNights).toBe(8);
        expect(result.availableCabinNights).toBe(60);
    });
});
