import type { PageLoad } from './$types';

import { getCabins } from '$lib/firebase/cabins';
import { createCabinSchema, deleteCabinSchema } from '$lib/schemas/cabin';
import { superValidate } from 'sveltekit-superforms/client';

export const load: PageLoad = async () => {
	const form = await superValidate(createCabinSchema);
	const deleteCabinForm = await superValidate(deleteCabinSchema);
	const cabins = await getCabins();

	return { form, deleteCabinForm, cabins };
};
