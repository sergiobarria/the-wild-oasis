import { command } from '$app/server';
import {
	CreateCheckoutSessionSchema,
	createCheckoutSession
} from '$lib/server/payments/checkout-session';

export const confirmCheckout = command(CreateCheckoutSessionSchema, async (data) => {
	const result = await createCheckoutSession(data);

	return {
		sessionId: result.sessionId,
		url: result.url
	};
});
