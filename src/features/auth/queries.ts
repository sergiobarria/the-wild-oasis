import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '@/config/constants'

import { getCurrentsessionFn } from './api'

export const authQueries = {
    all: ['auth'] as const,

    session: () =>
        queryOptions({
            queryKey: [...authQueries.all, 'session'],
            queryFn: () => getCurrentsessionFn(),
            staleTime: DEFAULT_STALE_TIME,
            retry: false, // DON'T RETRY ON AUTH QUERIES
        }),
}
