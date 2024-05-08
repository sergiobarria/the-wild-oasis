import { redirect } from 'sveltekit-flash-message/server';

import { type Cabin } from '$lib/validators/cabin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const cabins = await event.locals.pb.collection('cabins').getFullList<Cabin>({
		sort: '-created'
		// fields: 'id,name,max_capacity,price,discount_price,image' // Removed because the getUrl method doesn't seem to work with filtered fields
	});

	// For each cabin, get the image URL using Pocketbase's files.getUrl method
	// NOTE: If I pass the cabin object with filtered fields to the getUrl method, it doesn't work
	for (const cabin of cabins) {
		// const record = await event.locals.pb.collection('cabins').getOne(cabin.id);
		cabin.image = cabin.cover
			? event.locals.pb.files.getUrl(cabin, cabin.cover, { thumb: '100x75' })
			: 'https://via.placeholder.com/100x75';
	}

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
