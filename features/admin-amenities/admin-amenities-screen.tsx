'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

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
import { AMENITY_ICON_BY_KEY } from '@/lib/amenity-icons';

import { AMENITY_CATEGORY_LABELS } from './amenities-domain';
import { type AdminAmenity, AmenityFormDialog } from './components/amenity-form-dialog';

function errorToastMessage(thrown: unknown, fallback: string): string {
    return thrown instanceof ConvexError && typeof thrown.data === 'string'
        ? thrown.data
        : fallback;
}

function AmenityActions({ amenity, onEdit }: { amenity: AdminAmenity; onEdit: () => void }) {
    const adminDeleteAmenity = useMutation(api.amenities.adminDeleteAmenity);
    const [confirmingRemove, setConfirmingRemove] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleDelete() {
        setPending(true);
        try {
            await adminDeleteAmenity({ amenityId: amenity._id });
            toast.success('Amenity deleted');
        } catch (thrown) {
            toast.error(errorToastMessage(thrown, 'Something went wrong deleting this amenity.'));
        } finally {
            setPending(false);
            setConfirmingRemove(false);
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
                    onClick={handleDelete}
                >
                    Confirm delete
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
            <Button type='button' variant='outline' size='sm' onClick={onEdit}>
                Edit
            </Button>
            <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setConfirmingRemove(true)}
            >
                Delete
            </Button>
        </div>
    );
}

type DialogState = { mode: 'create' } | { mode: 'edit'; amenity: AdminAmenity };

export function AdminAmenitiesScreen() {
    const amenities = useQuery(api.amenities.adminListAmenities);
    const [dialogState, setDialogState] = useState<DialogState | null>(null);

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-heading text-2xl font-medium'>Amenities</h1>
                <Button type='button' onClick={() => setDialogState({ mode: 'create' })}>
                    New amenity
                </Button>
            </div>

            {amenities === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-12 w-full rounded-lg' />
                    ))}
                </div>
            ) : amenities.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No amenities yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {amenities.map((amenity) => {
                            const Icon = AMENITY_ICON_BY_KEY[amenity.icon];

                            return (
                                <TableRow key={amenity._id}>
                                    <TableCell>
                                        {Icon && (
                                            <Icon
                                                className='size-4 text-muted-foreground'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className='font-medium'>{amenity.name}</TableCell>
                                    <TableCell>
                                        {AMENITY_CATEGORY_LABELS[amenity.category]}
                                    </TableCell>
                                    <TableCell>
                                        <AmenityActions
                                            amenity={amenity}
                                            onEdit={() => setDialogState({ mode: 'edit', amenity })}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}

            <AmenityFormDialog
                open={dialogState !== null}
                onOpenChange={(open) => {
                    if (!open) setDialogState(null);
                }}
                amenity={dialogState?.mode === 'edit' ? dialogState.amenity : undefined}
            />
        </div>
    );
}
