import { describe, expect, it } from 'vitest';

import { formatNightlyRate } from './money';

describe('formatNightlyRate', () => {
    it('formats a round-dollar amount', () => {
        expect(formatNightlyRate(25000)).toBe('$250/night');
    });

    it('keeps cents when the amount is not a round dollar', () => {
        expect(formatNightlyRate(19999)).toBe('$199.99/night');
    });

    it('adds a thousands separator', () => {
        expect(formatNightlyRate(150000)).toBe('$1,500/night');
    });

    it('formats zero', () => {
        expect(formatNightlyRate(0)).toBe('$0/night');
    });
});
