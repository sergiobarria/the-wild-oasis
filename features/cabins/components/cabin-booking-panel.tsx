'use client';

import { useState } from 'react';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useQuery } from 'convex/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { violationMessage } from '@/features/availability/violation-messages';
import { todayIsoDate } from '@/lib/dates';
import { guestOptionsFor } from '@/lib/guest-options';
import { formatCents, formatNightlyRate } from '@/lib/money';
import { calculateTotalCents, nightsBetween } from '@/lib/pricing';
import { checkoutSummaryHref, signInHref } from '@/lib/routes';

type CabinBookingPanelProps = {
    cabinId: Id<'cabins'>;
    nightlyRate: number;
    cleaningFee: number;
    maxGuests: number;
    /** Server-computed at page render, same pattern as `Header`'s `role` prop -- this flow
     *  only ever navigates to a fresh page (checkout summary, or sign-in first), so there's
     *  no risk of the value going stale under client-side cache reuse the way a persistent
     *  layout would need to guard against. */
    isAuthenticated: boolean;
};

export function CabinBookingPanel({
    cabinId,
    nightlyRate,
    cleaningFee,
    maxGuests,
    isAuthenticated,
}: CabinBookingPanelProps) {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('1');
    const [today] = useState(() => todayIsoDate());

    const nights = nightsBetween(checkIn, checkOut);
    const total = calculateTotalCents(nightlyRate, cleaningFee, nights);
    const guestOptions = guestOptionsFor(maxGuests);

    const availability = useQuery(
        api.reservations.checkAvailability,
        nights > 0 ? { cabinId, checkIn, checkOut, guests: Number(guests), now: today } : 'skip',
    );
    const canContinue = nights > 0 && availability?.available === true;

    function handleContinue() {
        const summaryHref = checkoutSummaryHref({ cabinId, checkIn, checkOut, guests });

        router.push((isAuthenticated ? summaryHref : signInHref(summaryHref)) as Route);
    }

    return (
        <Card className='lg:sticky lg:top-24'>
            <CardContent className='space-y-4'>
                <p className='text-lg font-semibold text-primary'>
                    {formatNightlyRate(nightlyRate)}
                </p>

                <div className='grid grid-cols-2 gap-2'>
                    <div className='space-y-1.5'>
                        <Label htmlFor='booking-check-in'>Check-in</Label>
                        <Input
                            id='booking-check-in'
                            type='date'
                            min={today}
                            value={checkIn}
                            onChange={(event) => setCheckIn(event.target.value)}
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <Label htmlFor='booking-check-out'>Check-out</Label>
                        <Input
                            id='booking-check-out'
                            type='date'
                            min={checkIn || undefined}
                            value={checkOut}
                            onChange={(event) => setCheckOut(event.target.value)}
                        />
                    </div>
                </div>

                <div className='space-y-1.5'>
                    <Label htmlFor='booking-guests'>Guests</Label>
                    <Select value={guests} onValueChange={(value) => setGuests(value ?? '1')}>
                        <SelectTrigger id='booking-guests' className='w-full'>
                            <SelectValue placeholder='Guests' />
                        </SelectTrigger>
                        <SelectContent>
                            {guestOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option} {option === '1' ? 'guest' : 'guests'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {nights > 0 ? (
                    <div className='space-y-1 border-t border-border pt-4 text-sm'>
                        <div className='flex justify-between text-muted-foreground'>
                            <span>
                                {formatNightlyRate(nightlyRate)} &times; {nights}{' '}
                                {nights === 1 ? 'night' : 'nights'}
                            </span>
                            <span>{formatCents(nightlyRate * nights)}</span>
                        </div>
                        <div className='flex justify-between text-muted-foreground'>
                            <span>Cleaning fee</span>
                            <span>{formatCents(cleaningFee)}</span>
                        </div>
                        <div className='flex justify-between border-t border-border pt-2 font-medium text-foreground'>
                            <span>Total</span>
                            <span>{formatCents(total)}</span>
                        </div>
                    </div>
                ) : (
                    <p className='border-t border-border pt-4 text-sm text-muted-foreground'>
                        Select your dates to see the total.
                    </p>
                )}

                {nights > 0 && availability?.available === false && (
                    <ul className='space-y-1 text-sm text-destructive'>
                        {availability.violations.map((violation) => (
                            <li key={violation.code}>{violationMessage(violation)}</li>
                        ))}
                    </ul>
                )}

                <Button
                    type='button'
                    className='w-full'
                    disabled={!canContinue}
                    onClick={handleContinue}
                >
                    Reserve
                </Button>
            </CardContent>
        </Card>
    );
}
