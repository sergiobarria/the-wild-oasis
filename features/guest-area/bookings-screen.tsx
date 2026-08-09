'use client';

import { useQuery } from 'convex/react';
import { useQueryState } from 'nuqs';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { todayIsoDate } from '@/lib/dates';

import { GuestAreaEmptyState } from './components/guest-area-empty-state';
import { ReservationDetailDialog } from './components/reservation-detail-dialog';
import { ReservationRow, type ReservationSummary } from './components/reservation-row';
import { groupReservation, type ReservationGroup } from './reservations-grouping';

const SECTION_ORDER: ReservationGroup[] = ['upcoming', 'past', 'cancelled'];
const SECTION_LABELS: Record<ReservationGroup, string> = {
    upcoming: 'Upcoming',
    past: 'Past',
    cancelled: 'Cancelled',
};

function groupReservations(reservations: ReservationSummary[], today: string) {
    return SECTION_ORDER.map((group) => ({
        group,
        items: reservations.filter((reservation) => groupReservation(reservation, today) === group),
    })).filter(({ items }) => items.length > 0);
}

export function BookingsScreen() {
    const reservations = useQuery(api.reservations.listOwnReservations, {});
    const [reservationId, setReservationId] = useQueryState('reservationId');

    return (
        <div className='space-y-8'>
            <h1 className='font-heading text-2xl font-medium'>Bookings</h1>

            {reservations === undefined && (
                <div className='space-y-2'>
                    {Array.from({ length: 3 }, (_, index) => (
                        <Skeleton key={index} className='h-20 w-full rounded-lg' />
                    ))}
                </div>
            )}

            {reservations !== undefined && reservations.length === 0 && <GuestAreaEmptyState />}

            {reservations !== undefined && reservations.length > 0 && (
                <>
                    {groupReservations(reservations, todayIsoDate()).map(({ group, items }) => (
                        <section key={group} className='space-y-3'>
                            <h2 className='font-heading text-lg font-medium'>
                                {SECTION_LABELS[group]}
                            </h2>
                            <div className='space-y-2'>
                                {items.map((reservation) => (
                                    <ReservationRow
                                        key={reservation._id}
                                        reservation={reservation}
                                        onOpen={() => setReservationId(reservation._id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}

                    <ReservationDetailDialog
                        reservation={
                            reservations.find((reservation) => reservation._id === reservationId) ??
                            null
                        }
                        onClose={() => setReservationId(null)}
                    />
                </>
            )}
        </div>
    );
}
