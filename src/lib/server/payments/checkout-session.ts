import z from 'zod';

import { PUBLIC_APP_URL } from '$env/static/public';

import { stripe } from './stripe';

export const CreateCheckoutSessionSchema = z.object({
	userId: z.string(),
	cabinId: z.string(),
	cabinName: z.string(),
	checkIn: z.string(),
	checkOut: z.string(),
	guests: z.number(),
	nights: z.number(),
	subtotal: z.number(),
	discount: z.number().default(0),
	cleaningFee: z.number(),
	serviceFee: z.number(),
	bookingFee: z.number(),
	tax: z.number(),
	totalPrice: z.number()
});

/**
 * @description Create checkout session
 * @param data Booking data
 * @returns Stripe Checkout session
 */
export const createCheckoutSession = async (data: z.infer<typeof CreateCheckoutSessionSchema>) => {
	const successUrl = `${PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
	const cancelUrl = `${PUBLIC_APP_URL}/checkout/cancel`;

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: `Booking: ${data.cabinName}`,
						description: `From ${new Date(data.checkIn).toLocaleDateString()} to ${new Date(data.checkOut).toLocaleDateString()}`
					},
					unit_amount: Math.round(data.totalPrice * 100) // convert to cents
				},
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata: {
			cabinId: data.cabinId,
			userId: data.userId,
			checkIn: data.checkIn,
			checkOut: data.checkOut,
			guests: data.guests,
			nights: data.nights,
			subtotal: data.subtotal,
			discount: data.discount,
			cleaningFee: data.cleaningFee,
			serviceFee: data.serviceFee,
			bookingFee: data.bookingFee,
			tax: data.tax,
			totalPrice: data.totalPrice
		}
	});

	return { sessionId: session.id, url: session.url };
};
