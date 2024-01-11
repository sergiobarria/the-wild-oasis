import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const baseCabinSchema = z.object({
	id: z.string({ required_error: 'No id provided' }),
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
	description: z.string().trim().optional(),
	image: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), 'Only jpeg, jpg, png and webp images are allowed')
		.optional()
});

export const cabinSchema = baseCabinSchema.extend({
	id: baseCabinSchema.shape.id.optional()
});

export const deleteCabinSchema = z.object({
	id: z.string({ required_error: 'No id provided' })
});

export type CabinInsert = z.infer<typeof cabinSchema>;
