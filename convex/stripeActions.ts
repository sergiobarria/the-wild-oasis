import { v } from 'convex/values';
import Stripe from 'stripe';

import { checkoutCancelHref, checkoutSuccessHref } from '../lib/routes';
import { internal } from './_generated/api';
import { action, env } from './_generated/server';

function getStripeClient(): Stripe {
    return new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
}

/**
 * Creates a Stripe-hosted Checkout Session for a cabin reservation (WO-058, spec §36). Actions
 * have no `ctx.db`, so this delegates the actual reservation insert to an internal mutation
 * (`createPendingReservationForCheckout`) before ever calling Stripe, and a second internal
 * mutation afterward to attach the resulting session id. The `stripePaymentsEnabled` flag is
 * re-checked inside that first mutation, server-side -- never trust that the client only
 * reaches this action when the flag is genuinely on (spec §41).
 */
export const createStripeCheckoutSession = action({
    args: {
        cabinId: v.id('cabins'),
        checkIn: v.string(),
        checkOut: v.string(),
        guests: v.number(),
        cabinSlug: v.string(),
    },
    returns: v.object({ url: v.string() }),
    handler: async (ctx, args) => {
        const { reservationId, pricing } = await ctx.runMutation(
            internal.reservations.createPendingReservationForCheckout,
            {
                cabinId: args.cabinId,
                checkIn: args.checkIn,
                checkOut: args.checkOut,
                guests: args.guests,
            },
        );

        const stripe = getStripeClient();

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: pricing.total,
                        product_data: { name: 'Cabin reservation' },
                    },
                    quantity: 1,
                },
            ],
            client_reference_id: reservationId,
            metadata: { reservationId },
            success_url: `${env.SITE_URL}${checkoutSuccessHref(reservationId)}`,
            cancel_url: `${env.SITE_URL}${checkoutCancelHref(args.cabinSlug)}`,
        });

        if (!session.url) {
            throw new Error('Stripe did not return a Checkout Session URL.');
        }

        await ctx.runMutation(internal.reservations.attachStripeSessionId, {
            reservationId,
            stripeCheckoutSessionId: session.id,
        });

        return { url: session.url };
    },
});

/**
 * Refunds a paid reservation in full (admin-only, no partial refunds -- spec's explicit
 * non-goal). Authorization and validation happen first via an `internalQuery` (actions have no
 * `ctx.db`, so `requireAdmin` can't run directly here); only after that succeeds does this call
 * Stripe. Deliberately separate from `adminCancelReservation` -- cancelling and refunding are
 * distinct operations (spec §47), never merged into one mutation.
 */
export const adminRefundReservation = action({
    args: { reservationId: v.string() },
    returns: v.null(),
    handler: async (ctx, args) => {
        const { reservationId, stripePaymentIntentId } = await ctx.runQuery(
            internal.reservations.getReservationForRefund,
            { reservationId: args.reservationId },
        );

        const stripe = getStripeClient();
        await stripe.refunds.create({ payment_intent: stripePaymentIntentId });

        await ctx.runMutation(internal.reservations.markReservationRefunded, { reservationId });

        return null;
    },
});
