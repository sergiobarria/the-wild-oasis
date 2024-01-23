import { pgTable, serial, integer, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core'

export const cabins = pgTable('cabins', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	price: decimal('price', { precision: 10, scale: 2 }),
	priceDiscount: decimal('price_discount', { precision: 10, scale: 2 }),
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
