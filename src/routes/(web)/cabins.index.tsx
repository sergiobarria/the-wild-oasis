import { Suspense, useRef } from 'react'

import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { createFileRoute } from '@tanstack/react-router'

import { SearchIcon } from 'lucide-react'
import { z } from 'zod'

import { Typography } from '@/components/shared/typography'
import { Input } from '@/components/ui/input'
import { ActiveFilters, type FilterItem } from '@/features/cabins/components/active-filters'
import { CabinList, CabinListSuspense } from '@/features/cabins/components/cabin-list'

export const Route = createFileRoute('/(web)/cabins/')({
    validateSearch: z.object({
        search: z.string().optional().catch(''),
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = Route.useNavigate()
    const searchParams = Route.useSearch()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearch = useDebouncedCallback(
        (query: string) => {
            navigate({
                search: (prev) => ({ ...prev, search: query.trim() || undefined }),
            })
        },
        {
            wait: 500,
        },
    )

    const activeFilters: FilterItem[] = []

    if (searchParams.search) {
        activeFilters.push({
            key: 'search',
            label: 'Search',
            value: searchParams.search,
        })
    }

    const handleRemoveFilter = (key: string) => {
        if (key === 'search' && inputRef.current) {
            inputRef.current.value = ''
        }

        navigate({
            search: (prev) => {
                const newSearch = { ...prev }
                delete newSearch[key as keyof typeof newSearch]
                return newSearch
            },
        })
    }

    const handleClearAll = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }

        navigate({
            search: {},
        })
    }

    return (
        <section className="container mx-auto max-w-7xl px-8 py-12">
            <Typography variant="h1" size="3xl" className="text-primary">
                Our Luxury Cabins
            </Typography>
            <Typography variant="body">
                Cozy yet luxurious cabins, located right at the heart of the Italian Dolomites. Imagine waking up to
                beautiful mountain views, spending your days exploring the dark forests around, or just relaxing in your
                private hot tub under the stars. Enjoy nature's beauty in your own little home away from home. The
                perfect spot for a peaceful, calm vacation. Welcome to paradise.
            </Typography>

            <div className="relative my-8">
                <Input
                    ref={inputRef}
                    placeholder="Search cabins..."
                    className="w-full"
                    defaultValue={searchParams.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            </div>

            <ActiveFilters
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAll}
                className="mb-4"
            />

            <Suspense fallback={<CabinListSuspense />}>
                <CabinList />
            </Suspense>
        </section>
    )
}
