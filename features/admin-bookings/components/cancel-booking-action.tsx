'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

/**
 * Unlike the guest-side `CancelReservationAction`, this isn't gated by the 48h window or
 * ownership -- an admin can cancel on a guest's behalf at any time. Still a consequential,
 * irreversible action, so it asks for a second confirming click before calling the mutation
 * (an inline two-step confirm rather than a nested `Dialog`, to avoid stacking dialogs on top
 * of the booking detail dialog this renders inside).
 */
export function CancelBookingAction({
    reservationId,
    status,
}: {
    reservationId: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}) {
    const adminCancelReservation = useMutation(api.reservations.adminCancelReservation);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === 'cancelled') return null;

    async function handleCancel() {
        setError(null);
        setCancelling(true);

        try {
            await adminCancelReservation({ reservationId });
            toast.success('Reservation cancelled');
            setConfirming(false);
        } catch (thrown) {
            setError(
                thrown instanceof ConvexError && typeof thrown.data === 'string'
                    ? thrown.data
                    : 'Something went wrong cancelling this reservation. Please try again.',
            );
        } finally {
            setCancelling(false);
        }
    }

    if (confirming) {
        return (
            <div className='space-y-2'>
                {error && (
                    <p role='alert' className='text-sm text-destructive'>
                        {error}
                    </p>
                )}
                <p className='text-sm text-muted-foreground'>
                    Cancel this reservation on the guest&apos;s behalf?
                </p>
                <div className='flex gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        className='flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive'
                        onClick={handleCancel}
                        disabled={cancelling}
                    >
                        {cancelling ? 'Cancelling…' : 'Confirm cancellation'}
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='flex-1'
                        onClick={() => setConfirming(false)}
                        disabled={cancelling}
                    >
                        Keep reservation
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            type='button'
            variant='outline'
            className='w-full text-destructive hover:bg-destructive/10 hover:text-destructive'
            onClick={() => setConfirming(true)}
        >
            Cancel reservation
        </Button>
    );
}
