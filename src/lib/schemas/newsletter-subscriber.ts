import * as v from 'valibot';

export const NewsletterSubscriberSchema = v.object({
	email: v.pipe(
		v.string('Please enter your email.'),
		v.email('Please enter a valid email.'),
		v.nonEmpty('Please enter your email.')
	)
});
