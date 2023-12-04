import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// No content in this route, just redirect to the dashboard
	throw redirect(303, '/dashboard');
};
