import { describe, expect, it } from 'vitest';

import { checkAvailability, type ExistingReservationLike } from './availability-domain';

const NOW = '2026-08-10';
const CAPACITY = 4;

function baseInput(overrides: Partial<Parameters<typeof checkAvailability>[0]> = {}) {
    return {
        range: { checkIn: '2026-08-15', checkOut: '2026-08-18' },
        guests: 2,
        capacity: CAPACITY,
        now: NOW,
        existingReservations: [] as ExistingReservationLike[],
        ...overrides,
    };
}

describe('checkAvailability', () => {
    it('is available for a valid range with no conflicts', () => {
        expect(checkAvailability(baseInput())).toEqual({ available: true });
    });

    it('rejects a zero-night range', () => {
        const result = checkAvailability(
            baseInput({ range: { checkIn: '2026-08-15', checkOut: '2026-08-15' } }),
        );
        expect(result).toEqual({ available: false, violations: [{ code: 'INVALID_RANGE' }] });
    });

    it('rejects a reversed range', () => {
        const result = checkAvailability(
            baseInput({ range: { checkIn: '2026-08-18', checkOut: '2026-08-15' } }),
        );
        expect(result).toEqual({ available: false, violations: [{ code: 'INVALID_RANGE' }] });
    });

    it('allows a check-in of today', () => {
        const result = checkAvailability(
            baseInput({ range: { checkIn: NOW, checkOut: '2026-08-12' } }),
        );
        expect(result).toEqual({ available: true });
    });

    it('rejects a check-in in the past', () => {
        const result = checkAvailability(
            baseInput({ range: { checkIn: '2026-08-09', checkOut: '2026-08-12' } }),
        );
        expect(result).toEqual({ available: false, violations: [{ code: 'PAST_CHECK_IN' }] });
    });

    it('allows guests equal to capacity', () => {
        expect(checkAvailability(baseInput({ guests: CAPACITY }))).toEqual({ available: true });
    });

    it('rejects guests exceeding capacity', () => {
        const result = checkAvailability(baseInput({ guests: CAPACITY + 1 }));
        expect(result).toEqual({
            available: false,
            violations: [{ code: 'GUESTS_EXCEED_CAPACITY' }],
        });
    });

    it('rejects a guest count below 1', () => {
        const result = checkAvailability(baseInput({ guests: 0 }));
        expect(result).toEqual({
            available: false,
            violations: [{ code: 'INVALID_GUEST_COUNT' }],
        });
    });

    it('returns every applicable violation together', () => {
        const result = checkAvailability(
            baseInput({
                range: { checkIn: '2026-08-09', checkOut: '2026-08-09' },
                guests: CAPACITY + 1,
            }),
        );
        expect(result).toEqual({
            available: false,
            violations: [
                { code: 'INVALID_RANGE' },
                { code: 'PAST_CHECK_IN' },
                { code: 'GUESTS_EXCEED_CAPACITY' },
            ],
        });
    });

    describe('overlap against existing reservations', () => {
        const blocking: ExistingReservationLike = {
            checkIn: '2026-08-16',
            checkOut: '2026-08-20',
            status: 'confirmed',
        };

        it('blocks a range that overlaps a confirmed reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-15', checkOut: '2026-08-18' },
                    existingReservations: [blocking],
                }),
            );
            expect(result).toEqual({
                available: false,
                violations: [{ code: 'DATE_UNAVAILABLE' }],
            });
        });

        it('blocks a range that overlaps a pending reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-17', checkOut: '2026-08-19' },
                    existingReservations: [{ ...blocking, status: 'pending' }],
                }),
            );
            expect(result.available).toBe(false);
        });

        it('allows same-day turnover: new check-in equal to existing check-out', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-20', checkOut: '2026-08-22' },
                    existingReservations: [blocking],
                }),
            );
            expect(result).toEqual({ available: true });
        });

        it('allows same-day turnover: new check-out equal to existing check-in', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-14', checkOut: '2026-08-16' },
                    existingReservations: [blocking],
                }),
            );
            expect(result).toEqual({ available: true });
        });

        it('blocks a range fully contained within an existing reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-17', checkOut: '2026-08-18' },
                    existingReservations: [blocking],
                }),
            );
            expect(result.available).toBe(false);
        });

        it('blocks a range that fully contains an existing reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-14', checkOut: '2026-08-22' },
                    existingReservations: [blocking],
                }),
            );
            expect(result.available).toBe(false);
        });

        it('never blocks on a cancelled reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-16', checkOut: '2026-08-18' },
                    existingReservations: [{ ...blocking, status: 'cancelled' }],
                }),
            );
            expect(result).toEqual({ available: true });
        });

        it('never blocks on a completed reservation', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-16', checkOut: '2026-08-18' },
                    existingReservations: [{ ...blocking, status: 'completed' }],
                }),
            );
            expect(result).toEqual({ available: true });
        });

        it('never blocks on a confirmed reservation whose check-out has already elapsed', () => {
            const elapsed: ExistingReservationLike = {
                checkIn: '2025-08-16',
                checkOut: '2025-08-20',
                status: 'confirmed',
            };
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-16', checkOut: '2026-08-18' },
                    existingReservations: [elapsed],
                }),
            );
            expect(result).toEqual({ available: true });
        });
    });

    describe('availability blocks', () => {
        it('defaults to an empty blocks array', () => {
            expect(checkAvailability(baseInput())).toEqual({ available: true });
        });

        it('blocks a range that overlaps an availability block', () => {
            const result = checkAvailability(
                baseInput({
                    range: { checkIn: '2026-08-15', checkOut: '2026-08-18' },
                    blocks: [{ checkIn: '2026-08-16', checkOut: '2026-08-17' }],
                }),
            );
            expect(result.available).toBe(false);
        });
    });
});
