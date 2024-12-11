import type { Cabin } from '$lib/features/cabins/types';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const cabins = await locals.pb.collection<Cabin>('cabins').getFullList();
	console.log('🚀 ~ constload:PageServerLoad= ~ cabins:', cabins);
	return { cabins };
};
