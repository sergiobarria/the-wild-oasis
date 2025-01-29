import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	cabins: defineTable({
		name: v.string(),
		price: v.float64(),
	}),
});
