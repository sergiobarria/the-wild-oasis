import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { bookings } from './booking';

export const guests = sqliteTable('guests', {
	id: text('id', { length: 25 })
		.primaryKey()
		.$defaultFn(() => createId()),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdateFn(() => new Date()),
	firstName: text('first_name', { length: 255 }).notNull(),
	lastName: text('last_name', { length: 255 }).notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	nationalId: text('national_id', { length: 255 }).notNull().unique(),
	nationality: text('national', { length: 255 }),
	countryFlag: text('country_flag', { length: 255 })
});

export const guestRelations = relations(guests, ({ many }) => ({
	bookings: many(bookings)
}));

export type Guest = typeof guests.$inferSelect;
export type GuestInsert = typeof guests.$inferInsert;
