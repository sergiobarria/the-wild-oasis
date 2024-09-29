import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

import { cabins, guests, settings } from '../src/database/schemas';

dotenv.config({ path: '.env.local' });

const { DATABASE_TOKEN, DATABASE_URL } = process.env;

if (!DATABASE_URL) {
	throw new Error('Database credentials must be provided');
}

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_TOKEN });
const db = drizzle(client);

async function seedSettings() {
	try {
		await db.insert(settings).values({
			minBookingLength: 3,
			maxBookingLength: 90,
			maxGuests: 8,
			breakfastPrice: 1500, // 15.00 USD
		});

		console.log('✅ Settings seeded');
	} catch (err: unknown) {
		console.error('Error seeding settings:', err);
	}
}

async function seedGuests() {
	try {
		const [result] = await db
			.insert(guests)
			.values({
				firstName: 'John',
				lastName: 'B',
				email: 'sergio@email.com',
				nationalId: '123456789',
				countryFlag: '🇺🇸',
				nationality: 'American',
			})
			.returning({ id: guests.id });

		console.log('✅ Guest seeded:', result);
		return result.id;
	} catch (err: unknown) {
		console.error('Error seeding guests:', err);
	}
}

async function seedCabins() {
	try {
		for (let i = 0; i < 10; i++) {
			await db.insert(cabins).values({
				name: `Cabin ${i}`,
				maxCapacity: 4,
				regularPrice: 5000, // 50.00 USD
				discount: 10, // 10%
				description: 'A beautiful cabin in the woods',
				image: '',
			});
		}

		console.log('✅ Cabins seeded');
	} catch (err: unknown) {
		console.error('Error seeding cabins:', err);
	}
}

async function main() {
	console.log('🌱 Seeding database...');

	await seedSettings();
	await seedGuests();
	await seedCabins();
}

main();
