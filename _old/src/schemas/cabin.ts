import { z } from 'zod';

export const CabinSchema = z.object({
	id: z.string(),
	name: z
		.string({
			required_error: 'Name is required'
		})
		.trim(),
	slug: z.string({
		required_error: 'Slug is required'
	}),
	maxCapacity: z
		.number({
			required_error: 'Max capacity is required'
		})
		.positive(),
	price: z.number({
		required_error: 'Price is required'
	}),
	discountPrice: z.number().nullable().default(0),
	description: z
		.string({
			required_error: 'Description is required'
		})
		.trim(),
	cover: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export const InsertCabinSchema = CabinSchema.omit({
	id: true,
	slug: true,
	createdAt: true,
	updatedAt: true
});

export type Cabin = z.infer<typeof CabinSchema>;
export type InsertCabin = z.infer<typeof InsertCabinSchema>;
