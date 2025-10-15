import { env } from '@/config/client-env'

export const bookingConfig = {
    taxRate: env.VITE_BOOKING_TAX_RATE,
    bookingFeePercentage: env.VITE_BOOKING_FEE_PERCENTAGE,
    processingFeePercentage: env.VITE_BOOKING_PROCESSING_FEE_PERCENTAGE,
    cleaningFee: env.VITE_BOOKING_CLEANING_FEE,
    serviceFeePercentage: env.VITE_BOOKING_SERVICE_FEE_PERCENTAGE,
    maxGuests: env.VITE_BOOKING_MAX_GUESTS,
    maxNights: env.VITE_BOOKING_MAX_NIGHTS,
    minNights: env.VITE_BOOKING_MIN_NIGHTS,
} as const
