import { handleStripeWebhook } from '$lib/server/payments/stripe-webhook';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	console.log('🚀 ~ POST ~ event:', event.request);

	try {
		const result = await handleStripeWebhook();

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err: unknown) {
		console.error('Stripe webhook error: ', err);

		return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
