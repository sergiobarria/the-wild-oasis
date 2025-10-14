import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'

import { SearchIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

import { cabinQueries } from '../queries'
import { CabinCard } from './cabin-card'

const routeApi = getRouteApi('/(web)/cabins/')

export function CabinList() {
    const { search } = routeApi.useSearch()
    const { data } = useSuspenseQuery(cabinQueries.list(search))

    if (data.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Cabins Found</EmptyTitle>
                    <EmptyDescription>
                        We couldn&apos;t find any cabins matching your search. Try adjusting your filters or search
                        term.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((cabin) => (
                <CabinCard key={cabin.id} cabin={cabin} />
            ))}
        </div>
    )
}

export function CabinListSuspense() {
    return (
        <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
                <Spinner className="text-primary mx-auto size-12" />
                <Typography variant="body" size="sm" className="text-muted-foreground mt-4">
                    Loading cabins...
                </Typography>
            </div>
        </div>
    )
}
