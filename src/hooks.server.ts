import { type Handle, redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

import { building } from '$app/environment';
import { auth } from '$lib/server/auth';

const PROTECTED_ROUTES = ['/guest', '/admin'];

export const handle: Handle = async ({ event, resolve }) => {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Check if route is protected
	if (PROTECTED_ROUTES.includes(event.url.pathname) && !session) {
		// UNAUTHORIZED redirect to sign-in
		const intendedUrl = event.url.pathname;
		redirect(302, '/sign-in?intended=' + intendedUrl);
	}

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
