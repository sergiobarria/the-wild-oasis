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

/** `/cabins` with the home page's availability search redirected in as query params. */
export function cabinsSearchHref(params: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
}): string {
    const query = new URLSearchParams();

    if (params.checkIn) query.set('checkIn', params.checkIn);
    if (params.checkOut) query.set('checkOut', params.checkOut);
    if (params.guests) query.set('guests', params.guests);

    const qs = query.toString();
    return qs ? `${APP_ROUTES.CABINS}?${qs}` : APP_ROUTES.CABINS;
}

/** `/checkout/summary` for a fully-configured booking (cabin + dates + guests) carried over
 *  from the booking panel -- unlike `cabinsSearchHref`, every param is required: there's
 *  nothing useful to check out with a partial selection. */
export function checkoutSummaryHref(params: {
    cabinId: string;
    checkIn: string;
    checkOut: string;
    guests: string;
}): string {
    const query = new URLSearchParams(params);
    return `${APP_ROUTES.CHECKOUT_SUMMARY}?${query.toString()}`;
}

/** `/sign-in` with a same-origin path to return to after auth -- the one place this exact
 *  query-string shape is built, used by both `lib/require-auth.ts`'s server-side redirect and
 *  any client component (e.g. the booking panel) that gates a navigation on being signed in. */
export function signInHref(redirectTo: string): string {
    return `${APP_ROUTES.SIGN_IN}?redirectTo=${encodeURIComponent(redirectTo)}`;
}

/** `/checkout/success` for a just-created reservation. */
export function checkoutSuccessHref(reservationId: string): string {
    const query = new URLSearchParams({ reservationId });
    return `${APP_ROUTES.CHECKOUT_SUCCESS}?${query.toString()}`;
}
