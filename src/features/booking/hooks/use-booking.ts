import React from 'react'

import { calculateBookingPrice, formatBookingDate, formatPrice, validateBooking } from '../calculations'
import { BookingInput, DateRange } from '../types'

interface UseBookingProps {
    range: DateRange
    guests: number | undefined
    pricePerNight: number
    discountPercentage?: number
}

export interface UseBookingReturn {
    priceBreakdown: ReturnType<typeof calculateBookingPrice>
    validation: ReturnType<typeof validateBooking>
    formattedCheckinDate: string
    formattedCheckoutDate: string
    formatPrice: typeof formatPrice
    isReadyToBook: boolean
}

export function useBooking({ range, guests, pricePerNight, discountPercentage }: UseBookingProps): UseBookingReturn {
    const input: BookingInput = {
        dateRange: range,
        guests,
        pricePerNight,
        discountPercentage,
    }

    // Reactive validation
    const validation = React.useMemo(() => validateBooking(input), [range, guests])

    // Reactive price breakdown
    const priceBreakdown = React.useMemo(
        () => calculateBookingPrice(input),
        [range, guests, pricePerNight, discountPercentage],
    )

    const formattedCheckinDate = React.useMemo(() => formatBookingDate(range.start), [range.start])
    const formattedCheckoutDate = React.useMemo(() => formatBookingDate(range.end), [range.end])

    const isReadyToBook = validation.isValid && priceBreakdown !== null

    return {
        priceBreakdown,
        validation,
        formattedCheckinDate,
        formattedCheckoutDate,
        formatPrice,
        isReadyToBook,
    }
}
