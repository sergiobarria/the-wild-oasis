import { describe, expect, test } from 'vitest';

import { initials, parseRoleParam } from './admin-users-domain';

describe('parseRoleParam', () => {
    test('accepts a known role', () => {
        expect(parseRoleParam('admin')).toBe('admin');
        expect(parseRoleParam('guest')).toBe('guest');
    });

    test('falls back to undefined for an unknown value', () => {
        expect(parseRoleParam('superadmin')).toBeUndefined();
    });

    test('falls back to undefined for an empty string', () => {
        expect(parseRoleParam('')).toBeUndefined();
    });
});

describe('initials', () => {
    test('takes the first letter of the first two words', () => {
        expect(initials('Jamie Alder')).toBe('JA');
    });

    test('handles a single-word name', () => {
        expect(initials('Cher')).toBe('C');
    });

    test('ignores extra words beyond the first two', () => {
        expect(initials('Mary Jane Watson')).toBe('MJ');
    });
});
