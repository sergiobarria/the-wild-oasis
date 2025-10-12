import * as v from 'valibot';

export const SignUpSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your email.'),
			v.email('The email address is badly formatted.')
		),
		password: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your password.'),
			v.minLength(8, 'Your password must have 8 characters or more.')
		),
		passwordConfirmation: v.string()
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['passwordConfirmation']],
			(input) => input.password === input.passwordConfirmation,
			'The two passwords do not match.'
		),
		['passwordConfirmation']
	)
);

export const SignInSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your email.'),
			v.email('The email address is badly formatted.')
		),
		password: v.pipe(
			v.string(),
			v.nonEmpty('Please enter your password.'),
			v.minLength(8, 'Your password must have 8 characters or more.')
		)
	})
);
