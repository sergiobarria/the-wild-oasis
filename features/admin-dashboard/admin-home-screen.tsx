'use client';

import { useQuery } from 'convex/react';
import {
    CalendarCheckIcon,
    CalendarDaysIcon,
    DollarSignIcon,
    MailIcon,
    PercentIcon,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { todayIsoDate } from '@/lib/dates';
import { formatCents } from '@/lib/money';

import { BookingsOverTimeChart } from './components/bookings-over-time-chart';
import { KpiCard } from './components/kpi-card';
import { RecentBookingsList } from './components/recent-bookings-list';
import { ReservationsByCabinChart } from './components/reservations-by-cabin-chart';
import { RevenueOverTimeChart } from './components/revenue-over-time-chart';

export function AdminHomeScreen() {
    const stats = useQuery(api.reservations.adminGetStats, { now: todayIsoDate() });

    return (
        <div className='space-y-8'>
            <h1 className='font-heading text-2xl font-medium'>Home</h1>

            {stats === undefined ? (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className='h-24 w-full rounded-xl' />
                    ))}
                </div>
            ) : (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                    <KpiCard
                        label='Total bookings'
                        value={stats.totalBookings.toLocaleString('en-US')}
                        icon={CalendarDaysIcon}
                    />
                    <KpiCard
                        label='Upcoming reservations'
                        value={stats.upcomingReservations.toLocaleString('en-US')}
                        icon={CalendarCheckIcon}
                    />
                    <KpiCard
                        label='Revenue'
                        value={formatCents(stats.revenueCents)}
                        icon={DollarSignIcon}
                        hint='Trailing 30 days'
                    />
                    <KpiCard
                        label='Occupancy'
                        value={`${Math.round(stats.occupancy.occupancyRate * 100)}%`}
                        icon={PercentIcon}
                        hint='Trailing 30 days'
                    />
                    <KpiCard
                        label='Unread messages'
                        value={stats.unreadMessages.toLocaleString('en-US')}
                        icon={MailIcon}
                    />
                </div>
            )}

            {stats !== undefined && (
                <>
                    <div className='grid gap-4 lg:grid-cols-2'>
                        <BookingsOverTimeChart data={stats.bookingsOverTime} />
                        <RevenueOverTimeChart data={stats.revenueOverTime} />
                    </div>

                    <div className='grid gap-4 lg:grid-cols-2'>
                        <ReservationsByCabinChart data={stats.reservationsByCabin} />
                        <RecentBookingsList bookings={stats.recentBookings} />
                    </div>
                </>
            )}
        </div>
    );
}
