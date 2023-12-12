import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';

import { createCabin, deleteCabin, getCabins } from '$lib/firebase/cabins';
import { createCabinSchema, deleteCabinSchema } from '$lib/schemas/cabin';

export const load: PageServerLoad = async () => {
	const form = await superValidate(createCabinSchema);
	const deleteCabinForm = await superValidate(deleteCabinSchema);
	const cabins = await getCabins();

	return { form, deleteCabinForm, cabins };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, createCabinSchema);
		if (!form.valid) return fail(400, { form });

		const id = await createCabin(form.data);
		if (!id) return fail(500, { message: 'Error creating cabin' });

		return { form };
	},
	delete: async ({ request }) => {
		const form = await superValidate(request, deleteCabinSchema);
		if (!form.valid) return fail(400, { form });

		const result = await deleteCabin(form.data.id);
		if (!result.success) return fail(500, { message: 'Error deleting cabin' });

		return { form };
	}
};
