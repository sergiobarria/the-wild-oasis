import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { createId as cuid } from '@paralleldrive/cuid2';
import { z } from 'zod';

import { combineHeaders } from './misc';
import { config } from '~/lib/utils/config';

export const TOAST_KEY = 'toast';

const ToastSchema = z.object({
	id: z.string().default(() => cuid()),
	description: z.string(),
	title: z.string().optional(),
	type: z.enum(['message', 'success', 'error']).default('message')
});

export type Toast = z.infer<typeof ToastSchema>;
export type ToastInput = z.input<typeof ToastSchema>;

export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_toast', // cookie name for the session
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [config.SESSION_SECRET],
		secure: config.NODE_ENV === 'production'
	}
});

export async function redirectWithToast(url: string, toast: ToastInput, init?: ResponseInit) {
	return redirect(url, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast))
	});
}

export async function createToastHeaders(toastInput: ToastInput) {
	const session = await toastSessionStorage.getSession();
	const toast = ToastSchema.parse(toastInput);

	session.flash(TOAST_KEY, toast);
	const cookie = await toastSessionStorage.commitSession(session);

	return new Headers({ 'set-cookie': cookie });
}

export async function getToast(request: Request) {
	const session = await toastSessionStorage.getSession(request.headers.get('cookie'));
	const result = ToastSchema.safeParse(session.get(TOAST_KEY));
	const toast = result.success ? result.data : null;

	return {
		toast,
		headers: toast ? new Headers({ 'set-cookie': await toastSessionStorage.destroySession(session) }) : null
	};
}
