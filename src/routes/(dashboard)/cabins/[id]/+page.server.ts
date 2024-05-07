import type { PageServerLoad } from './$types';
import type { CabinsResponse } from '$pb-types';

export const load: PageServerLoad = async (event) => {
	const cabin = await event.locals.pb
		.collection('cabins')
		.getOne<CabinsResponse>(event.params.id, {
			expand: '' // add comma separated fields to expand
		});
	return { cabin };
};
