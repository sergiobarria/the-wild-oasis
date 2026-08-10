import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type AdminBookingRow, BookingsTable } from './bookings-table';

function booking(overrides: Partial<AdminBookingRow> = {}): AdminBookingRow {
    return {
        _id: 'reservation-1' as never,
        cabinName: 'Pine Ridge Cabin',
        guestName: 'Jamie Alder',
        guestEmail: 'jamie@example.com',
        checkIn: '2026-08-05',
        checkOut: '2026-08-08',
        guests: 2,
        status: 'confirmed',
        paymentStatus: 'not_required',
        total: 78500,
        createdAt: 0,
        ...overrides,
    };
}

describe('BookingsTable', () => {
    it('shows an empty-state message when there are no bookings', () => {
        render(<BookingsTable bookings={[]} onOpen={vi.fn()} />);

        expect(screen.getByText('No bookings match these filters.')).toBeInTheDocument();
    });

    it('renders a row per booking', () => {
        render(<BookingsTable bookings={[booking()]} onOpen={vi.fn()} />);

        expect(screen.getByText('Jamie Alder')).toBeInTheDocument();
        expect(screen.getByText('jamie@example.com')).toBeInTheDocument();
        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('$785')).toBeInTheDocument();
    });

    it('calls onOpen with the reservation id when a row is clicked', async () => {
        const onOpen = vi.fn();
        const user = userEvent.setup();
        render(<BookingsTable bookings={[booking()]} onOpen={onOpen} />);

        await user.click(screen.getByText('Jamie Alder'));

        expect(onOpen).toHaveBeenCalledWith('reservation-1');
    });
});
