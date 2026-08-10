import { describe, expect, test } from 'vitest';

import { cabinFormSchema, slugify } from './cabin-form-domain';

function validValues() {
    return {
        name: 'Pine Ridge Cabin',
        slug: 'pine-ridge-cabin',
        shortDescription: 'A quiet cabin in the woods.',
        description: 'A longer description of a quiet cabin in the woods.',
        location: 'Pine Ridge',
        address: '',
        nightlyRate: '250',
        cleaningFee: '35',
        maxGuests: '4',
        bedrooms: '2',
        beds: '3',
        bathrooms: '1',
        amenityIds: [],
        published: true,
        featured: false,
    };
}

describe('cabinFormSchema', () => {
    test('accepts a fully valid submission', () => {
        expect(cabinFormSchema.safeParse(validValues()).success).toBe(true);
    });

    test('rejects a blank name', () => {
        expect(cabinFormSchema.safeParse({ ...validValues(), name: '  ' }).success).toBe(false);
    });

    test('rejects a slug with uppercase letters or spaces', () => {
        expect(cabinFormSchema.safeParse({ ...validValues(), slug: 'Pine Ridge' }).success).toBe(
            false,
        );
    });

    test('accepts a slug with hyphens and digits', () => {
        expect(cabinFormSchema.safeParse({ ...validValues(), slug: 'cabin-2' }).success).toBe(true);
    });

    test('rejects a non-numeric nightly rate', () => {
        expect(cabinFormSchema.safeParse({ ...validValues(), nightlyRate: 'abc' }).success).toBe(
            false,
        );
    });

    test('rejects a blank nightly rate', () => {
        expect(cabinFormSchema.safeParse({ ...validValues(), nightlyRate: '' }).success).toBe(
            false,
        );
    });
});

describe('slugify', () => {
    test('lowercases and hyphenates a name', () => {
        expect(slugify('Pine Ridge Cabin')).toBe('pine-ridge-cabin');
    });

    test('collapses non-alphanumeric runs into a single hyphen', () => {
        expect(slugify('  Pine   Ridge -- Cabin!! ')).toBe('pine-ridge-cabin');
    });

    test('trims leading and trailing hyphens', () => {
        expect(slugify('--Cabin--')).toBe('cabin');
    });
});
