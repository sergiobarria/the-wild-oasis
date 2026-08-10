'use client';

import { useQuery } from 'convex/react';
import { useQueryState, useQueryStates } from 'nuqs';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

import { adminBookingFilterParsers, buildAdminBookingsQueryArgs } from './admin-bookings-domain';
import { BookingDetailDialog } from './components/booking-detail-dialog';
import { BookingFilters } from './components/booking-filters';
import { BookingsTable } from './components/bookings-table';

export function AdminBookingsScreen() {
    const [filters] = useQueryStates(adminBookingFilterParsers);
    const [reservationId, setReservationId] = useQueryState('reservationId');
    const queryArgs = buildAdminBookingsQueryArgs(filters);

    const bookings = useQuery(api.reservations.adminListReservations, {
        ...queryArgs,
        cabinId: queryArgs.cabinId as Id<'cabins'> | undefined,
    });

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Bookings</h1>

            <BookingFilters />

            {bookings === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Skeleton key={index} className='h-12 w-full rounded-lg' />
                    ))}
                </div>
            ) : (
                <BookingsTable bookings={bookings} onOpen={setReservationId} />
            )}

            <BookingDetailDialog
                reservationId={reservationId}
                onClose={() => setReservationId(null)}
            />
        </div>
    );
}
