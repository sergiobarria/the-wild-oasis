'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { APP_ROUTES, guestBookingHref } from '@/lib/routes';

import { ReservationRow, type ReservationSummary } from './reservation-row';

const RECENT_BOOKINGS_COUNT = 5;

/** Opens each row directly into the Bookings screen's detail dialog (same `reservationId`
 *  search param BookingsScreen reads) rather than duplicating the dialog here. */
export function RecentBookingsList({ reservations }: { reservations: ReservationSummary[] }) {
    const router = useRouter();
    const recent = reservations.slice(0, RECENT_BOOKINGS_COUNT);

    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between'>
                <h2 className='font-heading text-lg font-medium'>Recent Bookings</h2>
                <Link
                    href={APP_ROUTES.GUEST_AREA_BOOKINGS}
                    className='text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground'
                >
                    View all
                </Link>
            </div>
            <div className='space-y-2'>
                {recent.map((reservation) => (
                    <ReservationRow
                        key={reservation._id}
                        reservation={reservation}
                        onOpen={() => router.push(guestBookingHref(reservation._id) as Route)}
                    />
                ))}
            </div>
        </div>
    );
}
