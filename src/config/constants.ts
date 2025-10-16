export const APP_NAME = 'The Wild Oasis'
export const APP_DESCRIPTION = 'The Wild Oasis is a cozy cabin rental in the heart of the wilderness.'
export const APP_KEYWORDS = 'cabin rental, wilderness, cozy cabin, cabin rental in the wilderness'
export const APP_URL = 'https://the-wild-oasis.com'
export const CONTACT_EMAIL = 'hello@thewildoasis.com'
export const CONTACT_PHONE = '+39 347 666 6666'

export const DEFAULT_REDIRECT_AFTER_LOGIN = '/'

export const DEFAULT_STALE_TIME = 5000 // 5 seconds in milliseconds
export const DEFAULT_DEBOUNCE_DELAY = 500

export const BOOKING_STATUS = {
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
} as const

export const BOOKING_PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    CANCELED: 'canceled',
} as const
