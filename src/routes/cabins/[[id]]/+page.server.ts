import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import _ from 'lodash';

import type { PageServerLoad } from './$types';
import { createCabin, getCabins, getCabinByID, updateCabin, deleteCabin, uploadFile } from '$lib/firebase';
import { cabinSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ params }) => {
	let cabin: z.infer<typeof cabinSchema> | null = null;
	if (params.id) {
		cabin = await getCabinByID(params.id as string);
	}
	const cabins = await getCabins();
	if (params.id && !cabin) error(404, 'Cabin not found');

	const form = await superValidate(cabin, cabinSchema);

	return { form, cabins };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('image');
		const form = await superValidate(formData, cabinSchema);

		if (!form.valid) return fail(400, { form });

		if (form.data.id) {
			if (formData.has('delete')) {
				const result = await deleteCabin(form.data.id);
				if (!result.success)
					return message(form, { type: 'error', text: 'Error deleting cabin' }, { status: 500 });

				redirect(303, '/cabins');
			} else {
				const result = await updateCabin(form.data.id, form.data);
				if (!result.success)
					return message(form, { type: 'error', text: 'Error updating cabin' }, { status: 500 });

				let url: string = '';
				if (file instanceof File) {
					url = await uploadFile(file, 'cabins');
				}

				if (url) {
					const result = await updateCabin(form.data.id, { image: url });
					if (!result.success)
						return message(form, { type: 'error', text: 'Error updating cabin' }, { status: 500 });
				}

				return message(form, { type: 'success', text: 'Cabin updated successfully' });
			}
		} else {
			console.log('creating cabin', { form, file });
			const data = _.omit(form.data, ['image', 'id']);
			const id = await createCabin(data);
			if (!id) return message(form, { type: 'error', text: 'Error creating cabin' }, { status: 500 });

			let url: string = '';
			if (file instanceof File) {
				url = await uploadFile(file, 'cabins');
			}

			if (url) {
				const result = await updateCabin(id, { image: url });
				if (!result.success)
					return message(form, { type: 'error', text: 'Error updating cabin' }, { status: 500 });
			}
		}

		return message(form, { type: 'success', text: 'Cabin updated successfully' });
	}
};
