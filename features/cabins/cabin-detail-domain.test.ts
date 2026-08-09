import { describe, expect, it } from 'vitest';

import { calculateTotalCents, nightsBetween } from './cabin-detail-domain';

describe('nightsBetween', () => {
    it('returns 0 when either date is blank', () => {
        expect(nightsBetween('', '2026-08-18')).toBe(0);
        expect(nightsBetween('2026-08-15', '')).toBe(0);
    });

    it('counts the nights between two dates', () => {
        expect(nightsBetween('2026-08-15', '2026-08-18')).toBe(3);
    });

    it('returns 0 for a same-day or reversed range', () => {
        expect(nightsBetween('2026-08-15', '2026-08-15')).toBe(0);
        expect(nightsBetween('2026-08-18', '2026-08-15')).toBe(0);
    });
});

describe('calculateTotalCents', () => {
    it('multiplies the nightly rate by nights and adds the cleaning fee', () => {
        expect(calculateTotalCents(25000, 3500, 3)).toBe(25000 * 3 + 3500);
    });

    it('returns 0 for 0 nights', () => {
        expect(calculateTotalCents(25000, 3500, 0)).toBe(0);
    });
});
