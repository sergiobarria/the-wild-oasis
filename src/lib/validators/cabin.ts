import { z } from 'zod';

export const CabinInputSchema = z.object({
	id: z.string(),
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.min(3, { message: 'Name must be at least 3 characters long' }),
	max_capacity: z.coerce
		.number({ required_error: 'Max capacity is required' })
		.positive({ message: 'Max capacity must be a positive number' }),
	price: z.coerce
		.number({ required_error: 'Price is required' })
		.positive({ message: 'Price must be a positive number' }),
	discount_price: z.coerce.number({ required_error: 'Discount price is required' }),
	description: z.string({ required_error: 'Description is required' }),
	cover: z
		.instanceof(File)
		.refine((f) => f && f?.size < 1024 * 1024 * 5, 'Image must be less than 5MB') // Max. 5MB
		.optional()
});

// export const CabinInputSchema = CabinSchema;
export const CabinSchema = CabinInputSchema.extend({
	image: z.string().optional(),
	cover: z.any().optional() // make it any so typescript doesn't complain about it possibly being a File
});

export type CabinInput = typeof CabinInputSchema;
export type Cabin = z.infer<typeof CabinSchema>;
