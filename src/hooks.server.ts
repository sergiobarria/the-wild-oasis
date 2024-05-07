import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pocketbase-types';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase;

	const response = await resolve(event);

	return response;
};
