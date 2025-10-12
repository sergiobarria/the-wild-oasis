import * as v from 'valibot';

export const ContactSchema = v.object({
	name: v.pipe(v.string('Please enter your name.'), v.nonEmpty('Please enter your name.')),
	email: v.pipe(
		v.string('Please enter your email.'),
		v.email('Please enter a valid email.'),
		v.nonEmpty('Please enter your email.')
	),
	phone: v.optional(v.string()),
	subject: v.pipe(v.string('Please enter a subject.'), v.nonEmpty('Please enter a subject.')),
	message: v.pipe(v.string('Please enter a message.'), v.nonEmpty('Please enter a message.'))
});
