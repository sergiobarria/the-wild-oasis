'use client';

import Link from 'next/link';

import { useMutation, usePaginatedQuery } from 'convex/react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { formatNightlyRate } from '@/lib/money';
import { adminCabinEditHref, APP_ROUTES } from '@/lib/routes';

function PublishToggle({ cabinId, published }: { cabinId: string; published: boolean }) {
    const adminSetPublished = useMutation(api.cabins.adminSetPublished);

    async function handleToggle() {
        try {
            await adminSetPublished({
                cabinId: cabinId as never,
                published: !published,
            });
        } catch {
            toast.error('Something went wrong updating this cabin.');
        }
    }

    return (
        <Button type='button' variant='outline' size='sm' onClick={handleToggle}>
            {published ? 'Unpublish' : 'Publish'}
        </Button>
    );
}

const CABINS_PAGE_SIZE = 25;

export function AdminCabinsScreen() {
    const { results, status, isLoading, loadMore } = usePaginatedQuery(
        api.cabins.adminListCabins,
        {},
        { initialNumItems: CABINS_PAGE_SIZE },
    );

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-heading text-2xl font-medium'>Cabins</h1>
                <Button render={<Link href={APP_ROUTES.ADMIN_CABIN_NEW} />}>New cabin</Button>
            </div>

            {status === 'LoadingFirstPage' ? (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-12 w-full rounded-lg' />
                    ))}
                </div>
            ) : results.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No cabins yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Nightly rate</TableHead>
                            <TableHead>Max guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((cabin) => (
                            <TableRow key={cabin._id}>
                                <TableCell>
                                    <Link
                                        href={adminCabinEditHref(cabin._id) as never}
                                        className='font-medium underline-offset-4 hover:underline'
                                    >
                                        {cabin.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatNightlyRate(cabin.nightlyRate)}</TableCell>
                                <TableCell>{cabin.maxGuests}</TableCell>
                                <TableCell>
                                    <Badge variant={cabin.published ? 'default' : 'secondary'}>
                                        {cabin.published ? 'Published' : 'Draft'}
                                    </Badge>
                                    {cabin.featured && (
                                        <Badge variant='outline' className='ml-1'>
                                            Featured
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <PublishToggle
                                        cabinId={cabin._id}
                                        published={cabin.published}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {status === 'CanLoadMore' && (
                <Button
                    type='button'
                    variant='outline'
                    disabled={isLoading}
                    onClick={() => loadMore(CABINS_PAGE_SIZE)}
                >
                    Load more
                </Button>
            )}
        </div>
    );
}
