import { z } from 'zod';

import { handleZodError } from '$lib/errors';

import type { PageServerLoad } from './$types';

/**
 * Schema for checkout URL search parameters
 */
const CheckoutSearchSchema = z.object({
	cabinId: z.string().min(1, 'Cabin ID is required'),
	checkIn: z.string('Check-in date is required'),
	checkOut: z.string('Check-out date is required'),
	guests: z.coerce.number().int().positive('Number of guests is required')
});

export const load: PageServerLoad = async ({ url }) => {
	const searchParams = url.searchParams;

	// Parse and validate search params
	const parsed = CheckoutSearchSchema.safeParse({
		cabinId: searchParams.get('cabinId'),
		checkIn: searchParams.get('checkIn'),
		checkOut: searchParams.get('checkOut'),
		guests: searchParams.get('guests')
	});

	// If validation fails, throw 400 error with details
	if (!parsed.success) {
		console.error('Checkout parameter validation failed:', parsed.error);
		handleZodError(parsed.error, 'Invalid booking parameters');
	}

	// TODO: Add business validation here
	// Example: Check if dates are valid, cabin exists, etc.

	return {
		cabinId: parsed.data.cabinId,
		checkIn: parsed.data.checkIn,
		checkOut: parsed.data.checkOut,
		guests: parsed.data.guests
	};
};
