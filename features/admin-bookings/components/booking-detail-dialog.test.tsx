import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BookingDetailDialog } from './booking-detail-dialog';

const { useQuery, useMutation } = vi.hoisted(() => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(),
}));

vi.mock('convex/react', () => ({ useQuery, useMutation }));

type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

type Reservation = {
    _id: string;
    cabinName: string;
    guestName: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: ReservationStatus;
    paymentStatus: 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded';
    paymentRequired: boolean;
    pricing: { nightlySubtotal: number; cleaningFee: number; taxes: number; total: number };
    createdAt: number;
    updatedAt: number;
};

function reservation(overrides: Partial<Reservation> = {}): Reservation {
    return { ...baseReservation(), ...overrides };
}

function baseReservation(): Reservation {
    return {
        _id: 'reservation-1',
        cabinName: 'Pine Ridge Cabin',
        guestName: 'Jamie Alder',
        guestEmail: 'jamie@example.com',
        checkIn: '2026-08-05',
        checkOut: '2026-08-08',
        guests: 2,
        status: 'confirmed',
        paymentStatus: 'not_required',
        paymentRequired: false,
        pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
        createdAt: 0,
        updatedAt: 0,
    };
}

describe('BookingDetailDialog', () => {
    beforeEach(() => {
        useQuery.mockReset();
        useMutation.mockReturnValue(vi.fn());
    });

    it('renders nothing when no reservation is selected', () => {
        useQuery.mockReturnValue(undefined);
        const { container } = render(
            <BookingDetailDialog reservationId={null} onClose={vi.fn()} />,
        );

        expect(container.querySelector('[role=dialog]')).not.toBeInTheDocument();
    });

    it('shows a not-found message when the reservation is null', () => {
        useQuery.mockReturnValue(null);
        render(<BookingDetailDialog reservationId='reservation-1' onClose={vi.fn()} />);

        expect(screen.getByText('This reservation could not be found.')).toBeInTheDocument();
    });

    it('renders reservation, guest, and financial details', () => {
        useQuery.mockReturnValue(reservation());
        render(<BookingDetailDialog reservationId='reservation-1' onClose={vi.fn()} />);

        expect(screen.getByText('reservation-1')).toBeInTheDocument();
        expect(screen.getByText('Jamie Alder (jamie@example.com)')).toBeInTheDocument();
        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('$785')).toBeInTheDocument();
    });

    it('renders the cancel action for a non-cancelled reservation', () => {
        useQuery.mockReturnValue(reservation({ status: 'confirmed' }));
        render(<BookingDetailDialog reservationId='reservation-1' onClose={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Cancel reservation' })).toBeInTheDocument();
    });

    it('omits the cancel action for an already-cancelled reservation', () => {
        useQuery.mockReturnValue(reservation({ status: 'cancelled' }));
        render(<BookingDetailDialog reservationId='reservation-1' onClose={vi.fn()} />);

        expect(
            screen.queryByRole('button', { name: 'Cancel reservation' }),
        ).not.toBeInTheDocument();
    });
});
