import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// NOTE: It should redirect to the login page once it's implemented
	redirect(307, '/overview');
};
