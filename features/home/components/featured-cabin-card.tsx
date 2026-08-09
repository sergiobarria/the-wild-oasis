import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { FunctionReturnType } from 'convex/server';
import { Bed, BedDouble, MapPin, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { api } from '@/convex/_generated/api';
import { formatNightlyRate } from '@/lib/money';
import { APP_ROUTES } from '@/lib/routes';

type Cabin = FunctionReturnType<typeof api.cabins.listPublished>['page'][number];

/**
 * Set apart from a future plain `/cabins` listing card (WO-022) -- a gold
 * ring plus a "Featured" badge, so this section still reads as curated once
 * a generic card exists to compare it against.
 */
export function FeaturedCabinCard({ cabin }: { cabin: Cabin }) {
    return (
        <Card className='overflow-hidden ring-primary/30'>
            <div className='relative -mt-(--card-spacing) aspect-4/3 overflow-hidden rounded-t-xl'>
                <Image
                    src={cabin.coverImageUrl ?? '/assets/placeholder.jpg'}
                    alt=''
                    fill
                    sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                    className='object-cover'
                />
                <Badge className='absolute top-3 left-3'>Featured</Badge>
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
