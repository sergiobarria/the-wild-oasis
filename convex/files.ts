import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		// use `args` and/or `ctx.auth` to authorize the user
		// ...

		return await ctx.storage.generateUploadUrl()
	},
})

export const deleteById = mutation({
	args: { storageId: v.id('_storage') },
	handler: async (ctx, args) => {
		return await ctx.storage.delete(args.storageId)
	},
})
