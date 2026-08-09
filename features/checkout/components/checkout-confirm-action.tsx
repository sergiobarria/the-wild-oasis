'use client';

import { Button } from '@/components/ui/button';
import type { Id } from '@/convex/_generated/dataModel';

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

/**
 * The actual reservation-creating click (WO-030) is wired up once the mutation exists
 * (Layer 7) -- kept as its own client leaf so this checkout summary page's read-only
 * rendering (cabin, dates, pricing) can stay a server component, same split as
 * `cabin-detail-screen.tsx` / `CabinBookingPanel`.
 */
export function CheckoutConfirmAction({
    canConfirm,
    stripePaymentsEnabled,
}: CheckoutConfirmActionProps) {
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
            <Button type='button' className='w-full' disabled={!canConfirm}>
                Confirm Reservation
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
                Payments are disabled in this demo -- confirming won&apos;t charge you anything.
            </p>
        </div>
    );
}
