'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { debounce, useQueryState } from 'nuqs';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Id } from '@/convex/_generated/dataModel';

function SubscriberActions({
    subscriberId,
    status,
}: {
    subscriberId: Id<'subscribers'>;
    status: 'active' | 'unsubscribed';
}) {
    const adminUnsubscribe = useMutation(api.subscribers.adminUnsubscribe);
    const adminRemoveSubscriber = useMutation(api.subscribers.adminRemoveSubscriber);
    const [confirmingRemove, setConfirmingRemove] = useState(false);

    async function handleUnsubscribe() {
        try {
            await adminUnsubscribe({ subscriberId });
        } catch {
            toast.error('Something went wrong updating this subscriber.');
        }
    }

    async function handleRemove() {
        try {
            await adminRemoveSubscriber({ subscriberId });
            toast.success('Subscriber removed');
        } catch {
            toast.error('Something went wrong removing this subscriber.');
        }
    }

    if (confirmingRemove) {
        return (
            <div className='flex justify-end gap-2'>
                <Button type='button' variant='destructive' size='sm' onClick={handleRemove}>
                    Confirm remove
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setConfirmingRemove(false)}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div className='flex justify-end gap-2'>
            {status === 'active' && (
                <Button type='button' variant='outline' size='sm' onClick={handleUnsubscribe}>
                    Unsubscribe
                </Button>
            )}
            <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setConfirmingRemove(true)}
            >
                Remove
            </Button>
        </div>
    );
}

export function AdminSubscribersScreen() {
    const [search, setSearch] = useQueryState('search', { defaultValue: '' });
    const subscribers = useQuery(api.subscribers.adminListSubscribers, {
        search: search || undefined,
    });

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Subscribers</h1>

            <Input
                type='search'
                placeholder='Search by email...'
                value={search}
                onChange={(event) => {
                    const raw = event.target.value;
                    setSearch(raw, { limitUrlUpdates: raw === '' ? undefined : debounce(400) });
                }}
                className='max-w-sm'
            />

            {subscribers === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-12 w-full rounded-lg' />
                    ))}
                </div>
            ) : subscribers.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No subscribers yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.map((subscriber) => (
                            <TableRow key={subscriber._id}>
                                <TableCell>{subscriber.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            subscriber.status === 'active' ? 'default' : 'secondary'
                                        }
                                    >
                                        {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <SubscriberActions
                                        subscriberId={subscriber._id}
                                        status={subscriber.status}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
