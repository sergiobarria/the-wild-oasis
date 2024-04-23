import type { PageServerLoad } from './$types';

import { db } from '$lib/db/db.server';

export const load: PageServerLoad = async ({ params }) => {
	const cabin = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, Number(params.id))
	});

	return { cabin };
};
