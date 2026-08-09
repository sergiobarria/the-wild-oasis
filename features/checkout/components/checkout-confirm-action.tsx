'use client';

import { useState } from 'react';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { checkoutSuccessHref } from '@/lib/routes';

type CheckoutConfirmActionProps = {
    cabinId: Id<'cabins'>;
    checkIn: string;
    checkOut: string;
    guests: number;
    /** Server-re-validated at page render (WO-033) -- dates can go stale between the booking
     *  panel's last check and landing here (e.g. someone else booked in the meantime). */
    canConfirm: boolean;
    stripePaymentsEnabled: boolean;
};

/** Kept as its own client leaf so the checkout summary page's read-only rendering (cabin,
 *  dates, pricing) can stay a server component, same split as `cabin-detail-screen.tsx` /
 *  `CabinBookingPanel`. */
export function CheckoutConfirmAction({
    cabinId,
    checkIn,
    checkOut,
    guests,
    canConfirm,
    stripePaymentsEnabled,
}: CheckoutConfirmActionProps) {
    const router = useRouter();
    const createDemoReservation = useMutation(api.reservations.createDemoReservation);
    const [error, setError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);

    async function handleConfirm() {
        setError(null);
        setConfirming(true);

        try {
            const { reservationId } = await createDemoReservation({
                cabinId,
                checkIn,
                checkOut,
                guests,
            });
            router.push(checkoutSuccessHref(reservationId) as Route);
        } catch (thrown) {
            setError(
                thrown instanceof ConvexError && typeof thrown.data === 'string'
                    ? thrown.data
                    : 'Something went wrong confirming your reservation. Please try again.',
            );
            setConfirming(false);
        }
    }

    if (stripePaymentsEnabled) {
        return (
            <div className='space-y-1.5'>
                <Button type='button' className='w-full' disabled>
                    Pay &amp; Confirm
                </Button>
                <p className='text-center text-xs text-muted-foreground'>
                    Card payments are coming soon.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-1.5'>
            {error && <p className='text-sm text-destructive'>{error}</p>}
            <Button
                type='button'
                className='w-full'
                disabled={!canConfirm || confirming}
                onClick={handleConfirm}
            >
                {confirming ? 'Confirming…' : 'Confirm Reservation'}
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
                Payments are disabled in this demo -- confirming won&apos;t charge you anything.
            </p>
        </div>
    );
}
