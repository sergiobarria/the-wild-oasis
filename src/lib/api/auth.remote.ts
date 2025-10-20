import { redirect } from '@sveltejs/kit';

import { form, getRequestEvent, query } from '$app/server';
import { SignInSchema, SignUpSchema } from '$lib/schemas/auth.schemas';
import { auth } from '$lib/server/auth';

/**
 * Handle user sign-up with email and password.
 */
export const signUp = form(SignUpSchema, async (data) => {
	try {
		await auth.api.signUpEmail({
			body: {
				email: data.email,
				password: data.password,
				name: '',
				callbackURL: '/'
			}
		});

		return { success: true };
	} catch (err: unknown) {
		// TODO: proper logging and error handling
		console.error(err);
		const error = err as { message?: string };
		return { success: false, error: error.message ?? 'Sign up failed. Please try again.' };
	}
});

export const signin = form(SignInSchema, async (data) => {
	const { request } = getRequestEvent();

	try {
		await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
				callbackURL: '/'
			},
			headers: request.headers
		});

		return { success: true };
	} catch (err: unknown) {
		// TODO: proper logging and error handling
		console.error(err);
		const error = err as { message?: string };
		return { success: false, error: error.message ?? 'Sign in failed. Please try again.' };
	}
});

/**
 * Handle user sign-out.
 * Redirects to the home page after signing out.
 */
export const signout = form(async () => {
	const { request } = getRequestEvent();

	await auth.api.signOut({ headers: request.headers });
	redirect(303, '/');
});

/**
 * Require authentication for a page or endpoint.
 * If the user is not authenticated, they will be redirected to the sign-in page.
 */
export const ensureAuthenticated = query(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(303, '/sign-in');
	}

	return {
		user: locals.user,
		session: locals.session
	};
});

/**
 * Get the current authentication session.
 * Returns null for user and session if not authenticated.
 */
export const getAuthSession = query(async () => {
	const { locals } = getRequestEvent();

	return {
		user: locals.user ?? null,
		session: locals.session ?? null
	};
});
