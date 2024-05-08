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

export const getCabinDetails = unstable_cache(
	async (cabinId: string) => {
		const result = await db.query.cabins.findFirst({
			where: (cabins, { eq }) => eq(cabins.id, cabinId)
		});

		return result;
	},
	['cabinDetails'],
	{
		revalidate: 60 * 10, // 10 minutes
		tags: ['cabinDetails']
	}
);
