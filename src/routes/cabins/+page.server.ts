import type { Actions, PageServerLoad } from './$types'
import { eq } from 'drizzle-orm'
import { error, fail } from '@sveltejs/kit'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'

export const load: PageServerLoad = async () => {
	const allCabins = await db
		.select({
			id: cabins.id,
			name: cabins.name,
			price: cabins.price,
			discount: cabins.priceDiscount,
			capacity: cabins.maxCapacity,
			image: cabins.image
		})
		.from(cabins)

	return { cabins: allCabins }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id')

		if (!id) error(400, { message: 'Missing cabin id' })

		try {
			await db.delete(cabins).where(eq(cabins.id, Number(id)))

			return { success: true, message: 'Cabin deleted successfully' }
		} catch (err: unknown) {
			console.error(err)
			return fail(500, { message: 'Something went wrong deleting the cabin record' })
		}
	}
}
