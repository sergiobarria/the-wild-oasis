import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import Stripe from 'stripe'

import { BOOKING_PAYMENT_STATUS, BOOKING_STATUS } from '@/config/constants'
import { env } from '@/config/server-env'
import { db } from '@/database'
import { bookings } from '@/database/schemas'
import { stripe } from '@/lib/stripe'

export const handleStripeWebhookFn = createServerFn({ method: 'POST' }).handler(async () => {
    const request = getRequest()
    const sig = request.headers.get('stripe-signature')
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET

    if (!sig) throw new Error('Missing stripe-signature header')

    const body = await request.text()

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
        console.error('Stripe webhook signature verification failed: ', err)
        throw new Error('Invalid stripe-signature header')
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            await handleSuccessfulPayment(event.data.object)
            break

        case 'checkout.session.expired':
            await handleExpiredSession(event.data.object)
            break

        case 'checkout.session.async_payment_failed':
            await handleFailedPayment(event.data.object)
            break

        default:
            console.log('Unhandled event type: ', event.type)
    }

    return { received: true }
})

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    const metadata = session.metadata!

    // Save booking to database
    await db.insert(bookings).values({
        userId: metadata.userId as string,
        cabinId: metadata.cabinId as string,
        checkIn: metadata.checkIn as string,
        checkOut: metadata.checkOut as string,
        guests: Number(metadata.guests),
        nights: Number(metadata.nights),
        subtotal: Number(metadata.subtotal),
        discount: Number(metadata.discount),
        cleaningFee: Number(metadata.cleaningFee),
        serviceFee: Number(metadata.serviceFee),
        bookingFee: Number(metadata.bookingFee),
        tax: Number(metadata.tax),
        totalPrice: Number(metadata.totalPrice),
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        paymentStatus: BOOKING_PAYMENT_STATUS.SUCCEEDED,
        status: BOOKING_STATUS.CONFIRMED,
    })

    console.log('Booking created for session: ', session.id)
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
    console.log('Session expired for session: ', session.id)
    // TODO: Cancel booking
}

async function handleFailedPayment(session: Stripe.Checkout.Session) {
    console.log('Session failed for session: ', session.id)
    // TODO: Cancel booking
}
