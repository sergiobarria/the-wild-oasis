import { z } from 'zod';

export const createCabinSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(3, { message: 'Name must be at least 3 characters long' })
		.trim(),
	maxCapacity: z
		.number({ required_error: 'Max capacity is required' })
		.int()
		.min(1, { message: 'Max capacity must be at least 1' })
		.max(12, { message: 'Max capacity must be at most 12' }),
	price: z.number({ required_error: 'Price is required' }).positive(),
	discount: z.number().optional().default(0),
	description: z.string().trim().optional()
});

export const deleteCabinSchema = z.object({
	id: z.string({ required_error: 'No id provided' })
});

export type CabinInsert = z.infer<typeof createCabinSchema>;
