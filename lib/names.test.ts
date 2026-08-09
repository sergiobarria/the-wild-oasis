import { describe, expect, it } from 'vitest';

import { joinName, splitName } from './names';

describe('splitName', () => {
    it('splits a two-word name into first and last', () => {
        expect(splitName('Jamie Alder')).toEqual({ firstName: 'Jamie', lastName: 'Alder' });
    });

    it('treats a single-word name as first name only', () => {
        expect(splitName('Cher')).toEqual({ firstName: 'Cher', lastName: '' });
    });

    it('keeps every word after the first as the last name', () => {
        expect(splitName('Mary Jane Watson')).toEqual({
            firstName: 'Mary',
            lastName: 'Jane Watson',
        });
    });

    it('handles an empty name', () => {
        expect(splitName('')).toEqual({ firstName: '', lastName: '' });
    });

    it('collapses extra internal whitespace', () => {
        expect(splitName('  Jamie   Alder  ')).toEqual({ firstName: 'Jamie', lastName: 'Alder' });
    });
});

describe('joinName', () => {
    it('joins first and last name with a single space', () => {
        expect(joinName('Jamie', 'Alder')).toBe('Jamie Alder');
    });

    it('trims each part before joining', () => {
        expect(joinName(' Jamie ', ' Alder ')).toBe('Jamie Alder');
    });

    it('omits a blank last name rather than leaving a trailing space', () => {
        expect(joinName('Cher', '')).toBe('Cher');
    });

    it('round-trips through splitName for a simple two-word name', () => {
        const { firstName, lastName } = splitName('Jamie Alder');
        expect(joinName(firstName, lastName)).toBe('Jamie Alder');
    });
});
