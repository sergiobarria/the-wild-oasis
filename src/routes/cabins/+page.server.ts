import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'

export const load: PageServerLoad = async () => {
	const allCabins = await db.query.cabins.findMany({
		columns: {
			id: true,
			name: true,
			price: true,
			priceDiscount: true,
			maxCapacity: true,
			imageURL: true
		},
		orderBy: (cabins, { desc }) => [desc(cabins.createdAt)]
	})
	// NOTE: The above is the same as the below but using the query builder
	// const allCabins = await db
	// 	.select({
	// 		id: cabins.id,
	// 		name: cabins.name,
	// 		price: cabins.price,
	// 		discount: cabins.priceDiscount,
	// 		capacity: cabins.maxCapacity,
	// 		image: cabins.image
	// 	})
	// 	.from(cabins)
	// 	.orderBy(desc(cabins.createdAt))

	return { cabins: allCabins }
}

export const actions: Actions = {
	default: async event => {
		const data = await event.request.formData()
		const id = data.get('id')

		if (!id) error(400, { message: 'Missing cabin id' })

		try {
			await db.delete(cabins).where(eq(cabins.id, Number(id)))
		} catch (err: unknown) {
			console.error(err)
			return fail(500, { message: 'Something went wrong deleting the cabin record' })
		}

		redirect('/cabins', { type: 'success', message: 'Cabin deleted successfully' }, event)
	}
}
