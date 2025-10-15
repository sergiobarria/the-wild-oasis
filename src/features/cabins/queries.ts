import { queryOptions } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '@/config/constants'

import { getCabinById, getCabinBySlugFn, getCabinsFn } from './api'

export const cabinQueries = {
    all: ['cabins'] as const,

    list: (searchQuery?: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'list', searchQuery],
            queryFn: () => getCabinsFn({ data: { searchQuery } }),
            staleTime: DEFAULT_STALE_TIME,
        }),

    getById: (id: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'getById', id],
            queryFn: () => getCabinById({ data: { id } }),
            staleTime: DEFAULT_STALE_TIME,
        }),

    getBySlug: (slug: string) =>
        queryOptions({
            queryKey: [...cabinQueries.all, 'getBySlug', slug],
            queryFn: () => getCabinBySlugFn({ data: { slug } }),
            staleTime: DEFAULT_STALE_TIME,
        }),
}
