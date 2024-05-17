import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getFirst = query({
	args: {},
	handler: async (ctx) => {
		const settings = await ctx.db.query('settings').first()
		if (!settings) return null

		return {
			...settings,
			breakfastPrice: settings?.breakfastPrice / 100,
		}
	},
})

export const update = mutation({
	args: {
		id: v.id('settings'),
		data: v.object({
			minBookingDays: v.number(),
			maxBookingDays: v.number(),
			maxGuestsPerCabin: v.number(),
			breakfastPrice: v.number(),
		}),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, { ...args.data })
	},
})
