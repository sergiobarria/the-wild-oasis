import { describe, expect, it } from 'vitest';

import { availabilitySearchSchema } from './home-domain';

describe('availabilitySearchSchema', () => {
    it('accepts a check-out after check-in', () => {
        const result = availabilitySearchSchema.safeParse({
            checkIn: '2026-08-15',
            checkOut: '2026-08-18',
            guests: '2',
        });

        expect(result.success).toBe(true);
    });

    it('accepts blank dates', () => {
        const result = availabilitySearchSchema.safeParse({
            checkIn: '',
            checkOut: '',
            guests: '2',
        });

        expect(result.success).toBe(true);
    });

    it('rejects a check-out on or before check-in', () => {
        const result = availabilitySearchSchema.safeParse({
            checkIn: '2026-08-15',
            checkOut: '2026-08-15',
            guests: '2',
        });

        expect(result.success).toBe(false);
    });
});
