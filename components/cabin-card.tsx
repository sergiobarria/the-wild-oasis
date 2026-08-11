import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Bed, BedDouble, MapPin, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AMENITY_ICON_BY_KEY } from '@/lib/amenity-icons';
import { formatNightlyRate } from '@/lib/money';
import { APP_ROUTES } from '@/lib/routes';

const MAX_VISIBLE_AMENITIES = 4;

type CabinCardCabin = {
    _id: string;
    name: string;
    slug: string;
    location: string;
    nightlyRate: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    coverImageUrl: string | null;
    shortDescription: string;
};

type AmenityBadge = { _id: string; name: string; icon: string };

type CabinCardProps = {
    cabin: CabinCardCabin;
    /** Spec §27's "important amenities" -- omit on a card whose query didn't resolve them. */
    amenities?: AmenityBadge[];
    /** Gold ring + "Featured" badge, for the home page's curated selection. */
    featured?: boolean;
};

export function CabinCard({ cabin, amenities, featured }: CabinCardProps) {
    const visibleAmenities = amenities?.slice(0, MAX_VISIBLE_AMENITIES);
    const hiddenAmenityCount = amenities ? amenities.length - MAX_VISIBLE_AMENITIES : 0;

    return (
        <Card className={featured ? 'overflow-hidden ring-primary/30' : 'overflow-hidden'}>
            <div className='relative -mt-(--card-spacing) aspect-4/3 overflow-hidden rounded-t-xl'>
                <Image
                    src={cabin.coverImageUrl ?? '/assets/placeholder.jpg'}
                    alt=''
                    fill
                    sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                    className='object-cover'
                />
                {featured && <Badge className='absolute top-3 left-3'>Featured</Badge>}
            </div>
            <CardContent className='flex-1 space-y-3'>
                <div className='flex items-start justify-between gap-2'>
                    <h3 className='font-heading text-lg font-medium'>{cabin.name}</h3>
                    <span className='shrink-0 text-base font-semibold text-primary'>
                        {formatNightlyRate(cabin.nightlyRate)}
                    </span>
                </div>

                <p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <MapPin className='size-3.5 shrink-0' aria-hidden='true' />
                    {cabin.location}
                </p>

                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span
                        className='flex items-center gap-1.5'
                        aria-label={`${cabin.maxGuests} guests`}
                    >
                        <Users className='size-3.5' aria-hidden='true' />
                        <span aria-hidden='true'>{cabin.maxGuests}</span>
                    </span>
                    <span
                        className='flex items-center gap-1.5'
                        aria-label={`${cabin.bedrooms} bedrooms`}
                    >
                        <BedDouble className='size-3.5' aria-hidden='true' />
                        <span aria-hidden='true'>{cabin.bedrooms}</span>
                    </span>
                    <span className='flex items-center gap-1.5' aria-label={`${cabin.beds} beds`}>
                        <Bed className='size-3.5' aria-hidden='true' />
                        <span aria-hidden='true'>{cabin.beds}</span>
                    </span>
                </div>

                <p className='line-clamp-2 border-t border-border pt-3 text-sm text-muted-foreground/80'>
                    {cabin.shortDescription}
                </p>

                {visibleAmenities && visibleAmenities.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                        {visibleAmenities.map((amenity) => {
                            const Icon = AMENITY_ICON_BY_KEY[amenity.icon];

                            return (
                                <span
                                    key={amenity._id}
                                    className='flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground'
                                >
                                    {Icon && <Icon className='size-3' aria-hidden='true' />}
                                    {amenity.name}
                                </span>
                            );
                        })}
                        {hiddenAmenityCount > 0 && (
                            <span className='flex items-center rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground'>
                                +{hiddenAmenityCount} more
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Link
                    href={APP_ROUTES.cabinDetails(cabin.slug) as Route}
                    className='text-sm font-medium text-foreground underline underline-offset-4'
                >
                    View Cabin
                </Link>
            </CardFooter>
        </Card>
    );
}
