import { z } from 'zod'

export const insertCabinSchema = z.object({
	name: z
		.string({
			required_error: 'Name is required'
		})
		.min(3)
		.max(50),
	maxCapacity: z.coerce
		.number({
			required_error: 'Max capacity is required'
		})
		.positive()
		.max(10)
		.default(1),
	regularPrice: z.string({
		required_error: 'Price is required'
	}),
	discountPrice: z.string().optional(),
	description: z
		.string({
			required_error: 'Description is required'
		})
		.min(10)
		.max(1000)
	// imageURL: z.string().optional()
})

export const editCabinSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	maxCapacity: z.number().optional(),
	price: z.string().optional(),
	priceDiscount: z.string().optional(),
	description: z.string().optional()
})

export const cabinSchema = editCabinSchema.extend({
	id: z.number()
})

export type InsertCabinSchema = typeof insertCabinSchema
export type EditCabinSchema = typeof editCabinSchema
export type Cabin = z.infer<typeof cabinSchema>
