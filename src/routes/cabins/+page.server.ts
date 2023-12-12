import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';

import { createCabin, deleteCabin, getCabins, updateCabin } from '$lib/firebase/cabins';
import { createCabinSchema, deleteCabinSchema } from '$lib/schemas/cabin';
import { uploadFile } from '$lib/firebase/upload';

export const load: PageServerLoad = async () => {
	const form = await superValidate(createCabinSchema);
	const deleteCabinForm = await superValidate(deleteCabinSchema);
	const cabins = await getCabins();

	return { form, deleteCabinForm, cabins };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file');
		const form = await superValidate(formData, createCabinSchema);

		if (!form.valid) return fail(400, { form });

		const id = await createCabin(form.data);
		if (!id) return fail(500, { message: 'Error creating cabin' });

		let url = '';
		if (file instanceof File) {
			url = await uploadFile(file, 'cabins');
		}

		if (url) {
			const result = await updateCabin(id, { image: url });
			if (!result.success) return fail(500, { message: 'Error updating cabin' });

			return { form };
		}

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
