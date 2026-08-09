import { describe, expect, it } from 'vitest';

import { cabinsSearchHref, checkoutSummaryHref } from './routes';

describe('cabinsSearchHref', () => {
    it('builds a query string from all three params', () => {
        expect(
            cabinsSearchHref({ checkIn: '2026-08-15', checkOut: '2026-08-18', guests: '2' }),
        ).toBe('/cabins?checkIn=2026-08-15&checkOut=2026-08-18&guests=2');
    });

    it('omits params that are not provided', () => {
        expect(cabinsSearchHref({ guests: '4' })).toBe('/cabins?guests=4');
    });

    it('returns the bare cabins route when no params are provided', () => {
        expect(cabinsSearchHref({})).toBe('/cabins');
    });
});

describe('checkoutSummaryHref', () => {
    it('builds a query string from every required param', () => {
        expect(
            checkoutSummaryHref({
                cabinId: 'cabin-1',
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
                guests: '2',
            }),
        ).toBe('/checkout/summary?cabinId=cabin-1&checkIn=2026-08-15&checkOut=2026-08-18&guests=2');
    });
});
