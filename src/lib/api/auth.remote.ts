import { APIError } from 'better-auth';

import { form } from '$app/server';
import { SignInSchema, SignUpSchema } from '$lib/schemas/auth';
import { auth } from '$lib/server/auth';

export const signUp = form(SignUpSchema, async (payload) => {
	await auth.api.signUpEmail({
		body: {
			email: payload.email,
			password: payload.password,
			name: ''
		}
	});

	return { success: true };
});

export const signIn = form(SignInSchema, async (payload) => {
	try {
		await auth.api.signInEmail({
			body: {
				email: payload.email,
				password: payload.password
			}
		});

		return { success: true };
	} catch (err: unknown) {
		if (err instanceof APIError) {
			console.log('🚀 ~ err:', err);
			return { success: false, error: err.message || 'Something went wrong' };
		}
	}
});
