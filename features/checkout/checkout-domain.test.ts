import { describe, expect, it } from 'vitest';

import { pricingBreakdown } from './checkout-domain';

describe('pricingBreakdown', () => {
    it('breaks the total down into its stored components', () => {
        expect(
            pricingBreakdown({
                nightlyRate: 25000,
                cleaningFee: 3500,
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
            }),
        ).toEqual({
            nights: 3,
            nightlySubtotal: 75000,
            cleaningFee: 3500,
            taxes: 0,
            total: 78500,
        });
    });

    it('returns 0s for an incomplete date range', () => {
        expect(
            pricingBreakdown({ nightlyRate: 25000, cleaningFee: 3500, checkIn: '', checkOut: '' }),
        ).toEqual({ nights: 0, nightlySubtotal: 0, cleaningFee: 3500, taxes: 0, total: 0 });
    });
});
