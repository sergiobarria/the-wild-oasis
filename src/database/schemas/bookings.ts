import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { defaultColumns } from '../helpers'
import { cabins } from './cabins'
import { users } from './users'

export const bookings = sqliteTable('bookings', {
    ...defaultColumns,
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    cabinId: text('cabin_id')
        .notNull()
        .references(() => cabins.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    checkIn: text('check_in').notNull(),
    checkOut: text('check_out').notNull(),
    guests: integer('guests').notNull(),
    nights: integer('nights').notNull(),

    // Pricing breakdown
    subtotal: real('subtotal').notNull(),
    discount: real('discount').default(0),
    cleaningFee: real('cleaning_fee').default(0),
    serviceFee: real('service_fee').default(0),
    bookingFee: real('booking_fee').default(0),
    tax: real('tax').notNull(),
    totalPrice: real('total_price').notNull(),

    // Stripe details
    stripeSessionId: text('stripe_session_id').unique(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    paymentStatus: text('payment_status', { enum: ['pending', 'succeeded', 'failed', 'canceled'] })
        .notNull()
        .default('pending'),

    status: text('status', { enum: ['pending', 'confirmed', 'canceled'] })
        .notNull()
        .default('pending'),
})

// ========== RELATIONS ==========
export const bookingRelations = relations(bookings, ({ one }) => ({
    user: one(users, {
        fields: [bookings.userId],
        references: [users.id],
    }),
    cabin: one(cabins, {
        fields: [bookings.cabinId],
        references: [cabins.id],
    }),
}))

// ========== TYPES ==========
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
