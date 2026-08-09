'use client';

import { useQuery } from 'convex/react';
import { useQueryStates } from 'nuqs';

import { CabinCard } from '@/components/cabin-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { dollarsToCents } from '@/lib/money';

import {
    filterParsers,
    hasActiveFilters,
    parseGuests,
    searchControlParsers,
} from '../cabins-domain';

const LOADING_PLACEHOLDER_COUNT = 6;

export function CabinsResults() {
    const [{ guests }] = useQueryStates(searchControlParsers);
    const [filters, setFilters] = useQueryStates(filterParsers);

    const result = useQuery(api.cabins.listFiltered, {
        guests: parseGuests(guests),
        name: filters.search || undefined,
        maxPriceCents: filters.maxPrice !== null ? dollarsToCents(filters.maxPrice) : undefined,
        amenityIds: filters.amenities.length ? (filters.amenities as Id<'amenities'>[]) : undefined,
    });

    const filtersActive = hasActiveFilters(filters);

    return (
        <div>
            {result === undefined && (
                <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: LOADING_PLACEHOLDER_COUNT }, (_, index) => (
                        <Card key={index} className='overflow-hidden'>
                            <Skeleton className='-mt-(--card-spacing) aspect-4/3 rounded-t-xl rounded-b-none' />
                            <div className='space-y-2 px-(--card-spacing)'>
                                <Skeleton className='h-5 w-2/3' />
                                <Skeleton className='h-4 w-1/2' />
                                <Skeleton className='h-4 w-full' />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {result !== undefined && result.length === 0 && (
                <div className='space-y-3 py-16 text-center'>
                    <p className='text-muted-foreground'>
                        {filtersActive
                            ? 'No cabins match your filters.'
                            : 'No cabins published yet.'}
                    </p>
                    {filtersActive && (
                        <Button variant='ghost' size='sm' onClick={() => setFilters(null)}>
                            Clear filters
                        </Button>
                    )}
                </div>
            )}

            {result !== undefined && result.length > 0 && (
                <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {result.map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} amenities={cabin.amenities} />
                    ))}
                </div>
            )}
        </div>
    );
}
