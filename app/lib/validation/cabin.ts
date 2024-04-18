import { z } from 'zod';

export const cabinSchema = z.object({
	id: z.number({ required_error: 'ID is required' }),
	name: z
		.string({ required_error: 'Name is required' })
		.min(3, 'Name must be at least 3 characters long')
		.max(255, 'Name must be at most 255 characters long'),
	slug: z
		.string({ required_error: 'Slug is required' })
		.min(3, 'Slug must be at least 3 characters long')
		.max(255, 'Slug must be at most 255 characters long'),
	maxCapacity: z.coerce.number().int().positive({ message: 'Max Capacity must be a positive integer' }),
	regularPrice: z.coerce.number().positive({ message: 'Regular Price must be a positive number' }),
	discountPrice: z.coerce.number().positive({ message: 'Discount Price must be a positive number' }).nullable(),
	description: z
		.string({ required_error: 'Description is required' })
		.min(10, 'Description must be at least 10 characters long'),
	image: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type Cabin = z.infer<typeof cabinSchema>;
