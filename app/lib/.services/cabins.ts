import { desc, eq } from 'drizzle-orm';
import { db } from '~/lib/db.server';
import { cabins } from '~/lib/schemas.server';

export async function getCabins() {
	const allCabins = await db
		.select({
			id: cabins.id,
			name: cabins.name,
			slug: cabins.slug,
			maxCapacity: cabins.maxCapacity,
			regularPrice: cabins.regularPrice,
			discountPrice: cabins.discountPrice,
		})
		.from(cabins)
		.orderBy(desc(cabins.createdAt));

	return allCabins;
}

export async function getCabinBySlug(slug: string) {
	const cabin = await db.select().from(cabins).where(eq(cabins.slug, slug));

	if (cabin.length === 0) return null;

	return cabin.at(0);
}

export async function deleteCabin(cabinID: number) {
	const result = await db.delete(cabins).where(eq(cabins.id, cabinID)).returning({ deletedId: cabins.id });
	console.log('🚀 ~ deleteCabin ~ result:', result);

	if (result.length === 0) return null;

	return result?.at(0)?.deletedId;
}
