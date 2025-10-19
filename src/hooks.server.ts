import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { svelteKitHandler } from 'better-auth/svelte-kit';

import { building } from '$app/environment';
import { LOGIN_PAGE_URL } from '$lib/config/constants';
import { auth } from '$lib/server/auth';

const PROTECTED_ROUTES = ['/admin', '/guest'] as const;

/**
 * Handle 1: Authentication - Set up session and locals
 */
const handleAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return resolve(event);
};

/**
 * Handle 2: Route Protection - Guard protected routes
 */
const handleRouteGuard: Handle = async ({ event, resolve }) => {
	const { url, locals } = event;
	const isProtectedRoute = PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route));

	// Redirect unauthenticated users from protected routes
	if (isProtectedRoute && !locals.user) {
		const redirectTo = `${LOGIN_PAGE_URL}?redirect=${encodeURIComponent(url.pathname)}`;
		throw redirect(303, redirectTo);
	}

	return resolve(event);
};

/**
 * Handle 3: Better Auth - Handle Better Auth API routes
 */
const handleBetterAuth: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

/**
 * Combine all handlers in sequence
 */
export const handle = sequence(handleAuth, handleRouteGuard, handleBetterAuth);
