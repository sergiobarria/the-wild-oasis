import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '@/config/constants'

import { getCabinBySlugFn, getCabinsFn } from './api'

export const cabinQueries = {
    all: ['cabins'] as const,

    list: (searchQuery?: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'list', searchQuery],
            queryFn: () => getCabinsFn({ data: { searchQuery } }),
            staleTime: DEFAULT_STALE_TIME,
        }),

    bySlug: (slug: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'bySlug', slug],
            queryFn: () => getCabinBySlugFn({ data: { slug } }),
            staleTime: DEFAULT_STALE_TIME,
        }),
}
