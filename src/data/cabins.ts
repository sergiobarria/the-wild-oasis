import { db } from '@/db';
import { unstable_noStore as noStore, unstable_cache } from 'next/cache';

export const getAllCabins = unstable_cache(
	async () => {
		const results = await db.query.cabins.findMany({
			columns: {
				createdAt: false,
				updatedAt: false,
				description: false
			},
			orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
		});

		return results;
	},
	['cabins'],
	{
		revalidate: 60 * 10, // 10 minutes,
		tags: ['cabins']
	}
);
