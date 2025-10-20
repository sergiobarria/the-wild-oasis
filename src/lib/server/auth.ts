import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { getRequestEvent } from '$app/server';

import { db } from './db';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		usePlural: true
	}),
	session: {
		expiresIn: 60 * 60 * 24 * 30 // 30 days
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true // TODO: change to false when email sending is implemented
	},
	socialProviders: {
		// TODO: Add GitHub and Google providers
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
