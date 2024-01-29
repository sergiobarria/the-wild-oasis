import type { PageServerLoad } from './$types'
import { eq } from 'drizzle-orm'
import { error, fail, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

import { db } from '$lib/database/db.server'
import { cabins } from '$lib/database/schemas'
import { editCabinSchema } from '$lib/schemas/cabin-schemas'
import { redirect } from 'sveltekit-flash-message/server'

export const load: PageServerLoad = async ({ params }) => {
	const cabin = await db.query.cabins.findFirst({
		where: eq(cabins.id, Number(params.id))
	})
	// NOTE: the above is equivalent to the below but using Prisma like syntax
	// const cabin = await db
	// 	.select()
	// 	.from(cabins)
	// 	.where(eq(cabins.id, Number(params.id)))

	if (!cabin) error(404, { message: 'Cabin not found' })

	return {
		cabin,
		form: await superValidate(editCabinSchema)
	}
}

export const actions: Actions = {
	default: async event => {
		const form = await superValidate(event, editCabinSchema)

		if (!form.valid) return fail(400, { form })

		try {
			await db
				.update(cabins)
				.set({
					...form.data
				})
				.where(eq(cabins.id, form.data.id))
		} catch (err: unknown) {
			console.error(err)
			return fail(400, { form, message: 'Cabin not updated' })
		}

		redirect('/cabins', { type: 'success', message: 'Cabin updated!' }, event)
	}
}
