import { z } from 'zod';

export const CabinSchema = z.object({
	id: z.string(), // Using CUIDs  as primary keys
	name: z.string({ required_error: 'Cabin name is required' }),
	slug: z.string(),
	maxCapacity: z
		.number({
			required_error: 'Max capacity is required'
		})
		.int('Max capacity must be a whole number')
		.positive('Max capacity is required')
		.max(20, 'Max capacity cannot exceed 20'),
	price: z.number().positive('Price is required'),
	discountPrice: z.number().nullable().default(0),
	description: z.string().nullable().default(''),
	image: z.string().nullable().default(''),
	createdAt: z.string(),
	updatedAt: z.string()
});

export const InsertCabinSchema = CabinSchema.extend({
	id: CabinSchema.shape.id.optional(),
	slug: CabinSchema.shape.slug.optional(),
	image: CabinSchema.shape.image.optional(),
	createdAt: CabinSchema.shape.createdAt.optional(),
	updatedAt: CabinSchema.shape.updatedAt.optional()
});

export type Cabin = z.infer<typeof CabinSchema>;
