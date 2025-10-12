import { form } from '$app/server';
import { ContactSchema } from '$lib/schemas/contact';
import { db } from '$lib/server/db';
import { contactMessages } from '$lib/server/db/schemas';

export const sendContactMessage = form(ContactSchema, async (data) => {
	try {
		await db.insert(contactMessages).values({
			name: data.name,
			email: data.email,
			phone: data.phone,
			subject: data.subject,
			message: data.message
		});

		return { success: true };
	} catch (err: unknown) {
		// TODO: Integrate with Sentry
		console.error('🚀 ~ sendContactMessage ~ err:', err);
		return { success: false, error: 'Something went wrong' };
	}
});
