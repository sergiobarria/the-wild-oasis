import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CancelBookingAction } from './cancel-booking-action';

const { useMutation } = vi.hoisted(() => ({ useMutation: vi.fn() }));
const adminCancelReservation = vi.fn();

vi.mock('convex/react', () => ({ useMutation }));

describe('CancelBookingAction', () => {
    beforeEach(() => {
        adminCancelReservation.mockClear();
        useMutation.mockReturnValue(adminCancelReservation);
    });

    it('renders nothing for an already-cancelled reservation', () => {
        const { container } = render(
            <CancelBookingAction reservationId='reservation-1' status='cancelled' />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an inline confirmation before cancelling', async () => {
        const user = userEvent.setup();
        render(<CancelBookingAction reservationId='reservation-1' status='confirmed' />);

        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        expect(
            screen.getByText("Cancel this reservation on the guest's behalf?"),
        ).toBeInTheDocument();
        expect(adminCancelReservation).not.toHaveBeenCalled();
    });

    it('backs out of the confirmation without cancelling', async () => {
        const user = userEvent.setup();
        render(<CancelBookingAction reservationId='reservation-1' status='confirmed' />);
        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        await user.click(screen.getByRole('button', { name: 'Keep reservation' }));

        expect(screen.getByRole('button', { name: 'Cancel reservation' })).toBeInTheDocument();
        expect(adminCancelReservation).not.toHaveBeenCalled();
    });

    it('cancels the reservation on confirmation', async () => {
        adminCancelReservation.mockResolvedValue(null);
        const user = userEvent.setup();
        render(<CancelBookingAction reservationId='reservation-1' status='confirmed' />);
        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        await user.click(screen.getByRole('button', { name: 'Confirm cancellation' }));

        expect(adminCancelReservation).toHaveBeenCalledWith({ reservationId: 'reservation-1' });
    });

    it('surfaces a ConvexError message inline', async () => {
        adminCancelReservation.mockRejectedValue(new ConvexError('Something specific went wrong.'));
        const user = userEvent.setup();
        render(<CancelBookingAction reservationId='reservation-1' status='confirmed' />);
        await user.click(screen.getByRole('button', { name: 'Cancel reservation' }));

        await user.click(screen.getByRole('button', { name: 'Confirm cancellation' }));

        expect(await screen.findByText('Something specific went wrong.')).toBeInTheDocument();
    });
});
