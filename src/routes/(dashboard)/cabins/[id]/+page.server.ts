import type { PageServerLoad } from './$types';
import type { Cabin } from '$lib/validators/cabin';

export const load: PageServerLoad = async (event) => {
	const cabin = await event.locals.pb.collection('cabins').getOne<Cabin>(event.params.id, {
		expand: '' // add comma separated fields to expand
	});

	return { cabin };
};
