import slugify from 'slugify';

import { createId } from '@paralleldrive/cuid2';

import { cabins } from '../app/lib/db/schema';
import { cabins as cabinsData } from '../data/data-cabins';
import { getTursoClient } from './get-client';

async function main() {
	try {
		const { db } = getTursoClient();

		console.log('=> Seeding cabins...');
		const result = await db
			.insert(cabins)
			.values(
				cabinsData.map((cabin) => ({
					id: createId(),
					name: cabin.name,
					slug: slugify(cabin.name, { lower: true }),
					maxCapacity: cabin.maxCapacity,
					price: cabin.regularPrice * 100,
					discountPrice: cabin.discount ? cabin.discount * 100 : null,
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
