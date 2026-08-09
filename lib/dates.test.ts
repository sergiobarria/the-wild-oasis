import { describe, expect, it } from 'vitest';

import { todayIsoDate } from './dates';

describe('todayIsoDate', () => {
    it('formats the local calendar date, not the UTC date', () => {
        // Local midday, unambiguous in every timezone.
        expect(todayIsoDate(new Date(2026, 7, 9, 12, 0, 0))).toBe('2026-08-09');
    });

    it('pads single-digit months and days', () => {
        expect(todayIsoDate(new Date(2026, 0, 5, 12, 0, 0))).toBe('2026-01-05');
    });
});
