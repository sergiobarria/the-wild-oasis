import { query } from '$app/server';
import { db } from '$lib/server/db';

export const getCabins = query(async () => {
	const cabins = await db.query.cabins.findMany({
		where: (cabins, { eq }) => eq(cabins.isActive, true),
		columns: {
			createdAt: false,
			updatedAt: false
		}
	});

	return cabins;
});
