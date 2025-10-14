import { Link } from '@tanstack/react-router'

import { ArrowRightIcon, BathIcon, BedIcon, UserIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { Cabin } from '@/database/schemas'

export function CabinCard({ cabin }: { cabin: Cabin }) {
    return (
        <Link
            to="/cabins/$cabinSlug"
            params={{ cabinSlug: cabin.slug }}
            className="group focus-visible:ring-primary block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            <Item className="border-border/50 bg-background group-hover:border-primary/20 h-full overflow-hidden border p-0 shadow-sm transition-all duration-300 group-hover:scale-[1.02] hover:shadow-xl">
                {/* Image Section */}
                {/* TODO: Use a real cabin image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                        src="/about-1.jpg"
                        alt={`${cabin.name} cabin`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Price Badge */}
                    <Badge className="absolute top-3 right-3 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-sm">
                        <span className="text-lg font-bold">${cabin.pricePerNight.toFixed(2)}</span>
                        <span className="ml-1 text-xs font-normal">/night</span>
                    </Badge>
                </div>

                {/* Content Section */}
                <ItemContent className="flex flex-col gap-4 p-5">
                    {/* Title */}
                    <ItemTitle className="group-hover:text-primary line-clamp-2 text-xl leading-tight font-bold transition-colors duration-200">
                        {cabin.name}
                    </ItemTitle>

                    {/* Amenities Grid */}
                    <div className="text-muted-foreground grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <UserIcon className="text-primary size-4 shrink-0" />
                            <span>{cabin.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BedIcon className="text-primary size-4 shrink-0" />
                            <span>{cabin.beds} beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BathIcon className="text-primary size-4 shrink-0" />
                            <span>{cabin.baths} baths</span>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="border-border/50 mt-auto flex items-center justify-between border-t pt-4">
                        <span className="text-primary group-hover:text-primary/80 font-semibold transition-colors">
                            View Details
                        </span>
                        <ArrowRightIcon className="text-primary size-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                </ItemContent>
            </Item>
        </Link>
    )
}
