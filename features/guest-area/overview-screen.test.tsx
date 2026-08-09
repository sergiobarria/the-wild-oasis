import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReservationSummary } from './components/reservation-row';
import { OverviewScreen } from './overview-screen';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const push = vi.fn();

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

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

// OverviewScreen calls useQuery for listOwnReservations first, then getCurrentUser --
// mockReturnValueOnce in that order avoids relying on `api.x.y` reference identity
// surviving the `convex/react` mock boundary.
function mockQueries(reservations: ReservationSummary[] | undefined, userName = 'Jamie Alder') {
    useQuery
        .mockReturnValueOnce(reservations)
        .mockReturnValueOnce({ name: userName, email: 'jamie@example.com' });
}

describe('OverviewScreen', () => {
    beforeEach(() => {
        push.mockClear();
        useQuery.mockReset();
    });

    it('greets the guest by first name', () => {
        mockQueries([]);
        render(<OverviewScreen />);

        expect(screen.getByText('Welcome back, Jamie')).toBeInTheDocument();
    });

    it('shows the empty state for a guest with no reservations', () => {
        mockQueries([]);
        render(<OverviewScreen />);

        expect(
            screen.getByText('No stays yet. Your next escape could be closer than you think.'),
        ).toBeInTheDocument();
    });

    it('shows the upcoming stay card when an upcoming reservation exists', () => {
        mockQueries([reservation()]);
        render(<OverviewScreen />);

        expect(screen.getByText('Upcoming Stay')).toBeInTheDocument();
    });

    it('omits the upcoming stay card when nothing is upcoming', () => {
        mockQueries([reservation({ checkIn: '2020-01-01', checkOut: '2020-01-05' })]);
        render(<OverviewScreen />);

        expect(screen.queryByText('Upcoming Stay')).not.toBeInTheDocument();
        expect(screen.getByText('Recent Bookings')).toBeInTheDocument();
    });

    it('never shows synthetic metrics widgets', () => {
        mockQueries([reservation()]);
        render(<OverviewScreen />);

        expect(screen.queryByText(/total nights/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/loyalty/i)).not.toBeInTheDocument();
    });
});
