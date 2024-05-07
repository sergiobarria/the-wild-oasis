import type { PageServerLoad } from './$types';
import type { CabinsResponse } from '$pb-types';

export const load: PageServerLoad = async (event) => {
	const cabins = await event.locals.pb.collection('cabins').getFullList<CabinsResponse>({
		sort: '-created',
		fields: 'id,name,max_capacity,price,discount_price'
	});
	console.log('🚀 ~ constload:PageServerLoad= ~ cabins:', cabins);

	return { cabins };
};
