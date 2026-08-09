import { describe, expect, it } from 'vitest';

import { guestOptionsFor } from './guest-options';

describe('guestOptionsFor', () => {
    it('returns the presets unchanged when maxGuests matches one exactly', () => {
        expect(guestOptionsFor(8)).toEqual(['1', '2', '4', '6', '8']);
    });

    it('includes maxGuests itself when it falls between presets', () => {
        expect(guestOptionsFor(5)).toEqual(['1', '2', '4', '5']);
    });

    it('includes maxGuests itself when it exceeds every preset', () => {
        expect(guestOptionsFor(10)).toEqual(['1', '2', '4', '6', '8', '10']);
    });

    it('handles a capacity of 1', () => {
        expect(guestOptionsFor(1)).toEqual(['1']);
    });
});
