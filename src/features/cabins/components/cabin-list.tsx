import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { ArrowRightIcon, BathIcon, BedIcon, SearchIcon, UserIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { Cabin } from '@/database/schemas'
import { cabinQueries } from '@/features/cabins/queries'

export function CabinList() {
    const { data } = useSuspenseQuery(cabinQueries.list())

    return (
        <div className="mt-8">
            <div className="relative">
                <Input placeholder="Search cabins..." className="w-full" />
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

export function CabinCard({ cabin }: { cabin: Cabin }) {
    return (
        <Item className="bg-background p-0">
            <img src="/placeholder.jpg" alt={cabin.name} className="h-56 w-full object-cover" />

            <ItemContent className="space-y-2">
                <ItemTitle>{cabin.name}</ItemTitle>
                <span className="font-medium">${cabin.pricePerNight.toFixed(2)} / night</span>

                <ul className="flex gap-6 text-sm">
                    <li className="flex items-center gap-1">
                        <UserIcon className="text-primary size-4" />
                        {cabin.maxGuests} guests
                    </li>
                    <li className="flex items-center gap-1">
                        <BedIcon className="text-primary size-4" />
                        {cabin.beds} beds
                    </li>
                    <li className="flex items-center gap-1">
                        <BathIcon className="text-primary size-4" />
                        {cabin.baths} bathrooms
                    </li>
                </ul>

                <Link
                    to="/cabins/$cabinSlug"
                    params={{ cabinSlug: cabin.slug }}
                    className="text-primary flex items-center gap-2 hover:underline"
                >
                    View details
                    <ArrowRightIcon className="size-4" />
                </Link>
            </ItemContent>
        </Item>
    )
}
