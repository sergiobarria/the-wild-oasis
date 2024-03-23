import { sqliteTable, text, integer, numeric } from 'drizzle-orm/sqlite-core'

export const cabins = sqliteTable('cabins', {
	id: integer('id').primaryKey(),
	name: text('name').notNull().unique(),
	maxCapacity: integer('max_capacity').notNull().default(1),
	regularPrice: numeric('regular_price').notNull(),
	discountPrice: numeric('discount_price'),
	description: text('description'),
	imageUrl: text('image_url')
})
