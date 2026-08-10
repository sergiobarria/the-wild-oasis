import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RefundBookingAction } from './refund-booking-action';

const { useAction } = vi.hoisted(() => ({ useAction: vi.fn() }));
const adminRefundReservation = vi.fn();

vi.mock('convex/react', () => ({ useAction }));

describe('RefundBookingAction', () => {
    beforeEach(() => {
        adminRefundReservation.mockClear();
        useAction.mockReturnValue(adminRefundReservation);
    });

    it('renders nothing when the payment is not paid', () => {
        const { container } = render(
            <RefundBookingAction reservationId='reservation-1' paymentStatus='not_required' />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows an inline confirmation before refunding', async () => {
        const user = userEvent.setup();
        render(<RefundBookingAction reservationId='reservation-1' paymentStatus='paid' />);

        await user.click(screen.getByRole('button', { name: 'Refund payment' }));

        expect(screen.getByText('Refund this payment in full via Stripe?')).toBeInTheDocument();
        expect(adminRefundReservation).not.toHaveBeenCalled();
    });

    it('backs out of the confirmation without refunding', async () => {
        const user = userEvent.setup();
        render(<RefundBookingAction reservationId='reservation-1' paymentStatus='paid' />);
        await user.click(screen.getByRole('button', { name: 'Refund payment' }));

        await user.click(screen.getByRole('button', { name: 'Keep payment' }));

        expect(screen.getByRole('button', { name: 'Refund payment' })).toBeInTheDocument();
        expect(adminRefundReservation).not.toHaveBeenCalled();
    });

    it('refunds the payment on confirmation', async () => {
        adminRefundReservation.mockResolvedValue(null);
        const user = userEvent.setup();
        render(<RefundBookingAction reservationId='reservation-1' paymentStatus='paid' />);
        await user.click(screen.getByRole('button', { name: 'Refund payment' }));

        await user.click(screen.getByRole('button', { name: 'Confirm refund' }));

        expect(adminRefundReservation).toHaveBeenCalledWith({ reservationId: 'reservation-1' });
    });

    it('surfaces a ConvexError message inline', async () => {
        adminRefundReservation.mockRejectedValue(
            new ConvexError('Only a paid reservation can be refunded.'),
        );
        const user = userEvent.setup();
        render(<RefundBookingAction reservationId='reservation-1' paymentStatus='paid' />);
        await user.click(screen.getByRole('button', { name: 'Refund payment' }));

        await user.click(screen.getByRole('button', { name: 'Confirm refund' }));

        expect(
            await screen.findByText('Only a paid reservation can be refunded.'),
        ).toBeInTheDocument();
    });
});
