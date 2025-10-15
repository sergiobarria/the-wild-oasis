import { bookingConfig } from '@/config/booking'
import { BookingInput, BookingPriceBreakdown, BookingValidation, DateRange } from '@/features/booking/types'

/**
 * Calculate the number of nights between two dates
 * @param range - The date range
 * @returns The number of nights
 */
export function calculateNights(range: DateRange): number {
    if (!range.start || !range.end) return 0

    const diffTime = range.end.getTime() - range.start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}

/**
 * Validate the booking input
 * @param input - The booking input
 * @returns The validation result
 */
export function validateBooking(input: BookingInput): BookingValidation {
    const errors: string[] = []
    const { dateRange, guests } = input

    const nights = calculateNights(dateRange)

    // Validate dates
    if (!dateRange.start || !dateRange.end) {
        errors.push('Please select check-in and check-out dates')
    } else if (dateRange.end <= dateRange.start) {
        errors.push('Check-out date must be after check-in date')
    } else if (nights < bookingConfig.minNights) {
        errors.push(`Minimum ${bookingConfig.minNights} nights allowed`)
    }

    // Validate guests
    if (!guests || guests < 1) {
        errors.push('Please select number of guests (minimum 1)')
    } else if (guests > bookingConfig.maxGuests) {
        errors.push(`Maximum ${bookingConfig.maxGuests} guests allowed`)
    } else if (nights > bookingConfig.maxNights) {
        errors.push(`Maximum ${bookingConfig.maxNights} nights allowed`)
    }

    // TODO: Add more validations...

    return {
        isValid: errors.length === 0,
        errors,
    }
}

/**
 * Calculate the booking price breakdown
 * @param input - The booking input
 * @returns The booking price breakdown or null if invalid
 */
export function calculateBookingPrice(input: BookingInput): BookingPriceBreakdown | null {
    const validated = validateBooking(input)
    if (!validated.isValid) return null

    const { dateRange, pricePerNight, discountPercentage = 0 } = input
    const nights = calculateNights(dateRange)
    if (nights === 0) return null

    // Base price
    const basePrice = nights * pricePerNight
    const discount = basePrice * (discountPercentage / 100)
    const discountedBasePrice = basePrice - discount
    const cleaningFee = bookingConfig.cleaningFee

    // Fees (in percentage)
    const serviceFee = discountedBasePrice * (bookingConfig.serviceFeePercentage / 100)
    const bookingFee = discountedBasePrice * (bookingConfig.bookingFeePercentage / 100)
    const processingFee = discountedBasePrice * (bookingConfig.processingFeePercentage / 100)

    // Subtotal and tax
    const subtotal = discountedBasePrice + cleaningFee + serviceFee + bookingFee + processingFee
    const tax = subtotal * (bookingConfig.taxRate / 100)
    const totalPrice = subtotal + tax

    return {
        nights,
        basePrice,
        discount,
        discountedBasePrice,
        cleaningFee,
        serviceFee,
        bookingFee,
        processingFee,
        subtotal,
        tax,
        totalPrice,
    }
}

/**
 * Format a price to a string with two decimal places
 * @param price - The price to format
 * @returns The formatted price
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price)
}

/**
 * Format a booking date to a string
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatBookingDate(date: Date | undefined): string {
    if (!date) return 'Not selected'

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}
