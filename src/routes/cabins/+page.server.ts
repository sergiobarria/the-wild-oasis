import type { PageServerLoad } from './$types'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'

export const load: PageServerLoad = async () => {
	const allCabins = await db.select().from(cabins)
	console.log({ allCabins })

	return {}
}
