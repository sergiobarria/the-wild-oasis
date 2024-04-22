import { z } from 'zod';

export const CabinSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(3, 'Name must be at least 3 characters long')
		.max(255, 'Name must be at most 255 characters long'),
	max_capacity: z.coerce.number().int().positive({ message: 'Max Capacity must be a positive integer' }),
	price: z.coerce.number().positive({ message: 'Regular Price must be a positive number' }),
	discount_price: z.coerce.number().optional().default(0),
	description: z
		.string({ required_error: 'Description is required' })
		.min(10, 'Description must be at least 10 characters long'),
	// image: z.string().optional(),
});

// export const InsertCabinSchema = CabinSchema.extend({
// 	id: z.string().optional()
// })

export type InsertCabin = z.infer<typeof CabinSchema>;
