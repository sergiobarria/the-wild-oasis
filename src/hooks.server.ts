import { building } from '$app/environment';
import { bullboard } from '$lib/server/bullboard/create-board';
import { createEmailWorker } from '$lib/server/queues/email-queue';
import type { Handle } from '@sveltejs/kit';

let emailWorker: ReturnType<typeof createEmailWorker>;

if (!building) emailWorker = createEmailWorker();

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.match(/^\/jobs($|\/)/)) {
		return bullboard.fetch(event.request);
	}

	// NOTE: ONLY FOR TESTING, DELETE LATER
	// if (event.url.pathname === '/test' && event.request.method === 'GET') {
	// 	await addEmailToQueue({
	// 		to: 'test@test.com',
	// 		subject: 'Test email',
	// 		body: 'This is a test email',
	// 		from: 'test@test.com'
	// 	});
	// }

	return resolve(event);
};

process.on('SIGTERM', () => {
	emailWorker?.close();
});
