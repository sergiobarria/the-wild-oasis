import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminHomeScreen } from './admin-home-screen';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const push = vi.fn();

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

function stats(overrides: Partial<ReturnType<typeof baseStats>> = {}) {
    return { ...baseStats(), ...overrides };
}

type RecentBooking = {
    _id: string;
    cabinName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    total: number;
    createdAt: number;
};

function baseStats() {
    return {
        totalBookings: 12,
        upcomingReservations: 3,
        revenueCents: 150000,
        occupancy: { bookedCabinNights: 15, availableCabinNights: 60, occupancyRate: 0.25 },
        unreadMessages: 2,
        bookingsOverTime: [] as { date: string; count: number }[],
        revenueOverTime: [] as { date: string; cents: number }[],
        reservationsByCabin: [] as { cabinName: string; count: number }[],
        recentBookings: [] as RecentBooking[],
    };
}

describe('AdminHomeScreen', () => {
    beforeEach(() => {
        useQuery.mockReset();
    });

    it('shows a loading skeleton while stats are undefined', () => {
        useQuery.mockReturnValue(undefined);

        render(<AdminHomeScreen />);

        expect(screen.queryByText('Total bookings')).not.toBeInTheDocument();
    });

    it('renders all 5 KPI cards with formatted values', () => {
        useQuery.mockReturnValue(stats());

        render(<AdminHomeScreen />);

        expect(screen.getByText('Total bookings')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('Upcoming reservations')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Revenue')).toBeInTheDocument();
        expect(screen.getByText('$1,500')).toBeInTheDocument();
        expect(screen.getByText('Occupancy')).toBeInTheDocument();
        expect(screen.getByText('25%')).toBeInTheDocument();
        expect(screen.getByText('Unread messages')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders the analytics charts and recent bookings list', () => {
        useQuery.mockReturnValue(
            stats({
                recentBookings: [
                    {
                        _id: 'reservation-1',
                        cabinName: 'Pine Ridge Cabin',
                        guestName: 'Jamie Alder',
                        checkIn: '2026-08-05',
                        checkOut: '2026-08-08',
                        status: 'confirmed',
                        total: 78500,
                        createdAt: 0,
                    },
                ],
            }),
        );

        render(<AdminHomeScreen />);

        expect(screen.getByText('Bookings over time')).toBeInTheDocument();
        expect(screen.getByText('Revenue over time')).toBeInTheDocument();
        expect(screen.getByText('Reservations by cabin')).toBeInTheDocument();
        expect(screen.getByText('Recent bookings')).toBeInTheDocument();
        expect(screen.getByText('Jamie Alder')).toBeInTheDocument();
    });

    it('shows an empty-state message when there are no recent bookings', () => {
        useQuery.mockReturnValue(stats());

        render(<AdminHomeScreen />);

        expect(screen.getByText('No bookings yet.')).toBeInTheDocument();
    });
});
