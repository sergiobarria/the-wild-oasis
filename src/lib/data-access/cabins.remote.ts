import * as v from 'valibot';

import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { cabins } from '$lib/server/db/schema/cabin';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const getCabins = query(async () => {
	const cabins = await db.query.cabins.findMany({
		where: (cabins, { eq }) => eq(cabins.isActive, true),
		columns: {
			createdAt: false,
			updatedAt: false
		}
	});

	return cabins;
});

const CreateCabinSchema = v.object({
	name: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Name must be at least 3 characters long'),
		v.maxLength(100, 'Name must be at most 100 characters long'),
		v.regex(/^[a-zA-Z0-9 ]+$/, 'Name must contain only letters, numbers, and spaces')
	),
	maxCapacity: v.pipe(
		v.number('Max capacity is required'),
		v.minValue(1, 'Max capacity must be at least 1')
	),
	price: v.pipe(v.number('Price is required'), v.minValue(1, 'Price must be at least 1')),
	discount: v.optional(
		v.pipe(
			v.string(),
			v.transform((input) => Number(input)),
			v.minValue(0, 'Discount must be at least 0'),
			v.maxValue(100, 'Discount must be at most 100')
		)
	),
	description: v.nullish(
		v.pipe(v.string(), v.maxLength(10000, 'Description must be at most 10000 characters long'))
	)
});

export const createCabin = form(async (data) => {
	console.log('🚀 ~ createCabin ~ data:', data);
	const dataObj = Object.fromEntries(data);
	const result = v.safeParse(CreateCabinSchema, dataObj);

	if (!result.success) {
		const errors = v.flatten<typeof CreateCabinSchema>(result.issues);
		console.error('Create Cabin validation failed: ', errors);
		return { errors };
	}

	redirect(303, '/admin/cabins');
});

export const deleteCabin = command(v.string(), async (id) => {
	const result = await db.delete(cabins).where(eq(cabins.id, id));

	if (result.rowsAffected === 0) throw new Error('Cabin not found or could not be deleted');
});
