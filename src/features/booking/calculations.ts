import { bookingConfig } from '@/config/booking'

export interface DateRange {
    start: Date | undefined
    end: Date | undefined
}

export interface BookingPriceBreakdown {
    nights: number
    basePrice: number
    discount: number
    discountedBasePrice: number
    cleaningFee: number
    serviceFee: number
    bookingFee: number
    processingFee: number
    subtotal: number
    tax: number
    totalPrice: number
}

export interface BookingInput {
    dateRange: DateRange
    guests: number | undefined
    pricePerNight: number
    discountPercentage?: number
}

/**
 * Calculate the number of nights between two dates
 */
export function calculateNights(range: DateRange): number {
    if (!range.start || !range.end) return 0

    const diffTime = range.end.getTime() - range.start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}

/**
 * Calculate the booking price breakdown
 * @param input - The booking input (assumed to be valid)
 * @returns The booking price breakdown or null if data is incomplete
 */
export function calculateBookingPrice(input: BookingInput): BookingPriceBreakdown | null {
    const { dateRange, pricePerNight, discountPercentage = 0, guests } = input

    // Return null if any required data is missing
    if (!dateRange.start || !dateRange.end || !guests) return null

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
 * Formatea un precio a string con dos decimales
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price)
}

/**
 * Formatea una fecha a string legible
 */
export function formatBookingDate(date: Date | undefined): string {
    if (!date) return 'Not selected'

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}
