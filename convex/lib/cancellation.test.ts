import { describe, expect, test } from 'vitest';

import { canSelfCancel } from './cancellation';

// Midnight local time, so "N days later" check-in dates land on exact N*24h boundaries --
// avoids fractional-day arithmetic when testing the 48h window's edge.
const NOW = new Date(2026, 7, 10, 0, 0, 0); // 2026-08-10T00:00:00 local

function baseArgs(overrides: Partial<Parameters<typeof canSelfCancel>[0]> = {}) {
    return {
        checkIn: '2026-08-15',
        checkOut: '2026-08-18',
        status: 'confirmed' as const,
        paymentRequired: false,
        now: NOW,
        ...overrides,
    };
}

describe('canSelfCancel', () => {
    test('allows cancellation well outside the window', () => {
        expect(canSelfCancel(baseArgs())).toEqual({ allowed: true });
    });

    test('rejects an already-cancelled reservation', () => {
        expect(canSelfCancel(baseArgs({ status: 'cancelled' }))).toEqual({
            allowed: false,
            reason: 'already-cancelled',
        });
    });

    test('rejects a reservation that is no longer upcoming', () => {
        expect(canSelfCancel(baseArgs({ checkIn: '2026-07-01', checkOut: '2026-07-05' }))).toEqual({
            allowed: false,
            reason: 'not-upcoming',
        });
    });

    test('rejects a reservation requiring admin intervention, even outside the window', () => {
        expect(canSelfCancel(baseArgs({ paymentRequired: true }))).toEqual({
            allowed: false,
            reason: 'requires-admin',
        });
    });

    test('rejects a reservation requiring admin intervention even when also within the window', () => {
        // Both problems apply -- requires-admin is checked first, so that's the reason.
        expect(
            canSelfCancel(
                baseArgs({ paymentRequired: true, checkIn: '2026-08-11', checkOut: '2026-08-13' }),
            ),
        ).toEqual({ allowed: false, reason: 'requires-admin' });
    });

    test('allows cancellation at exactly the 48-hour boundary (check-in two days out)', () => {
        expect(canSelfCancel(baseArgs({ checkIn: '2026-08-12', checkOut: '2099-01-01' }))).toEqual({
            allowed: true,
        });
    });

    test('rejects cancellation inside the 48-hour window (check-in one day out)', () => {
        expect(canSelfCancel(baseArgs({ checkIn: '2026-08-11', checkOut: '2099-01-01' }))).toEqual({
            allowed: false,
            reason: 'within-window',
        });
    });

    test('rejects cancellation for a check-in later today', () => {
        expect(canSelfCancel(baseArgs({ checkIn: '2026-08-10', checkOut: '2026-08-12' }))).toEqual({
            allowed: false,
            reason: 'within-window',
        });
    });
});
