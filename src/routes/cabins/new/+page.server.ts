import type { PageServerLoad, Actions } from './$types'
// import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { redirect } from 'sveltekit-flash-message/server'

import { db, cabins } from '$lib/server'
import { insertCabinSchema } from '$lib/schemas'
// import { newCabinSchema } from '$lib/schemas'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(insertCabinSchema))
	}
}

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, zod(insertCabinSchema))
		if (!form.valid) fail(400, { form })
		console.log('🚀 ~ form:', form)

		const result = await db.insert(cabins).values({ ...form.data })
		console.log('🚀 ~ result:', result)

		redirect('/cabins', { type: 'success', message: 'Cabin created!' }, event)
	}
	// default: async event => {
	// 	const form = await superValidate(event, newCabinSchema)
	// 	if (!form.valid) return fail(400, { form })
	// 	const insertedId = await db
	// 		.insert(cabins)
	// 		.values({ ...form.data })
	// 		.returning({ insertedId: cabins.id })
	// 	if (!insertedId) return fail(400, { form, message: 'Cabin not created' })
	// 	redirect('/cabins', { type: 'success', message: 'Cabin created!' }, event)
	// }
}
