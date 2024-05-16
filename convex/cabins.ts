import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const get = query({
	args: {},
	handler: async (ctx) => {
		const cabins = await ctx.db.query('cabins').collect()
		const cabinsWithImages = await Promise.all(
			cabins.map(async (cabin) => ({
				...cabin,
				...(cabin.image ? { imageUrl: await ctx.storage.getUrl(cabin.image) } : {}),
			})),
		)

		return cabinsWithImages
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

export const deleteCabin = mutation({
	args: { id: v.id('cabins') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	},
})
