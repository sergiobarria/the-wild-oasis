'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

/** Operational, not one of the cabin form's Basic/Pricing/Amenities/Images tabs (WO-051) --
 *  blocks are calendar management, not cabin data, so they render as a section below the
 *  tabs rather than crowding a fifth tab in. */
export function CabinAvailabilityBlocks({ cabinId }: { cabinId: Id<'cabins'> }) {
    const blocks = useQuery(api.availabilityBlocks.adminListBlocks, { cabinId });
    const adminCreateBlock = useMutation(api.availabilityBlocks.adminCreateBlock);
    const adminDeleteBlock = useMutation(api.availabilityBlocks.adminDeleteBlock);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleCreate(event: React.FormEvent) {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await adminCreateBlock({ cabinId, startDate, endDate, reason });
            setStartDate('');
            setEndDate('');
            setReason('');
            toast.success('Availability block added');
        } catch (thrown) {
            setError(
                thrown instanceof ConvexError && typeof thrown.data === 'string'
                    ? thrown.data
                    : 'Something went wrong adding this block. Please try again.',
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(blockId: Id<'availabilityBlocks'>) {
        try {
            await adminDeleteBlock({ blockId });
        } catch {
            toast.error('Something went wrong removing this block.');
        }
    }

    return (
        <div className='space-y-4 border-t border-border pt-6'>
            <h2 className='font-heading text-lg font-medium'>Availability blocks</h2>
            <p className='text-sm text-muted-foreground'>
                Block dates for maintenance or other reasons -- guests can&apos;t book overlapping
                dates.
            </p>

            {blocks === undefined ? (
                <p className='text-sm text-muted-foreground'>Loading…</p>
            ) : blocks.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No blocks yet.</p>
            ) : (
                <ul className='space-y-2'>
                    {blocks.map((block) => (
                        <li
                            key={block._id}
                            className='flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm'
                        >
                            <span>
                                {block.startDate} &rarr; {block.endDate} &middot; {block.reason}
                            </span>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDelete(block._id)}
                            >
                                Remove
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleCreate} className='grid gap-4 sm:grid-cols-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='block-start'>Start date</Label>
                    <Input
                        id='block-start'
                        type='date'
                        required
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                    />
                </div>
                <div className='space-y-1.5'>
                    <Label htmlFor='block-end'>End date</Label>
                    <Input
                        id='block-end'
                        type='date'
                        required
                        min={startDate || undefined}
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                    />
                </div>
                <div className='space-y-1.5 sm:col-span-2'>
                    <Label htmlFor='block-reason'>Reason</Label>
                    <Input
                        id='block-reason'
                        required
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                    />
                </div>
                {error && (
                    <p role='alert' className='text-sm text-destructive sm:col-span-4'>
                        {error}
                    </p>
                )}
                <Button type='submit' disabled={submitting} className='sm:col-span-4 sm:w-fit'>
                    {submitting ? 'Adding…' : 'Add block'}
                </Button>
            </form>
        </div>
    );
}
