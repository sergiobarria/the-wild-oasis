import { createId } from '@paralleldrive/cuid2';
import { sql, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { cabins } from './cabin';

export const bookings = sqliteTable('bookings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	cabinId: text('cabin_id')
		.notNull()
		.references(() => cabins.id, { onDelete: 'cascade' }),
	// guestId: text('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
	numNights: integer('num_nights').notNull(),
	numGuests: integer('num_guests').notNull(),
	cabinPrice: integer('cabin_price').notNull(),
	extrasPrice: integer('extras_price').notNull(),
	totalPrice: integer('total_price').notNull(),
	status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] })
		.notNull()
		.default('pending'),
	hasBreakfast: integer('has_breakfast', { mode: 'boolean' }).notNull().default(false),
	isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
	observations: text('observations', { length: 1000 }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

export const bookingRelations = relations(bookings, ({ one }) => ({
	cabin: one(cabins, {
		fields: [bookings.cabinId],
		references: [cabins.id]
	})
	// TODO: Add guest relation
}));

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
