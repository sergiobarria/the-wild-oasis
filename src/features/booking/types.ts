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

export interface BookingValidation {
    isValid: boolean
    errors: string[]
}

export interface BookingInput {
    dateRange: DateRange
    guests: number | undefined
    pricePerNight: number
    discountPercentage?: number
}
