import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const cabins = sqliteTable('cabins', {
	// id: integer('id').primaryKey(),
	id: text('id').primaryKey(), // Use cuid's as primary key instead of auto-incrementing integers

	// Columns
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	maxCapacity: integer('max_capacity').notNull(),
	price: integer('price').notNull(),
	discountPrice: integer('discount_price'),
	description: text('description'),
	image: text('image'),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
