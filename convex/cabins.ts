import { query } from './_generated/server';

export const getAll = query({
	args: {},
	handler: async ctx => {
		const cabins = await ctx.db.query('cabins').collect();

		return cabins;
	},
});
