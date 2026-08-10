import { parseAsString } from 'nuqs';

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
 * same as an absent one.
 */
export function buildAdminBookingsQueryArgs(filters: AdminBookingFilters) {
    return {
        search: filters.search || undefined,
        status: (filters.status || undefined) as
            'pending' | 'confirmed' | 'completed' | 'cancelled' | undefined,
        paymentStatus: (filters.paymentStatus || undefined) as
            'not_required' | 'pending' | 'paid' | 'failed' | 'refunded' | undefined,
        cabinId: filters.cabinId || undefined,
        checkInFrom: filters.checkInFrom || undefined,
        checkInTo: filters.checkInTo || undefined,
    };
}
