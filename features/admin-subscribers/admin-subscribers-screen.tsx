'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
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
import type { SubscriberStatus } from '@/convex/lib/subscribers';

function errorToastMessage(thrown: unknown, fallback: string): string {
    return thrown instanceof ConvexError && typeof thrown.data === 'string'
        ? thrown.data
        : fallback;
}

function SubscriberActions({
    subscriberId,
    status,
}: {
    subscriberId: Id<'subscribers'>;
    status: SubscriberStatus;
}) {
    const adminUnsubscribe = useMutation(api.subscribers.adminUnsubscribe);
    const adminRemoveSubscriber = useMutation(api.subscribers.adminRemoveSubscriber);
    const [confirmingRemove, setConfirmingRemove] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleUnsubscribe() {
        setPending(true);
        try {
            await adminUnsubscribe({ subscriberId });
        } catch (thrown) {
            toast.error(
                errorToastMessage(thrown, 'Something went wrong updating this subscriber.'),
            );
        } finally {
            setPending(false);
        }
    }

    async function handleRemove() {
        setPending(true);
        try {
            await adminRemoveSubscriber({ subscriberId });
            toast.success('Subscriber removed');
        } catch (thrown) {
            toast.error(
                errorToastMessage(thrown, 'Something went wrong removing this subscriber.'),
            );
        } finally {
            setPending(false);
        }
    }

    if (confirmingRemove) {
        return (
            <div className='flex justify-end gap-2'>
                <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    disabled={pending}
                    onClick={handleRemove}
                >
                    Confirm remove
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    disabled={pending}
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
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={pending}
                    onClick={handleUnsubscribe}
                >
                    Unsubscribe
                </Button>
            )}
            <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={pending}
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
