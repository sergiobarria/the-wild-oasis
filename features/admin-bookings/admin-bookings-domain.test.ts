import { describe, expect, test } from 'vitest';

import { buildAdminBookingsQueryArgs, hasActiveAdminBookingFilters } from './admin-bookings-domain';

const EMPTY = {
    search: '',
    status: '',
    paymentStatus: '',
    cabinId: '',
    checkInFrom: '',
    checkInTo: '',
};

describe('hasActiveAdminBookingFilters', () => {
    test('returns false when every filter is empty', () => {
        expect(hasActiveAdminBookingFilters(EMPTY)).toBe(false);
    });

    test('returns true when any filter is set', () => {
        expect(hasActiveAdminBookingFilters({ ...EMPTY, search: 'jamie' })).toBe(true);
    });
});

describe('buildAdminBookingsQueryArgs', () => {
    test('converts every empty-string filter to undefined', () => {
        expect(buildAdminBookingsQueryArgs(EMPTY)).toEqual({
            search: undefined,
            status: undefined,
            paymentStatus: undefined,
            cabinId: undefined,
            checkInFrom: undefined,
            checkInTo: undefined,
        });
    });

    test('passes through set values', () => {
        expect(
            buildAdminBookingsQueryArgs({
                ...EMPTY,
                search: 'jamie',
                status: 'confirmed',
                paymentStatus: 'paid',
                cabinId: 'cabin-1',
                checkInFrom: '2026-08-01',
                checkInTo: '2026-08-31',
            }),
        ).toEqual({
            search: 'jamie',
            status: 'confirmed',
            paymentStatus: 'paid',
            cabinId: 'cabin-1',
            checkInFrom: '2026-08-01',
            checkInTo: '2026-08-31',
        });
    });
});
