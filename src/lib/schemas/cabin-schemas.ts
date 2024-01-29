import { z } from 'zod'

export const newCabinSchema = z.object({
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
		.min(1)
		.max(10),
	price: z.string({
		required_error: 'Price is required'
	}),
	priceDiscount: z.string().optional(),
	description: z
		.string({
			required_error: 'Description is required'
		})
		.min(10)
		.max(1000)
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

export type NewCabinSchema = typeof newCabinSchema
export type EditCabinSchema = typeof editCabinSchema
export type Cabin = z.infer<typeof cabinSchema>
