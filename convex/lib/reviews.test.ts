import { describe, expect, test } from 'vitest';

import { assertValidRating } from './reviews';

describe('assertValidRating', () => {
    test('accepts an integer between 1 and 5', () => {
        expect(() => assertValidRating(1)).not.toThrow();
        expect(() => assertValidRating(5)).not.toThrow();
    });

    test('rejects a non-integer value', () => {
        expect(() => assertValidRating(4.5)).toThrow(
            'rating must be an integer between 1 and 5, got 4.5.',
        );
    });

    test('rejects a value below the valid range', () => {
        expect(() => assertValidRating(0)).toThrow(
            'rating must be an integer between 1 and 5, got 0.',
        );
    });

    test('rejects a value above the valid range', () => {
        expect(() => assertValidRating(6)).toThrow(
            'rating must be an integer between 1 and 5, got 6.',
        );
    });
});
