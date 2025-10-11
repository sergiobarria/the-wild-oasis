import { useSuspenseQuery } from '@tanstack/react-query'

import { SearchIcon } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'

import { Input } from '@/components/ui/input'
import { cabinQueries } from '@/features/cabins/queries'

import { CabinCard } from './cabin-card'

export function CabinList({ searchQuery }: { searchQuery: string }) {
    const { data } = useSuspenseQuery(cabinQueries.list(searchQuery))
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

    return (
        <div className="mt-8">
            <div className="relative">
                <Input
                    placeholder="Search cabins..."
                    className="w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            </div>

            <div className="my-8">filters</div>

            {data.length === 0 && <div className="text-center">No cabins found</div>}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {data.map((cabin) => (
                    <CabinCard key={cabin.id} cabin={cabin} />
                ))}
            </div>
        </div>
    )
}
