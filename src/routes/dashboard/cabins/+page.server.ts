import type { Actions } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
// import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/db/db.server';
import { cabins } from '$lib/db/schemas';

export async function load() {
	let cabins = await db.query.cabins.findMany({
		columns: {
			id: true,
			name: true,
			maxCapacity: true,
			price: true,
			discountPrice: true,
			image: true
		},
		orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
	});

	// transform cabins data as needed
	cabins = cabins.map((cabin) => ({
		...cabin,
		image: cabin.image ?? 'https://placehold.co/150x100'
	}));

	return { cabins };
}

export const actions: Actions = {
	delete: async (event) => {
		console.log('DELETE CABIN CALLED');
		// const formData = await event.request.formData();
		// const id = formData.get('id');

		// if (!id) error(400, 'Invalid request');

		// try {
		console.log('BEFORE REDIRECT');
		// await db.delete(cabins).where(eq(cabins.id, Number(id)));
		redirect(303, '/dashboard/cabins', { type: 'success', message: 'Cabin deleted successfully' }, event);
		// } catch (err: unknown) {
		console.error('=> 💥 Failed to delete cabin');
		// redirect(303, '/dashboard/cabins', { type: 'error' as const, message: 'Failed to delete cabin' }, event);
		// error(500, 'Failed to delete cabin');
		// }
	}
};
