import type { Handle } from '@sveltejs/kit';
// import { TypedPocketBase } from 'typed-pocketbase';
import PocketBase from 'pocketbase';

import { POCKETBASE_URL } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(POCKETBASE_URL);

	const response = await resolve(event);

	return response;
};
