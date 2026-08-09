import { describe, expect, test } from 'vitest';

import { sanitizeRedirectPath, signInSchema, signUpSchema } from './auth-domain';

const VALID_SIGN_UP = {
    firstName: 'Jamie',
    lastName: 'Alder',
    email: 'jamie@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    acceptTerms: true,
};

describe('signUpSchema', () => {
    test('accepts a valid sign-up', () => {
        const result = signUpSchema.safeParse(VALID_SIGN_UP);

        expect(result.success).toBe(true);
    });

    test('rejects mismatched passwords', () => {
        const result = signUpSchema.safeParse({
            ...VALID_SIGN_UP,
            confirmPassword: 'different123',
        });

        expect(result.success).toBe(false);
        expect(
            !result.success &&
                result.error.issues.some((issue) => issue.path.includes('confirmPassword')),
        ).toBe(true);
    });

    test('rejects when terms are not accepted', () => {
        const result = signUpSchema.safeParse({ ...VALID_SIGN_UP, acceptTerms: false });

        expect(result.success).toBe(false);
        expect(
            !result.success &&
                result.error.issues.some((issue) => issue.path.includes('acceptTerms')),
        ).toBe(true);
    });

    test('rejects a password shorter than the minimum', () => {
        const result = signUpSchema.safeParse({
            ...VALID_SIGN_UP,
            password: 'short1',
            confirmPassword: 'short1',
        });

        expect(result.success).toBe(false);
    });

    test('rejects an invalid email', () => {
        const result = signUpSchema.safeParse({ ...VALID_SIGN_UP, email: 'not-an-email' });

        expect(result.success).toBe(false);
    });
});

describe('signInSchema', () => {
    test('accepts a valid sign-in', () => {
        const result = signInSchema.safeParse({ email: 'jamie@example.com', password: 'anything' });

        expect(result.success).toBe(true);
    });

    test('rejects an invalid email', () => {
        const result = signInSchema.safeParse({ email: 'not-an-email', password: 'anything' });

        expect(result.success).toBe(false);
    });

    test('rejects an empty password', () => {
        const result = signInSchema.safeParse({ email: 'jamie@example.com', password: '' });

        expect(result.success).toBe(false);
    });
});

describe('sanitizeRedirectPath', () => {
    test('returns the path when it is a same-origin relative path', () => {
        expect(sanitizeRedirectPath('/guest-area/bookings', '/guest-area')).toBe(
            '/guest-area/bookings',
        );
    });

    test('falls back when the path is missing', () => {
        expect(sanitizeRedirectPath(null, '/guest-area')).toBe('/guest-area');
    });

    test('falls back for a protocol-relative URL (open-redirect attempt)', () => {
        expect(sanitizeRedirectPath('//evil.com', '/guest-area')).toBe('/guest-area');
    });

    test('falls back for an absolute URL (open-redirect attempt)', () => {
        expect(sanitizeRedirectPath('https://evil.com', '/guest-area')).toBe('/guest-area');
    });

    test('falls back for a backslash-prefixed path (open-redirect attempt)', () => {
        // Browsers normalize \ to / when resolving a URL, so this is just as
        // much a protocol-relative absolute URL as `//evil.com` is.
        expect(sanitizeRedirectPath('/\\evil.com', '/guest-area')).toBe('/guest-area');
    });
});
