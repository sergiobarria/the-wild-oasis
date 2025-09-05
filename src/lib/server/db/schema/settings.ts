import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	minBookingLength: integer('min_booking_length').notNull(),
	maxBookingLength: integer('max_booking_length').notNull(),
	maxGuests: integer('max_guests').notNull(),
	breakfastPrice: integer('breakfast_price').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});
