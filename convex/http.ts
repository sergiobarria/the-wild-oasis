import { httpRouter } from 'convex/server';
import Stripe from 'stripe';

import { internal } from './_generated/api';
import { env, httpAction } from './_generated/server';
import { authComponent, createAuth } from './betterAuth/auth';
import { resolveTransitionForEvent } from './lib/stripeWebhook';

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

/**
 * Stripe webhook receiver (WO-059, WO-060) -- the sole authoritative source for payment
 * confirmation (spec §37: a browser redirect back to /checkout/success is never proof of
 * payment). Reads the raw body (never `req.json()`, which would lose the exact byte
 * representation `constructEventAsync` needs to verify the signature) and delegates the
 * actual state transition to an internal mutation, since httpActions have no `ctx.db`.
 */
http.route({
    path: '/stripe/webhook',
    method: 'POST',
    handler: httpAction(async (ctx, req) => {
        const signature = req.headers.get('stripe-signature');
        const body = await req.text();

        if (!signature) {
            return new Response('Missing Stripe signature.', { status: 400 });
        }

        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            httpClient: Stripe.createFetchHttpClient(),
        });

        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                env.STRIPE_WEBHOOK_SECRET,
            );
        } catch {
            return new Response('Invalid Stripe signature.', { status: 400 });
        }

        const transition = resolveTransitionForEvent(event.type);
        if (!transition) {
            // An event type this app doesn't act on -- 200 so Stripe doesn't retry it forever.
            return new Response(null, { status: 200 });
        }

        // Both event types this app handles carry a Checkout Session (directly, or nested
        // under the PaymentIntent for `payment_intent.payment_failed`) -- narrow per event type
        // rather than one blanket cast, per convex/_generated/ai/guidelines.md's rule to treat
        // webhook payloads as unknown and narrow before use.
        let stripeCheckoutSessionId: string | undefined;
        let paymentIntentId: string | undefined;

        if (
            event.type === 'checkout.session.completed' ||
            event.type === 'checkout.session.expired'
        ) {
            const session = event.data.object;
            stripeCheckoutSessionId = session.id;
            paymentIntentId =
                typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : (session.payment_intent?.id ?? undefined);
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            paymentIntentId = paymentIntent.id;
            const sessions = await stripe.checkout.sessions.list({
                payment_intent: paymentIntent.id,
                limit: 1,
            });
            stripeCheckoutSessionId = sessions.data[0]?.id;
        }

        if (!stripeCheckoutSessionId) {
            // No matching Checkout Session to resolve -- nothing for this app to update.
            return new Response(null, { status: 200 });
        }

        await ctx.runMutation(internal.reservations.applyStripeWebhookTransition, {
            stripeCheckoutSessionId,
            paymentIntentId,
            transition,
        });

        return new Response(null, { status: 200 });
    }),
});

export default http;
