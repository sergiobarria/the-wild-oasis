import { describe, expect, it } from 'vitest';

import { profileFormSchema } from './profile-domain';

describe('profileFormSchema', () => {
    const VALID = { firstName: 'Jamie', lastName: 'Alder', phone: '555-0100' };

    it('accepts a valid submission', () => {
        expect(profileFormSchema.safeParse(VALID).success).toBe(true);
    });

    it('accepts an empty phone -- that is what "no phone" looks like in this form', () => {
        expect(profileFormSchema.safeParse({ ...VALID, phone: '' }).success).toBe(true);
    });

    it('rejects a blank first name', () => {
        expect(profileFormSchema.safeParse({ ...VALID, firstName: '  ' }).success).toBe(false);
    });

    it('rejects a blank last name', () => {
        expect(profileFormSchema.safeParse({ ...VALID, lastName: '  ' }).success).toBe(false);
    });
});
