import { describe, expect, test } from 'vitest';

import { assertIntegerCents } from './money';

describe('assertIntegerCents', () => {
    test('accepts a non-negative integer', () => {
        expect(() => assertIntegerCents(0, 'nightlyRate')).not.toThrow();
        expect(() => assertIntegerCents(25000, 'nightlyRate')).not.toThrow();
    });

    test('rejects a non-integer value', () => {
        expect(() => assertIntegerCents(250.5, 'nightlyRate')).toThrow(
            'nightlyRate must be a non-negative integer number of cents, got 250.5.',
        );
    });

    test('rejects a negative value', () => {
        expect(() => assertIntegerCents(-100, 'nightlyRate')).toThrow(
            'nightlyRate must be a non-negative integer number of cents, got -100.',
        );
    });
});
