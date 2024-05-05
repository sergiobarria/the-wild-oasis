import { z } from 'zod';

export const CabinSchema = z.object({
	$id: z.string(),
	name: z
		.string({
			required_error: 'Name is required'
		})
		.trim(),
	slug: z.string({
		required_error: 'Slug is required'
	}),
	max_capacity: z
		.number({
			required_error: 'Max capacity is required'
		})
		.positive(),
	price: z.number({
		required_error: 'Price is required'
	}),
	discount_price: z.number().nullable().default(0),
	description: z
		.string({
			required_error: 'Description is required'
		})
		.trim(),
	cover: z.string().nullable().optional()
});

export const InsertCabinSchema = CabinSchema.omit({
	$id: true
});

export type Cabin = z.infer<typeof CabinSchema>;
export type InsertCabin = z.infer<typeof InsertCabinSchema>;
