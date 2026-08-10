'use client';

import Link from 'next/link';

import type { Preloaded } from 'convex/react';
import { usePreloadedQuery } from 'convex/react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { api } from '@/convex/_generated/api';
import { formatCents } from '@/lib/money';
import { APP_ROUTES } from '@/lib/routes';

type CheckoutSuccessScreenProps = {
    preloadedReservation: Preloaded<typeof api.reservations.getOwnReservation>;
};

/**
 * Live-subscribes (via `usePreloadedQuery`) rather than a one-shot fetch: a Stripe-paid
 * reservation can land here while still `pending` -- only Stripe's webhook (never this page's
 * own load) ever confirms it (spec §37, WO-060). Seeding from the server-preloaded value means
 * no loading flash on first paint; once the webhook flips the row, this re-renders on its own.
 */
export function CheckoutSuccessScreen({ preloadedReservation }: CheckoutSuccessScreenProps) {
    const reservation = usePreloadedQuery(preloadedReservation);

    // The server page already redirected to notFound() if this were null on first load --
    // reachable here only if the reservation were deleted after that check, an edge case not
    // worth a dedicated UI for.
    if (!reservation) return null;

    const isProcessing = reservation.paymentStatus === 'pending';

    return (
        <div className='space-y-8 text-center'>
            <div className='space-y-2'>
                {isProcessing ? (
                    <Loader2
                        className='mx-auto size-12 animate-spin text-muted-foreground'
                        aria-hidden='true'
                    />
                ) : (
                    <CheckCircle2 className='mx-auto size-12 text-primary' aria-hidden='true' />
                )}
                <h1 className='font-heading text-3xl font-medium'>
                    {isProcessing ? 'Processing your payment…' : 'Reservation confirmed'}
                </h1>
                <p className='text-muted-foreground'>
                    {isProcessing
                        ? "We're waiting for Stripe to confirm your payment -- this page will update automatically."
                        : "You're all set -- we can't wait to host you."}
                </p>
            </div>

            <Card className='text-left'>
                <CardContent className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Reference</span>
                        <span className='font-medium'>{reservation._id}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Cabin</span>
                        <span className='font-medium'>{reservation.cabinName}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Dates</span>
                        <span className='font-medium'>
                            {reservation.checkIn} &rarr; {reservation.checkOut}
                        </span>
                    </div>
                    <div className='flex justify-between border-t border-border pt-2'>
                        <span className='text-muted-foreground'>Total</span>
                        <span className='font-medium'>
                            {formatCents(reservation.pricing.total)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Button render={<Link href={APP_ROUTES.GUEST_AREA} />} nativeButton={false}>
                Go to dashboard
            </Button>
        </div>
    );
}
