import { z } from 'zod'

import { bookingConfig } from '@/config/booking'

/**
 * Schema for booking form validation
 */
export const BookingFormSchema = z
    .object({
        checkIn: z.date({ error: 'Please select a check-in date' }),
        checkOut: z.date({ error: 'Please select a check-out date' }),
        guests: z
            .number({ error: 'Please enter number of guests' })
            .min(1, 'At least 1 guest is required')
            .max(bookingConfig.maxGuests, `Maximum ${bookingConfig.maxGuests} guests allowed`),
    })
    .refine(
        (data) => {
            if (!data.checkIn || !data.checkOut) return true
            return data.checkOut > data.checkIn
        },
        {
            message: 'Check-out date must be after check-in date',
            path: ['checkOut'],
        },
    )
    .refine(
        (data) => {
            if (!data.checkIn || !data.checkOut) return true
            const nights = Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)) // Calculate nights
            return nights >= bookingConfig.minNights
        },
        {
            message: `Minimum ${bookingConfig.minNights} nights required`,
            path: ['checkOut'],
        },
    )
    .refine(
        (data) => {
            if (!data.checkIn || !data.checkOut) return true
            const nights = Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)) // Calculate nights
            return nights <= bookingConfig.maxNights
        },
        {
            message: `Maximum ${bookingConfig.maxNights} nights allowed`,
            path: ['checkOut'],
        },
    )

export type BookingFormValues = z.infer<typeof BookingFormSchema>
