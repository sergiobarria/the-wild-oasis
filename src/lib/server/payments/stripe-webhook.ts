import type Stripe from 'stripe';

import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { BOOKING_STATUS } from '$lib/config/booking';
import { PAYMENT_STATUS } from '$lib/config/payments';
import { db } from '$lib/server/db';
import { bookings } from '$lib/server/db/schemas/bookings';

import { stripe } from './stripe';

export const handleStripeWebhook = async () => {
	const reqEvent = getRequestEvent();
	const sig = reqEvent.request.headers.get('stripe-signature');
	const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

	if (!sig) throw new Error('Missing stripe-signature header');

	const body = await reqEvent.request.text();

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err: unknown) {
		console.error('Error constructing Stripe event:', err);
		throw new Error('Invalid Stripe webhook signature');
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			await handleSuccessfulPayment(event.data.object as Stripe.Checkout.Session);
			break;

		case 'checkout.session.expired':
			await handleExpiredSession(event.data.object as Stripe.Checkout.Session);
			break;

		case 'checkout.session.async_payment_failed':
			await handleFailedPayment(event.data.object as Stripe.Checkout.Session);
			break;

		default:
			console.log('Unhandled event type: ', event.type);
	}
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
	const metadata = session.metadata!;

	// Save booking to database
	await db.insert(bookings).values({
		userId: metadata.userId as string,
		cabinId: metadata.cabinId as string,
		checkIn: metadata.checkIn as string,
		checkOut: metadata.checkOut as string,
		guests: Number(metadata.guests),
		nights: Number(metadata.nights),
		subtotal: Number(metadata.subtotal),
		discount: Number(metadata.discount),
		cleaningFee: Number(metadata.cleaningFee),
		serviceFee: Number(metadata.serviceFee),
		bookingFee: Number(metadata.bookingFee),
		tax: Number(metadata.tax),
		totalPrice: Number(metadata.totalPrice),
		stripeSessionId: session.id,
		stripePaymentIntentId: session.payment_intent as string,
		paymentStatus: PAYMENT_STATUS.SUCCEEDED,
		status: BOOKING_STATUS.CONFIRMED
	});
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
	console.log('Session expired for session: ', session.id);
	// TODO: Cancel booking
}

async function handleFailedPayment(session: Stripe.Checkout.Session) {
	console.log('Session failed for session: ', session.id);
	// TODO: Cancel booking
}
