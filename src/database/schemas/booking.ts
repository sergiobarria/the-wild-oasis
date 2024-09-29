import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { cabins } from './cabin';
import { guests } from './guest';

export const bookings = sqliteTable('bookings', {
	id: text('id', { length: 25 })
		.primaryKey()
		.$defaultFn(() => createId()),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
	checkIn: integer('check_in', { mode: 'timestamp' }).notNull(),
	checkOut: integer('check_out', { mode: 'timestamp' }).notNull(),
	numberOfNights: integer('number_of_nights').notNull(),
	numberOfGuests: integer('number_of_guests').notNull(),
	cabinPrice: integer('cabin_price').notNull(),
	extrasPrice: integer('extras_price').notNull(),
	totalPrice: integer('total_price').notNull(),
	status: text('status', { enum: ['unconfirmed', 'confirmed'] }).notNull(),
	hasBreakfast: integer('has_breakfast', { mode: 'boolean' }).notNull(),
	isPaid: integer('is_paid', { mode: 'boolean' }).notNull(),
	observations: text('observations'),
	cabinId: text('cabin_id', { length: 25 }).references(() => cabins.id, { onDelete: 'set null' }),
	guestId: text('guest_id', { length: 25 }).references(() => guests.id, { onDelete: 'set null' })
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
	cabin: one(cabins, {
		fields: [bookings.cabinId],
		references: [cabins.id]
	}),
	guest: one(guests, {
		fields: [bookings.guestId],
		references: [guests.id]
	})
}));
