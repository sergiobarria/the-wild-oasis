import { error } from '@sveltejs/kit';
import { and, desc, eq, like, ne, sql } from 'drizzle-orm';
import * as v from 'valibot';

import { query } from '$app/server';
import { db } from '$lib/server/db';
import { cabins } from '$lib/server/db/schemas';

export const getCabins = query(v.optional(v.string()), async (search) => {
	const conditions = [];

	if (search) conditions.push(like(sql`lower(${cabins.name})`, `%${search.toLowerCase()}%`));

	const results = await db.query.cabins.findMany({
		where: and(...conditions),
		orderBy: [desc(cabins.createdAt)]
	});

	return results;
});

export const getCabin = query(v.string(), async (slug) => {
	const [cabin, amenities, recommended] = await Promise.all([
		// Find cabin by slug
		db.query.cabins.findFirst({
			where: eq(cabins.slug, slug),
			with: { reviews: true }
		}),
		// Find amenities
		db.query.amenities.findMany({
			limit: Math.floor(Math.random() * 5) + 5 // Random number of amenities (5 - 10)
		}),
		// Find recommended cabins
		db.query.cabins.findMany({
			where: ne(cabins.slug, slug),
			orderBy: [desc(cabins.createdAt)],
			limit: 3
		})
	]);

	if (!cabin) error(404, 'Cabin not found');

	return {
		cabin,
		amenities,
		recommended
	};
});
