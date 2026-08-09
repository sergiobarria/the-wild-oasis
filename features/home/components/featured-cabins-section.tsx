'use client';

import Link from 'next/link';

import { useQuery } from 'convex/react';

import { CabinCard } from '@/components/cabin-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { APP_ROUTES } from '@/lib/routes';

const FEATURED_CABIN_COUNT = 6;

export function FeaturedCabinsSection() {
    const result = useQuery(api.cabins.listPublished, {
        paginationOpts: { numItems: FEATURED_CABIN_COUNT, cursor: null },
        featuredOnly: true,
    });

    return (
        <section className='mx-auto max-w-6xl px-6 py-16 lg:px-8'>
            <div className='mx-auto max-w-2xl space-y-2 text-center'>
                <h2 className='font-heading text-3xl font-medium text-balance sm:text-4xl'>
                    Featured Cabins
                </h2>
                <p className='text-muted-foreground'>A few of the cabins guests return to most.</p>
            </div>

            {result === undefined && (
                <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: FEATURED_CABIN_COUNT }, (_, index) => (
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

            {result !== undefined && result.page.length === 0 && (
                <div className='mt-12 space-y-3 text-center'>
                    <p className='text-muted-foreground'>No featured cabins yet.</p>
                    <Link
                        href={APP_ROUTES.CABINS}
                        className='text-sm font-medium text-foreground underline underline-offset-4'
                    >
                        Browse all cabins
                    </Link>
                </div>
            )}

            {result !== undefined && result.page.length > 0 && (
                <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {result.page.map((cabin) => (
                        <CabinCard key={cabin._id} cabin={cabin} featured />
                    ))}
                </div>
            )}
        </section>
    );
}
