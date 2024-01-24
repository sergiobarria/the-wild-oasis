import type { PageServerLoad } from './$types'
import { eq } from 'drizzle-orm'
import { error } from '@sveltejs/kit'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'

export const load: PageServerLoad = async ({ params }) => {
	const cabin = await db
		.select()
		.from(cabins)
		.where(eq(cabins.id, Number(params.id)))

	if (!cabin.length) error(404, { message: 'Cabin not found' })

	return { cabin: cabin.at(0) }
}
