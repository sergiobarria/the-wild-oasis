import { describe, expect, test } from 'vitest';

import { contactSchema } from './contact-domain';

const VALID_CONTACT = {
    name: 'Jamie Alder',
    email: 'jamie@example.com',
    phone: '',
    subject: 'Question about a cabin',
    message: 'Is the Hidden Creek cabin pet-friendly?',
};

describe('contactSchema', () => {
    test('accepts a valid submission', () => {
        expect(contactSchema.safeParse(VALID_CONTACT).success).toBe(true);
    });

    test('accepts a submission with no phone at all', () => {
        const withoutPhone: Partial<typeof VALID_CONTACT> = { ...VALID_CONTACT };
        delete withoutPhone.phone;

        expect(contactSchema.safeParse(withoutPhone).success).toBe(true);
    });

    test('rejects a blank name', () => {
        expect(contactSchema.safeParse({ ...VALID_CONTACT, name: '  ' }).success).toBe(false);
    });

    test('rejects an invalid email', () => {
        expect(contactSchema.safeParse({ ...VALID_CONTACT, email: 'not-an-email' }).success).toBe(
            false,
        );
    });

    test('rejects a blank subject', () => {
        expect(contactSchema.safeParse({ ...VALID_CONTACT, subject: '  ' }).success).toBe(false);
    });

    test('rejects a blank message', () => {
        expect(contactSchema.safeParse({ ...VALID_CONTACT, message: '  ' }).success).toBe(false);
    });

    test('rejects a message over the length cap', () => {
        expect(
            contactSchema.safeParse({ ...VALID_CONTACT, message: 'a'.repeat(5001) }).success,
        ).toBe(false);
    });

    test('accepts a message right at the length cap', () => {
        expect(
            contactSchema.safeParse({ ...VALID_CONTACT, message: 'a'.repeat(5000) }).success,
        ).toBe(true);
    });
});
