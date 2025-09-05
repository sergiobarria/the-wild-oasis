import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import slugify from 'slugify';

import { cabins } from '../src/lib/server/db/schema/cabin';
import { cabins as cabinData } from '../data/data-cabins';

if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
	throw new Error('Database credentials are not set');
}

function getClient() {
	const client = createClient({
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN!
	});

	return drizzle(client);
}

async function seedCabins() {
	const db = getClient();

	console.log('⚠️ Deleting cabins...');
	await db.delete(cabins);

	console.log('🌱 Seeding cabins...');
	for (const cabin of cabinData) {
		const result = await db
			.insert(cabins)
			.values({
				name: cabin.name,
				slug: slugify(cabin.name, { lower: true }),
				price: cabin.regularPrice * 100, // cents
				maxCapacity: cabin.maxCapacity,
				discountPercentage: Math.floor(Math.random() * 7) * 5, // 0, 5, 10, 15, 20, 25, 30
				description: cabin.description,
				isActive: true
			})
			.returning({ id: cabins.id });

		console.log(`✅ Seeded cabin ${cabin.name} with id ${result[0].id}`);
	}
}

async function main() {
	console.log('🌱 Seeding database...');

	await seedCabins();
}

main();
