import { redirect } from '@sveltejs/kit';

export async function load() {
	// Temporary redirect to /dashboard
	redirect(307, '/dashboard');
}
