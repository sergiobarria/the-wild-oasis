'use client';

import { useQuery } from 'convex/react';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { todayIsoDate } from '@/lib/dates';
import { splitName } from '@/lib/names';

import { GuestAreaEmptyState } from './components/guest-area-empty-state';
import { RecentBookingsList } from './components/recent-bookings-list';
import { UpcomingStayCard } from './components/upcoming-stay-card';
import { pickUpcomingReservation } from './reservations-grouping';

export function OverviewScreen() {
    const reservations = useQuery(api.reservations.listOwnReservations, {});
    const user = useQuery(api.auth.getCurrentUser, {});
    const { firstName } = splitName(user?.name ?? '');

    const upcoming = reservations
        ? pickUpcomingReservation(reservations, todayIsoDate())
        : undefined;

    return (
        <div className='space-y-8'>
            <h1 className='font-heading text-2xl font-medium'>
                {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </h1>

            {reservations === undefined && (
                <div className='space-y-4'>
                    <Skeleton className='h-24 w-full rounded-lg' />
                    <Skeleton className='h-20 w-full rounded-lg' />
                </div>
            )}

            {reservations !== undefined && reservations.length === 0 && <GuestAreaEmptyState />}

            {reservations !== undefined && reservations.length > 0 && (
                <>
                    {upcoming && (
                        <div className='space-y-3'>
                            <h2 className='font-heading text-lg font-medium'>Upcoming Stay</h2>
                            <UpcomingStayCard reservation={upcoming} />
                        </div>
                    )}

                    <RecentBookingsList
                        reservations={
                            upcoming
                                ? reservations.filter((r) => r._id !== upcoming._id)
                                : reservations
                        }
                    />
                </>
            )}
        </div>
    );
}
