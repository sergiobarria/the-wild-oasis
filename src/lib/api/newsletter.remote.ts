import { eq } from 'drizzle-orm';

import { form } from '$app/server';
import { NewsletterSubscriberSchema } from '$lib/schemas/newsletter-subscriber';
import { db } from '$lib/server/db';
import { newsletterSubscribers } from '$lib/server/db/schemas';

export const subscribeToNewsletter = form(NewsletterSubscriberSchema, async (data) => {
	try {
		const emailExists = await db.query.newsletterSubscribers.findFirst({
			where: eq(newsletterSubscribers.email, data.email)
		});
		if (emailExists) {
			return { success: false, error: 'The email you provided is already subscribed.' };
		}

		await db.insert(newsletterSubscribers).values({ email: data.email, subscribedAt: new Date() });
		return { success: true };
	} catch (err: unknown) {
		// TODO: Integrate with Sentry
		console.error('🚀 ~ subscribeToNewsletter ~ err:', err);
		return { success: false, error: 'Something went wrong' };
	}
});
