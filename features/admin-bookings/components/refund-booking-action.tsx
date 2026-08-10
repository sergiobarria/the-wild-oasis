'use client';

import { useEffect, useRef, useState } from 'react';

import { useAction } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

/**
 * Full-amount refund only, no partial refunds (spec's explicit non-goal). Same inline
 * two-step confirm shape as `CancelBookingAction` -- a consequential, irreversible action
 * rendered inside the booking detail dialog, so a nested `Dialog` would stack awkwardly.
 * Deliberately separate from cancellation: refunding never touches `status` (spec §47).
 */
export function RefundBookingAction({
    reservationId,
    paymentStatus,
}: {
    reservationId: string;
    paymentStatus: 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded';
}) {
    const adminRefundReservation = useAction(api.stripeActions.adminRefundReservation);
    const [confirming, setConfirming] = useState(false);
    const [refunding, setRefunding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Same unmount-guard as CancelBookingAction -- the parent dialog can close mid-flight.
    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    if (paymentStatus !== 'paid') return null;

    async function handleRefund() {
        setError(null);
        setRefunding(true);

        try {
            await adminRefundReservation({ reservationId });
            toast.success('Payment refunded');
            if (mountedRef.current) setConfirming(false);
        } catch (thrown) {
            if (mountedRef.current) {
                setError(
                    thrown instanceof ConvexError && typeof thrown.data === 'string'
                        ? thrown.data
                        : 'Something went wrong refunding this payment. Please try again.',
                );
            }
        } finally {
            if (mountedRef.current) setRefunding(false);
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
                    Refund this payment in full via Stripe?
                </p>
                <div className='flex gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        className='flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive'
                        onClick={handleRefund}
                        disabled={refunding}
                    >
                        {refunding ? 'Refunding…' : 'Confirm refund'}
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='flex-1'
                        onClick={() => {
                            setError(null);
                            setConfirming(false);
                        }}
                        disabled={refunding}
                    >
                        Keep payment
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={() => {
                setError(null);
                setConfirming(true);
            }}
        >
            Refund payment
        </Button>
    );
}
