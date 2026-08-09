'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { canSelfCancel } from '@/convex/lib/cancellation';

import type { ReservationSummary } from './reservation-row';

/**
 * `canSelfCancel` is called here purely to decide *what to render* (button vs. an
 * explanatory disabled state) -- never as the authorization boundary. The
 * `cancelReservation` mutation re-checks the same rule server-side regardless
 * (docs/02_CODING_GUIDELINES.md §14: client checks are never trusted).
 *
 * Copy discipline (spec §47): the action always says "Cancel reservation," never
 * "refund" -- refunds aren't implemented, and conflating the two is the exact failure
 * mode the spec calls out.
 */
export function CancelReservationAction({ reservation }: { reservation: ReservationSummary }) {
    const cancelReservation = useMutation(api.reservations.cancelReservation);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    const check = canSelfCancel({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
        paymentRequired: reservation.paymentRequired,
        now: new Date(),
    });

    // Nothing to show for a reservation that isn't a live, upcoming stay -- no cancel
    // action belongs on an already-cancelled or past reservation's detail view.
    if (
        !check.allowed &&
        (check.reason === 'already-cancelled' || check.reason === 'not-upcoming')
    ) {
        return null;
    }

    async function handleCancel() {
        setError(null);
        setCancelling(true);

        try {
            await cancelReservation({ reservationId: reservation._id });
            toast.success('Reservation cancelled');
        } catch (thrown) {
            setError(
                thrown instanceof ConvexError && typeof thrown.data === 'string'
                    ? thrown.data
                    : 'Something went wrong cancelling your reservation. Please try again.',
            );
        } finally {
            // Reset even on success: the reactive `listOwnReservations` query updating and
            // hiding this action (via `canSelfCancel`'s `already-cancelled` check) is what
            // normally removes the button, but that re-render isn't guaranteed to happen
            // before this component's next render -- leaving `cancelling` stuck `true` would
            // leave the button permanently disabled if it doesn't.
            setCancelling(false);
        }
    }

    if (!check.allowed) {
        const message =
            check.reason === 'requires-admin'
                ? 'This reservation requires admin assistance to cancel.'
                : 'Cancellation is only available more than 48 hours before check-in.';

        return <p className='text-xs text-muted-foreground'>{message}</p>;
    }

    return (
        <div className='space-y-2'>
            {error && (
                <p role='alert' className='text-sm text-destructive'>
                    {error}
                </p>
            )}
            <Button
                type='button'
                variant='outline'
                className='w-full text-destructive hover:bg-destructive/10 hover:text-destructive'
                onClick={handleCancel}
                disabled={cancelling}
            >
                {cancelling ? 'Cancelling…' : 'Cancel reservation'}
            </Button>
        </div>
    );
}
