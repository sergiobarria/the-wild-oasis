import { parseAsString } from 'nuqs';

import { PAYMENT_STATUS, RESERVATION_STATUS } from '@/convex/lib/reservations';

const VALID_STATUSES: string[] = Object.values(RESERVATION_STATUS);
const VALID_PAYMENT_STATUSES: string[] = Object.values(PAYMENT_STATUS);

export const adminBookingFilterParsers = {
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    paymentStatus: parseAsString.withDefault(''),
    cabinId: parseAsString.withDefault(''),
    checkInFrom: parseAsString.withDefault(''),
    checkInTo: parseAsString.withDefault(''),
};

export type AdminBookingFilters = {
    search: string;
    status: string;
    paymentStatus: string;
    cabinId: string;
    checkInFrom: string;
    checkInTo: string;
};

/** Whether any filter is active -- gates showing "Clear filters". */
export function hasActiveAdminBookingFilters(filters: AdminBookingFilters): boolean {
    return Object.values(filters).some((value) => value !== '');
}

/**
 * Empty-string URL params (nuqs' natural "unset" representation) become `undefined` for
 * `adminListReservations`'s optional args -- the query treats a present-but-empty filter the
 * same as an absent one. `status`/`paymentStatus` are additionally validated against their
 * known literal values -- a hand-edited, stale, or bookmarked URL (`?status=foo`) falls back to
 * "unset" instead of reaching Convex's `args` validator and throwing (same discipline as
 * `features/cabins/cabins-domain.ts`'s `parseGuests`, an unconstrained URL string is never
 * trusted to already be a valid enum member).
 */
export function buildAdminBookingsQueryArgs(filters: AdminBookingFilters) {
    return {
        search: filters.search || undefined,
        status: (VALID_STATUSES.includes(filters.status) ? filters.status : undefined) as
            'pending' | 'confirmed' | 'completed' | 'cancelled' | undefined,
        paymentStatus: (VALID_PAYMENT_STATUSES.includes(filters.paymentStatus)
            ? filters.paymentStatus
            : undefined) as 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded' | undefined,
        cabinId: filters.cabinId || undefined,
        checkInFrom: filters.checkInFrom || undefined,
        checkInTo: filters.checkInTo || undefined,
    };
}
