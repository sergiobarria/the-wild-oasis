import { z } from 'zod';

export const CabinSchema = z.object({
	id: z.string(),
	name: z.string({
		required_error: 'Name is required'
	}),
	slug: z.string({
		required_error: 'Slug is required'
	}),
	maxCapacity: z.coerce.number({
		required_error: 'Max capacity is required'
	}),
	price: z.coerce.number({
		required_error: 'Price is required'
	}),
	discountPrice: z.coerce.number().nullable(),
	description: z.string({
		required_error: 'Description is required'
	}),
	createdAt: z.string(),
	updatedAt: z.string()
});

export const InsertCabinSchema = CabinSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type Cabin = z.infer<typeof CabinSchema>;
export type InsertCabin = z.infer<typeof InsertCabinSchema>;
