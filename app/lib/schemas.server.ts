import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const cabins = sqliteTable('cabins', {
	id: integer('id').primaryKey(),

	// Columns
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	maxCapacity: integer('max_capacity').notNull(),
	regularPrice: real('regular_price').notNull(),
	discountPrice: real('discount_price'),
	description: text('description').notNull(),
	image: text('image'),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const guests = sqliteTable('guests', {
	id: integer('id').primaryKey(),

	// Columns
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone'),
	nationality: text('nationality'),
	nationalID: text('national_id'),
	countryFlag: text('country_flag'),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const bookings = sqliteTable('bookings', {
	id: integer('id').primaryKey(),

	// Foreign keys
	guestId: integer('guest_id').notNull(),
	cabinId: integer('cabin_id').notNull(),

	// Columns
	startDate: text('start_date').notNull(),
	endDate: text('end_date').notNull(),
	numNights: integer('num_nights').notNull(),
	numGuests: integer('num_guests').notNull(),
	cabinPrice: real('cabin_price').notNull(),
	extrasPrice: real('extras_price').notNull(),
	totalPrice: real('total_price').notNull(),
	status: text('status').notNull(),
	hasBreakfast: integer('has_breakfast', { mode: 'boolean' }).notNull(),
	isPaid: integer('is_paid', { mode: 'boolean' }).notNull(),
	observations: text('observations'),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// One-to-many relationships between bookings, cabins and guests
// - A booking belongs to a cabin and a guest
// - A cabin has many bookings
// - A guest has many bookings
export const guestsRelations = relations(guests, ({ many }) => ({
	bookings: many(bookings),
}));

export const cabinsRelations = relations(cabins, ({ many }) => ({
	bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
	guest: one(guests, {
		fields: [bookings.guestId],
		references: [guests.id],
	}),
	cabin: one(cabins, {
		fields: [bookings.cabinId],
		references: [cabins.id],
	}),
}));

export const settings = sqliteTable('settings', {
	id: integer('id').primaryKey(),

	// Columns
	minBookingLength: integer('min_booking_length').notNull(),
	maxBookingLength: integer('max_booking_length').notNull(),
	maxGuestsPerBooking: integer('max_guests').notNull(),
	breakfastPrice: real('breakfast_price').notNull(),

	// Timestamps
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});
