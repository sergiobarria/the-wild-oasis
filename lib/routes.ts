/**
 * Every application route, in one place. Referenced everywhere a path is
 * needed -- never inline a route string (docs/02_CODING_GUIDELINES.md §7).
 * Grows as each phase in docs/03_MVP_TASKS.md ships its routes; entries below
 * that don't have a page yet are placeholders for work already scoped there.
 */
export const APP_ROUTES = {
    HOME: '/',
    CABINS: '/cabins',
    cabinDetails: (slug: string) => `/cabins/${slug}` as const,
    ABOUT: '/about',
    CONTACT: '/contact',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
    CHECKOUT_SUMMARY: '/checkout/summary',
    CHECKOUT_SUCCESS: '/checkout/success',
    CHECKOUT_CANCEL: '/checkout/cancel',
    GUEST_AREA: '/guest-area',
    GUEST_AREA_BOOKINGS: '/guest-area/bookings',
    GUEST_AREA_PROFILE: '/guest-area/profile',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    ADMIN: '/admin',
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_CABINS: '/admin/cabins',
    ADMIN_MESSAGES: '/admin/messages',
    ADMIN_SUBSCRIBERS: '/admin/subscribers',
    ADMIN_USERS: '/admin/users',
    ADMIN_FEATURE_FLAGS: '/admin/feature-flags',
    ADMIN_SETTINGS: '/admin/settings',
    /** Internal design-system reference -- never linked from public nav. */
    BRAND: '/brand',
} as const;
