import { useMemo } from 'react'

import {
    type BookingInput,
    type DateRange,
    calculateBookingPrice,
    formatBookingDate,
    formatPrice,
} from '../calculations'

export interface UseBookingProps {
    range: DateRange
    guests: number | undefined
    pricePerNight: number
    discountPercentage?: number
}

export interface UseBookingReturn {
    priceBreakdown: ReturnType<typeof calculateBookingPrice>
    formattedCheckinDate: string
    formattedCheckoutDate: string
    formatPrice: typeof formatPrice
}

/**
 * Hook simplificado para cálculos de booking
 * La validación ahora la maneja TanStack Form + Zod
 */
export function useBooking({ range, guests, pricePerNight, discountPercentage }: UseBookingProps): UseBookingReturn {
    const input: BookingInput = {
        dateRange: range,
        guests,
        pricePerNight,
        discountPercentage,
    }

    // Solo cálculo de precio, sin validación
    const priceBreakdown = useMemo(
        () => calculateBookingPrice(input),
        [range.start, range.end, guests, pricePerNight, discountPercentage],
    )

    const formattedCheckinDate = useMemo(() => formatBookingDate(range.start), [range.start])

    const formattedCheckoutDate = useMemo(() => formatBookingDate(range.end), [range.end])

    return {
        priceBreakdown,
        formattedCheckinDate,
        formattedCheckoutDate,
        formatPrice,
    }
}
