import { createCookieSessionStorage } from '@remix-run/node';

export type FlashMessage = {
	type: 'success' | 'error';
	message: string;
};

export const { commitSession, getSession, destroySession } = createCookieSessionStorage({
	cookie: {
		name: '__session',
		httpOnly: true,
		maxAge: 60,
		path: '/',
		sameSite: 'lax',
		secrets: ['secrets'],
		secure: true,
	},
});

export async function setFlashMessage(request: Request, message: FlashMessage) {
	const session = await getSession(request.headers.get('Cookie'));
	session.flash('message', message);

	const headers = {
		'Set-Cookie': await commitSession(session),
	};

	return headers;
}
