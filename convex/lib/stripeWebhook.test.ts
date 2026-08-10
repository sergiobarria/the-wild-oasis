import { describe, expect, test } from 'vitest';

import { resolveTransitionForEvent } from './stripeWebhook';

describe('resolveTransitionForEvent', () => {
    test('maps checkout.session.completed to paid', () => {
        expect(resolveTransitionForEvent('checkout.session.completed')).toBe('paid');
    });

    test('maps checkout.session.expired to expired', () => {
        expect(resolveTransitionForEvent('checkout.session.expired')).toBe('expired');
    });

    test('maps payment_intent.payment_failed to failed', () => {
        expect(resolveTransitionForEvent('payment_intent.payment_failed')).toBe('failed');
    });

    test('maps an event type this app does not act on to null', () => {
        expect(resolveTransitionForEvent('customer.created')).toBeNull();
    });
});
