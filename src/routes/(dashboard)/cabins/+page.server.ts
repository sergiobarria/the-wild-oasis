import { type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import type { Cabin } from '$lib/validators/cabin';
import type { PageServerLoad } from './$types';

type PartialCabinList = Omit<Cabin, 'description'>;

export const load: PageServerLoad = async (event) => {
	const cabins = await event.locals.pb.collection('cabins').getFullList<PartialCabinList>({
		sort: '-created',
		fields: 'id,name,max_capacity,price,discount_price'
	});

	return { cabins };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const cabinId = formData.get('id') as string;

		// TODO: Implement error handling
		// if (!cabinId) fail(400, { message: 'Invalid request' });

		await event.locals.pb.collection('cabins').delete(cabinId);

		redirect(302, '/cabins', { type: 'success', message: 'Cabin deleted successfully' }, event);
	}
};
