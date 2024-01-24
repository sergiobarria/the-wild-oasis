import {
	pgTable,
	serial,
	integer,
	varchar,
	text,
	decimal,
	timestamp,
	boolean
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const cabins = pgTable('cabins', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	price: decimal('price', { precision: 10, scale: 2 }),
	priceDiscount: decimal('price_discount', { precision: 10, scale: 2 }).default('0.00'),
	maxCapacity: integer('max_capacity').default(1),
	description: text('description'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const guests = pgTable('guests', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	email: varchar('email', { length: 255 }).unique(),
	nationality: varchar('nationality', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const settings = pgTable('settings', {
	id: serial('id').primaryKey(),
	minBookingLength: integer('min_booking_length').default(1),
	maxBookingLength: integer('max_booking_length').default(1),
	maxGuestsPerBooking: integer('max_guests_per_booking').default(1),
	breakfastPrice: decimal('breakfast_price', { precision: 10, scale: 2 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const bookings = pgTable('bookings', {
	id: serial('id').primaryKey(),
	startDate: timestamp('start_date'),
	endDate: timestamp('end_date'),
	numNights: integer('num_nights'),
	numGuests: integer('num_guests'),
	cabinPrice: decimal('cabin_price', { precision: 10, scale: 2 }),
	extrasPrice: decimal('extras_price', { precision: 10, scale: 2 }),
	totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
	hasBreakfast: boolean('has_breakfast').default(false),
	status: varchar('status', { length: 255 }),
	isPaid: boolean('is_paid').default(false),
	observations: text('observations'),
	cabinId: integer('cabin_id'),
	guestId: integer('guest_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const cabinsRelations = relations(cabins, ({ many }) => ({
	bookings: many(bookings)
}))

export const guestsRelations = relations(guests, ({ many }) => ({
	bookings: many(bookings)
}))
