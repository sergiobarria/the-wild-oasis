import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'
import { newCabinSchema } from '$lib/schemas/new-cabin-schema'
import { redirect } from 'sveltekit-flash-message/server'

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(newCabinSchema)
	}
}

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, newCabinSchema)

		if (!form.valid) return fail(400, { form })

		const insertedId = await db
			.insert(cabins)
			.values({ ...form.data })
			.returning({ insertedId: cabins.id })

		if (!insertedId) return fail(400, { form, message: 'Cabin not created' })

		redirect('/cabins', { type: 'success', message: 'Cabin created!' }, event)
	}
}
