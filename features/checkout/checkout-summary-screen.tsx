import Image from 'next/image';

import type { FunctionReturnType } from 'convex/server';
import { MapPin } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { api } from '@/convex/_generated/api';
import { violationMessage } from '@/features/availability/violation-messages';
import { formatCents } from '@/lib/money';

import { pricingBreakdown } from './checkout-domain';
import { CheckoutConfirmAction } from './components/checkout-confirm-action';

type Cabin = NonNullable<FunctionReturnType<typeof api.cabins.getById>>;
type Availability = FunctionReturnType<typeof api.reservations.checkAvailability>;

type CheckoutSummaryScreenProps = {
    cabin: Cabin;
    checkIn: string;
    checkOut: string;
    guests: number;
    availability: Availability;
    stripePaymentsEnabled: boolean;
    guestName: string;
    guestEmail: string;
};

export function CheckoutSummaryScreen({
    cabin,
    checkIn,
    checkOut,
    guests,
    availability,
    stripePaymentsEnabled,
    guestName,
    guestEmail,
}: CheckoutSummaryScreenProps) {
    const pricing = pricingBreakdown({
        nightlyRate: cabin.nightlyRate,
        cleaningFee: cabin.cleaningFee,
        checkIn,
        checkOut,
    });

    return (
        <div className='space-y-8'>
            <h1 className='font-heading text-3xl font-medium'>Checkout</h1>

            <Card>
                <CardContent className='space-y-4'>
                    <div className='flex gap-4'>
                        {cabin.coverImageUrl && (
                            <div className='relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-lg'>
                                <Image
                                    src={cabin.coverImageUrl}
                                    alt=''
                                    fill
                                    className='object-cover'
                                    sizes='112px'
                                />
                            </div>
                        )}
                        <div className='space-y-1'>
                            <h2 className='font-heading text-lg font-medium'>{cabin.name}</h2>
                            <p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                                <MapPin className='size-4' aria-hidden='true' />
                                {cabin.location}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                {checkIn} &rarr; {checkOut} &middot; {guests}{' '}
                                {guests === 1 ? 'guest' : 'guests'}
                            </p>
                        </div>
                    </div>

                    <div className='space-y-1 border-t border-border pt-4 text-sm'>
                        <div className='flex justify-between text-muted-foreground'>
                            <span>
                                {formatCents(cabin.nightlyRate)} &times; {pricing.nights}{' '}
                                {pricing.nights === 1 ? 'night' : 'nights'}
                            </span>
                            <span>{formatCents(pricing.nightlySubtotal)}</span>
                        </div>
                        <div className='flex justify-between text-muted-foreground'>
                            <span>Cleaning fee</span>
                            <span>{formatCents(pricing.cleaningFee)}</span>
                        </div>
                        <div className='flex justify-between border-t border-border pt-2 font-medium text-foreground'>
                            <span>Total</span>
                            <span>{formatCents(pricing.total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className='space-y-1 text-sm'>
                    <h2 className='font-heading text-lg font-medium'>Guest info</h2>
                    <p className='text-muted-foreground'>{guestName}</p>
                    <p className='text-muted-foreground'>{guestEmail}</p>
                </CardContent>
            </Card>

            {!availability.available && (
                <ul className='space-y-1 text-sm text-destructive'>
                    {availability.violations.map((violation) => (
                        <li key={violation.code}>{violationMessage(violation)}</li>
                    ))}
                </ul>
            )}

            <CheckoutConfirmAction
                cabinId={cabin._id}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                canConfirm={availability.available}
                stripePaymentsEnabled={stripePaymentsEnabled}
            />
        </div>
    );
}
