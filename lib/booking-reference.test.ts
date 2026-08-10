import { describe, expect, test } from 'vitest';

import { formatBookingReference } from './booking-reference';

describe('formatBookingReference', () => {
    test('formats the last 8 characters of the id as an uppercase, dashed code', () => {
        expect(formatBookingReference('jh78djbk8dxmw21kd2vhp6r7t18c6ag0')).toBe('WO-T18C-6AG0');
    });

    test('is deterministic for the same id', () => {
        const id = 'jh78djbk8dxmw21kd2vhp6r7t18c6ag0';
        expect(formatBookingReference(id)).toBe(formatBookingReference(id));
    });

    test('differs for different ids', () => {
        expect(formatBookingReference('jh78djbk8dxmw21kd2vhp6r7t18c6ag0')).not.toBe(
            formatBookingReference('jh7b1634dn7a0exjat19k3n7m58c4brj'),
        );
    });
});
