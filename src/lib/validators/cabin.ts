import { z } from 'zod';

export const CabinSchema = z.object({
	id: z.string(),
	name: z.string({ required_error: 'Name is required' }),
	max_capacity: z
		.number({ required_error: 'Max capacity is required' })
		.positive({ message: 'Max capacity must be a positive number' }),
	price: z
		.number({ required_error: 'Price is required' })
		.positive({ message: 'Price must be a positive number' }),
	discount_price: z
		.number({ required_error: 'Discount price is required' })
		.positive({ message: 'Discount price must be a positive number' }),
	description: z.string({ required_error: 'Description is required' })
});

export const CabinInputSchema = CabinSchema.omit({ id: true });

export type CabinInput = typeof CabinInputSchema;
export type Cabin = z.infer<typeof CabinSchema>;
