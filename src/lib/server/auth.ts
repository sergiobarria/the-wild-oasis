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
	emailAndPassword: {
		enabled: true,
		autoSignIn: true // TODO: change to false
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
