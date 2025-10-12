import * as v from 'valibot';

export const ContactSchema = v.object({
	name: v.pipe(v.string(), v.minLength(3)),
	email: v.pipe(v.string(), v.email()),
	phone: v.string(),
	subject: v.pipe(v.string(), v.minLength(3)),
	message: v.pipe(v.string(), v.minLength(10))
});
