import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BookingsScreen } from './bookings-screen';
import type { ReservationSummary } from './components/reservation-row';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const setReservationId = vi.fn();

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('nuqs', () => ({ useQueryState: () => [null, setReservationId] }));

function reservation(overrides: Partial<ReservationSummary> = {}): ReservationSummary {
    return {
        _id: 'reservation-1' as never,
        cabinName: 'Pine Ridge Cabin',
        cabinSlug: 'pine-ridge-cabin',
        coverImageUrl: null,
        checkIn: '2099-01-15',
        checkOut: '2099-01-18',
        guests: 2,
        status: 'confirmed',
        paymentStatus: 'not_required',
        paymentRequired: false,
        pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
        createdAt: 0,
        ...overrides,
    };
}

describe('BookingsScreen', () => {
    beforeEach(() => {
        setReservationId.mockClear();
    });

    it('shows the empty state for a guest with no reservations', () => {
        useQuery.mockReturnValue([]);
        render(<BookingsScreen />);

        expect(
            screen.getByText('No stays yet. Your next escape could be closer than you think.'),
        ).toBeInTheDocument();
    });

    it('groups reservations into Upcoming, Past, and Cancelled sections', () => {
        useQuery.mockReturnValue([
            reservation({ _id: 'upcoming-1' as never }),
            reservation({
                _id: 'past-1' as never,
                checkIn: '2020-01-01',
                checkOut: '2020-01-05',
            }),
            reservation({ _id: 'cancelled-1' as never, status: 'cancelled' }),
        ]);
        render(<BookingsScreen />);

        expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Past' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Cancelled' })).toBeInTheDocument();
        expect(screen.getAllByText('Pine Ridge Cabin')).toHaveLength(3);
    });

    it('omits empty groups entirely', () => {
        useQuery.mockReturnValue([reservation()]);
        render(<BookingsScreen />);

        expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Past' })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Cancelled' })).not.toBeInTheDocument();
    });

    it('opens the detail dialog for the clicked reservation', async () => {
        useQuery.mockReturnValue([reservation()]);
        const user = userEvent.setup();
        render(<BookingsScreen />);

        await user.click(screen.getByText('Pine Ridge Cabin'));

        expect(setReservationId).toHaveBeenCalledWith('reservation-1');
    });
});
