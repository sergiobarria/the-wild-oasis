import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	// Temporary redirect to /dashboard
	redirect(301, '/dashboard')
}
