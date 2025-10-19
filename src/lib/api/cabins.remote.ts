import { error } from '@sveltejs/kit';

import { and, desc, eq, like, ne, sql } from 'drizzle-orm';
import z from 'zod';

import { query } from '$app/server';
import { db } from '$lib/server/db';
import { cabins } from '$lib/server/db/schemas/cabins';

export const getCabins = query(z.string().optional(), async (search) => {
	const conditions = [];

	if (search) {
		conditions.push(like(sql`lower(${cabins.name})`, `%${search.toLowerCase()}%`));
	}

	const result = await db.query.cabins.findMany({
		where: and(...conditions),
		orderBy: [desc(cabins.createdAt)]
	});

	return result;
});

export const getCabinBySlug = query(z.string().optional(), async (slug) => {
	if (!slug) error(400, 'Slug is required');

	const cabin = await db.query.cabins.findFirst({
		where: eq(cabins.slug, slug),
		with: { reviews: true }
	});

	if (!cabin) error(404, 'Cabin not found');

	const amenities = await db.query.amenities.findMany({
		limit: 10
	});

	const recommended = await db.query.cabins.findMany({
		where: ne(cabins.slug, slug),
		limit: 3,
		orderBy: [desc(cabins.createdAt)]
	});

	return { cabin, amenities, recommended };
});
