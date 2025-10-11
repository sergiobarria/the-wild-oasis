import { Link } from '@tanstack/react-router'

import { ArrowRightIcon, BathIcon, BedIcon, UserIcon } from 'lucide-react'

import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { Cabin } from '@/database/schemas'

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
