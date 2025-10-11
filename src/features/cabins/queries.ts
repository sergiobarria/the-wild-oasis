import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '@/config/constants'

import { getCabinBySlugFn, getCabinsFn } from './api'

export const cabinQueries = {
    all: ['cabins'] as const,

    list: () =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'list'],
            queryFn: () => getCabinsFn(),
            staleTime: DEFAULT_STALE_TIME,
        }),

    bySlug: (slug: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'bySlug', slug],
            queryFn: () => getCabinBySlugFn({ data: { slug } }),
            staleTime: DEFAULT_STALE_TIME,
        }),
}
