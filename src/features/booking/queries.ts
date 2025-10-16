import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '@/config/constants'

import { getBookingBySessionFn, getUserBookingsFn } from './api'

export const bookingQueries = {
    all: ['bookings'] as const,

    bySession: (sessionId: string) =>
        queryOptions({
            queryKey: [...bookingQueries.all, 'by-session', sessionId],
            queryFn: () => getBookingBySessionFn({ data: { sessionId } }),
            staleTime: DEFAULT_STALE_TIME,
        }),

    userBookings: (userId: string) =>
        queryOptions({
            queryKey: [...bookingQueries.all, 'user-bookings', userId],
            queryFn: () => getUserBookingsFn({ data: { userId } }),
            staleTime: DEFAULT_STALE_TIME,
        }),
}
