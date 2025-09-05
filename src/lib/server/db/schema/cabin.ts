import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cabins = sqliteTable('cabins', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	price: integer('price').notNull(),
	discountPercentage: integer('discount_percentage').default(0),
	maxCapacity: integer('max_capacity').notNull(),
	description: text('description', { length: 1000 }),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

export const cabinRelations = relations(cabins, () => ({
	// ...
}));
