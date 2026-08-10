import { describe, expect, test } from 'vitest';

import { newsletterSchema } from './newsletter-domain';

describe('newsletterSchema', () => {
    test('accepts a valid email', () => {
        expect(newsletterSchema.safeParse({ email: 'jamie@example.com' }).success).toBe(true);
    });

    test('rejects an invalid email', () => {
        expect(newsletterSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
    });

    test('rejects a blank email', () => {
        expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false);
    });
});
