import { createServerFn } from '@tanstack/react-start'

import { desc, eq } from 'drizzle-orm'
import z from 'zod'

import { env } from '@/config/client-env'
import { db } from '@/database'
import { bookings } from '@/database/schemas'
import { stripe } from '@/lib/stripe'

import { CreateCheckoutSessionSchema } from './schemas'

/**
 * @description Create checkout session
 * @param data Booking data
 * @returns Stripe Checkout session
 */
export const createCheckoutSessionFn = createServerFn({ method: 'POST' })
    .inputValidator(CreateCheckoutSessionSchema)
    .handler(async ({ data }) => {
        const successUrl = `${env.VITE_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
        const cancelUrl = `${env.VITE_APP_URL}/checkout/cancel`

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Booking: ${data.cabinName}`,
                            description: `From ${new Date(data.checkIn).toLocaleDateString()} to ${new Date(data.checkOut).toLocaleDateString()}`,
                        },
                        unit_amount: Math.round(data.totalPrice * 100), // convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                cabinId: data.cabinId,
                userId: data.userId,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
                nights: data.nights,
                subtotal: data.subtotal,
                discount: data.discount,
                cleaningFee: data.cleaningFee,
                serviceFee: data.serviceFee,
                bookingFee: data.bookingFee,
                tax: data.tax,
                totalPrice: data.totalPrice,
            },
        })

        return { sessionId: session.id, url: session.url }
    })

/**
 * @description Get booking by session id
 * @param sessionId
 * @returns Booking
 */
export const getBookingBySessionFn = createServerFn({ method: 'GET' })
    .inputValidator(z.object({ sessionId: z.string() }))
    .handler(async ({ data }) => {
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.stripeSessionId, data.sessionId),
            with: {
                cabin: true,
            },
        })

        return booking
    })

/**
 * @description Get user bookings
 * @param userId
 * @returns User bookings (sorted by createdAt desc)
 */
export const getUserBookingsFn = createServerFn({ method: 'GET' })
    .inputValidator(z.object({ userId: z.string() }))
    .handler(async ({ data }) => {
        const userBookings = await db.query.bookings.findMany({
            where: eq(bookings.userId, data.userId),
            with: {
                cabin: true,
            },
            orderBy: [desc(bookings.createdAt)],
        })

        return userBookings
    })
