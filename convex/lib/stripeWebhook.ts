export type StripeWebhookTransition = 'paid' | 'failed' | 'expired';

/**
 * Maps a Stripe event type to the reservation transition it should trigger (WO-059/WO-060).
 * Pure, framework-free -- no Stripe SDK types imported here, just the string discriminator
 * every `Stripe.Event` carries, so this is unit-testable without constructing a real event.
 * Any event type this app doesn't act on maps to `null` -- the webhook handler still returns
 * 200 for those, so Stripe doesn't retry an event it was never going to change anything for.
 */
export function resolveTransitionForEvent(eventType: string): StripeWebhookTransition | null {
    switch (eventType) {
        case 'checkout.session.completed':
            return 'paid';
        // Stripe's own ~24h Checkout Session expiry (spec §39's abandoned-checkout cleanup) --
        // no cron job needed, Stripe fires this automatically for an unpaid session.
        case 'checkout.session.expired':
            return 'expired';
        // This app's Checkout Sessions are single-attempt, so a failed payment has no in-place
        // retry to wait for -- cancel immediately rather than leaving the calendar slot held.
        case 'payment_intent.payment_failed':
            return 'failed';
        default:
            return null;
    }
}
