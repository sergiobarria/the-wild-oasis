import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const cabins = sqliteTable('cabins', {
	id: text('id').primaryKey(), // Using CUIDs as primary keys

	name: text('name', { length: 100 }).notNull().unique(),
	slug: text('slug', { length: 100 }).notNull().unique(),
	maxCapacity: integer('max_capacity').notNull().default(1),
	price: integer('price').notNull().default(0),
	discountPrice: integer('discount_price').default(0),
	description: text('description').notNull().default(''),
	cover: text('cover').default(''),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
