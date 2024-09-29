import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { bookings } from './booking';

export const cabins = sqliteTable('cabins', {
	id: text('id', { length: 25 })
		.primaryKey()
		.$defaultFn(() => createId()),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
	name: text('name', { length: 255 }).notNull(),
	maxCapacity: integer('max_capacity').notNull(),
	regularPrice: integer('regular_price').notNull(),
	discount: integer('discount'), // -> in percent
	description: text('description'),
	image: text('image'),
});

export const cabinsRelations = relations(cabins, ({ many }) => ({
	bookings: many(bookings),
}));

export type Cabin = typeof cabins.$inferSelect;
export type CabinInsert = typeof cabins.$inferInsert;
