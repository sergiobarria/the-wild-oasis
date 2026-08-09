'use client';

import { useState } from 'react';

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
import { guestOptionsFor } from '@/lib/guest-options';
import { formatCents, formatNightlyRate } from '@/lib/money';

import { calculateTotalCents, nightsBetween } from '../cabin-detail-domain';

type CabinBookingPanelProps = {
    cabinId: Id<'cabins'>;
    nightlyRate: number;
    cleaningFee: number;
    maxGuests: number;
};

export function CabinBookingPanel({
    cabinId,
    nightlyRate,
    cleaningFee,
    maxGuests,
}: CabinBookingPanelProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('1');
    const [today] = useState(() => new Date().toISOString().slice(0, 10));

    const nights = nightsBetween(checkIn, checkOut);
    const total = calculateTotalCents(nightlyRate, cleaningFee, nights);
    const guestOptions = guestOptionsFor(maxGuests);

    const availability = useQuery(
        api.reservations.checkAvailability,
        nights > 0 ? { cabinId, checkIn, checkOut, guests: Number(guests), now: today } : 'skip',
    );

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

                <div className='space-y-1.5'>
                    {/* Checkout (WO-028+) doesn't exist yet -- same honest scope-limiting as the
                        home widget and the /cabins listing's date fields. */}
                    <Button type='button' className='w-full' disabled>
                        Reserve
                    </Button>
                    <p className='text-center text-xs text-muted-foreground'>
                        Checkout coming soon.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
