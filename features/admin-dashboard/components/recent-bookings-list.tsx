'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import type { FunctionReturnType } from 'convex/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { api } from '@/convex/_generated/api';
import { ReservationStatusBadge } from '@/features/guest-area/components/reservation-status-badge';
import { formatCents } from '@/lib/money';
import { adminBookingHref } from '@/lib/routes';

type RecentBooking = FunctionReturnType<
    typeof api.reservations.adminGetStats
>['recentBookings'][number];

/** Opens each row directly into the admin bookings screen's detail dialog (WO-047) via the
 *  same `reservationId` search param it reads -- same pattern as the guest-area equivalent. */
export function AdminRecentBookingsList({ bookings }: { bookings: RecentBooking[] }) {
    const router = useRouter();

    if (bookings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className='text-base'>Recent bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>No bookings yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>Recent bookings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                {bookings.map((booking) => (
                    <button
                        key={booking._id}
                        type='button'
                        onClick={() => router.push(adminBookingHref(booking._id) as Route)}
                        className='flex w-full items-center justify-between gap-4 rounded-md text-left text-sm transition-colors hover:bg-secondary/50'
                    >
                        <div className='min-w-0'>
                            <p className='truncate font-medium'>{booking.guestName}</p>
                            <p className='truncate text-muted-foreground'>
                                {booking.cabinName} · {booking.checkIn} &rarr; {booking.checkOut}
                            </p>
                        </div>
                        <div className='flex shrink-0 items-center gap-3'>
                            <span className='font-medium'>{formatCents(booking.total)}</span>
                            <ReservationStatusBadge status={booking.status} />
                        </div>
                    </button>
                ))}
            </CardContent>
        </Card>
    );
}
