import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import { Doc } from './_generated/dataModel'

export const get = query({
	args: {},
	handler: async (ctx) => {
		const cabins = await ctx.db.query('cabins').collect()
		const cabinsWithImages = await Promise.all(
			cabins.map(async (cabin) => ({
				...cabin,
				price: cabin.price / 100, // Convert price to dollars
				discount: cabin.discount / 100, // Convert discount to dollars
				...(cabin.image ? { imageUrl: await ctx.storage.getUrl(cabin.image) } : {}),
			})),
		)

		return cabinsWithImages
	},
})

export const getById = query({
	args: { cabinId: v.id('cabins') },
	handler: async (ctx, args) => {
		const cabin = await ctx.db.get(args.cabinId)
		const cabinWithImage = {
			...cabin,
			...(cabin?.image ? { imageUrl: await ctx.storage.getUrl(cabin.image) } : {}),
		}

		return cabinWithImage as (Doc<'cabins'> & { imageUrl?: string }) | undefined
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		maxCapacity: v.number(),
		price: v.number(),
		discount: v.number(),
		description: v.string(),
		image: v.optional(v.id('_storage')),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert('cabins', args)

		return { id }
	},
})

export const update = mutation({
	args: {
		id: v.id('cabins'),
		data: v.object({
			name: v.optional(v.string()),
			maxCapacity: v.optional(v.number()),
			price: v.optional(v.number()),
			discount: v.optional(v.number()),
			description: v.optional(v.string()),
			image: v.optional(v.id('_storage')),
		}),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { ...args.data })
	},
})

export const deleteCabin = mutation({
	args: { id: v.id('cabins') },
	handler: async (ctx, args) => {
		const cabin = await ctx.db.get(args.id)
		if (cabin?.image) {
			await ctx.storage.delete(cabin.image)
		}

		await ctx.db.delete(args.id)
	},
})
