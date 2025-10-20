import { createClient } from '@libsql/client';
import { createId } from '@paralleldrive/cuid2';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

import { amenities as amenitiesData } from '../data/data-amenities';
import { cabins as cabinsData } from '../data/data-cabins';
import * as amenities from '../src/lib/server/db/schemas/amenities';
import * as bookings from '../src/lib/server/db/schemas/bookings';
import * as cabins from '../src/lib/server/db/schemas/cabins';
import * as reviews from '../src/lib/server/db/schemas/reviews';
import * as users from '../src/lib/server/db/schemas/users';

dotenv.config();

const schema = {
	...amenities,
	...bookings,
	...cabins,
	...reviews,
	...users
};

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!process.env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' });

async function seedAmenities() {
	console.log('🌱 Seeding amenities...');

	for (const amenity of amenitiesData) {
		await db.insert(schema.amenities).values({
			name: amenity.name,
			group: amenity.group
		});
	}
}

async function seedCabins() {
	console.log('🌱 Seeding cabins...');

	// Seed helper user
	const [user] = await db
		.insert(schema.users)
		.values({
			id: createId(),
			email: 'john@email.com',
			name: 'john'
		})
		.returning({ id: schema.users.id });

	// Seed cabins
	for (const cabin of cabinsData) {
		const [inserted] = await db
			.insert(schema.cabins)
			.values({
				name: cabin.name,
				slug: cabin.slug,
				pricePerNight: cabin.price_per_night,
				discountPercentage: cabin.discount_percentage,
				summary: cabin.summary,
				maxGuests: cabin.max_guests,
				beds: cabin.beds,
				baths: cabin.baths,
				description: cabin.description
			})
			.returning({ id: schema.cabins.id });

		// ====== Seed a random number of amenities ======

		// ====== Seed a random number of reviews ======
		const reviewsCount = Math.floor(Math.random() * 5) + 1;

		for (let i = 0; i < reviewsCount; i++) {
			await db.insert(schema.reviews).values({
				cabin_id: inserted.id,
				user_id: user.id,
				rating: Math.floor(Math.random() * 5) + 1,
				comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				author_name: 'John Doe'
			});
		}

		console.log(`Seeded cabin ${inserted.id} with ${reviewsCount} reviews`);
	}
}

async function seed() {
	console.log('🌱 Seeding database...');
	console.log('🗑️ Clearing database...');

	await db.delete(schema.cabins);
	await db.delete(schema.reviews);
	await db.delete(schema.amenities);

	console.log('🌱 Seeding cabins...');

	// ======== SEEDING ========
	await seedAmenities();
	await seedCabins();
}

seed()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => {
		console.log('🌱 Database seeded successfully!');
		process.exit(0);
	});
