import { createId } from '@paralleldrive/cuid2';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
	id: text('id', { length: 25 })
		.primaryKey()
		.$defaultFn(() => createId()),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
	minBookingLength: integer('min_booking_length').notNull(),
	maxBookingLength: integer('max_booking_length').notNull(),
	maxGuests: integer('max_guests').notNull(),
	breakfastPrice: integer('breakfast_price').notNull()
});

export type Setting = typeof settings.$inferSelect;
export type SettingInsert = typeof settings.$inferInsert;
