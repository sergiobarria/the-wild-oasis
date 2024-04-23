import { db } from '$lib/db/db.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const cabin = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, Number(params.id))
	});

	if (!cabin) error(404, 'Cabin not found');

	return { cabin };
};
