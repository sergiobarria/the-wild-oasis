import { form } from '$app/server';
import { ContactFormSchema } from '$lib/schemas/contact.schemas';

export const contactUs = form(ContactFormSchema, async () => {
	// TODO: Implement contact form submission logic here...
});
