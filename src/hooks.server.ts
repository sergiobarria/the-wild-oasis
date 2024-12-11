import type { Handle } from '@sveltejs/kit';

import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	// TODO: Update the URL to match PocketHost instance and move to .env
	event.locals.pb = new PocketBase('http://127.0.0.1:8090/');
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	const model = event.locals.pb.authStore.record;

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = structuredClone(model);
			event.locals.user!.isSuperuser = event.locals.pb.authStore.isSuperuser;
		}
	} catch {
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			secure: false // TODO: secure this
		})
	);

	return response;
};
