import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CancelReservationAction } from './cancel-reservation-action';
import type { ReservationSummary } from './reservation-row';

const { useMutation } = vi.hoisted(() => ({ useMutation: vi.fn() }));
const cancelReservation = vi.fn();

vi.mock('convex/react', () => ({ useMutation }));

function reservation(overrides: Partial<ReservationSummary> = {}): ReservationSummary {
    const farFuture = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const checkIn = farFuture.toISOString().slice(0, 10);
    const checkOut = new Date(farFuture.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

    return {
        _id: 'reservation-1' as never,
        cabinName: 'Pine Ridge Cabin',
        cabinSlug: 'pine-ridge-cabin',
        coverImageUrl: null,
        checkIn,
        checkOut,
        guests: 2,
        status: 'confirmed',
        paymentStatus: 'not_required',
        paymentRequired: false,
        pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
        createdAt: 0,
        ...overrides,
    };
}

describe('CancelReservationAction', () => {
    beforeEach(() => {
        cancelReservation.mockClear();
        useMutation.mockReturnValue(cancelReservation);
    });

    it('renders nothing for an already-cancelled reservation', () => {
        const { container } = render(
            <CancelReservationAction reservation={reservation({ status: 'cancelled' })} />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing for a past reservation', () => {
        const { container } = render(
            <CancelReservationAction
                reservation={reservation({ checkIn: '2020-01-01', checkOut: '2020-01-05' })}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an admin-assistance message when payment is required', () => {
        render(<CancelReservationAction reservation={reservation({ paymentRequired: true })} />);

        expect(
            screen.getByText('This reservation requires admin assistance to cancel.'),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Cancel reservation' }),
        ).not.toBeInTheDocument();
    });

    it('shows a window message for a check-in within 48 hours', () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        render(
            <CancelReservationAction
                reservation={reservation({ checkIn: tomorrow, checkOut: '2099-01-01' })}
            />,
        );

        expect(
            screen.getByText('Cancellation is only available more than 48 hours before check-in.'),
        ).toBeInTheDocument();
    });

    it('cancels the reservation and shows nothing else on success', async () => {
        cancelReservation.mockResolvedValue(null);
        const user = userEvent.setup();
        render(<CancelReservationAction reservation={reservation()} />);

        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        expect(cancelReservation).toHaveBeenCalledWith({ reservationId: 'reservation-1' });
    });

    it('surfaces a ConvexError message inline and re-enables the button', async () => {
        cancelReservation.mockRejectedValue(new ConvexError('Something specific went wrong.'));
        const user = userEvent.setup();
        render(<CancelReservationAction reservation={reservation()} />);

        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        expect(await screen.findByText('Something specific went wrong.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel reservation' })).toBeEnabled();
    });

    it('falls back to a generic message for a non-ConvexError failure', async () => {
        cancelReservation.mockRejectedValue(new Error('network error'));
        const user = userEvent.setup();
        render(<CancelReservationAction reservation={reservation()} />);

        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        expect(
            await screen.findByText(
                'Something went wrong cancelling your reservation. Please try again.',
            ),
        ).toBeInTheDocument();
    });
});
