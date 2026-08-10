import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminHomeScreen } from './admin-home-screen';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.mock('convex/react', () => ({ useQuery }));

function stats(overrides: Partial<ReturnType<typeof baseStats>> = {}) {
    return { ...baseStats(), ...overrides };
}

function baseStats() {
    return {
        totalBookings: 12,
        upcomingReservations: 3,
        revenueCents: 150000,
        occupancy: { bookedCabinNights: 15, availableCabinNights: 60, occupancyRate: 0.25 },
        unreadMessages: 2,
        bookingsOverTime: [],
        revenueOverTime: [],
        reservationsByCabin: [],
        recentBookings: [],
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
});
