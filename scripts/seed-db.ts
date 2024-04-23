import slugify from 'slugify';

import { getTursoClient } from './get-client';
import { cabins } from '../app/lib/db/schema';
import { cabins as cabinsData } from '../data/data-cabins';

async function main() {
	try {
		const { db } = getTursoClient();

		console.log('=> Seeding cabins...');
		const result = await db
			.insert(cabins)
			.values(
				cabinsData.map((cabin) => ({
					name: cabin.name,
					slug: slugify(cabin.name, { lower: true }),
					maxCapacity: cabin.maxCapacity,
					price: cabin.regularPrice,
					discountPrice: cabin.discount,
					description: cabin.description
				}))
			)
			.returning({ insertedId: cabins.id, name: cabins.name });

		for (const cabin of result) {
			console.log(`=> Inserted cabin: ${cabin.name} (ID: ${cabin.insertedId})`);
		}

		console.log('=> ✅ Seed complete!');
	} catch (err: unknown) {
		console.error('=> ❌ Seed failed:', err);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

main();
