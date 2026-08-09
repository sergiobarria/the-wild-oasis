import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckoutConfirmAction } from './checkout-confirm-action';

const { useMutation } = vi.hoisted(() => ({ useMutation: vi.fn() }));
const push = vi.fn();
const createDemoReservation = vi.fn();

vi.mock('convex/react', () => ({ useMutation }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const CABIN_ID = 'cabin-1';

function renderAction(
    overrides: Partial<{ canConfirm: boolean; stripePaymentsEnabled: boolean }> = {},
) {
    return render(
        <CheckoutConfirmAction
            cabinId={CABIN_ID as never}
            checkIn='2026-08-15'
            checkOut='2026-08-18'
            guests={2}
            canConfirm={overrides.canConfirm ?? true}
            stripePaymentsEnabled={overrides.stripePaymentsEnabled ?? false}
        />,
    );
}

describe('CheckoutConfirmAction', () => {
    beforeEach(() => {
        push.mockClear();
        createDemoReservation.mockClear();
        useMutation.mockReturnValue(createDemoReservation);
    });

    it('shows a disabled Pay & Confirm placeholder when Stripe is enabled', () => {
        renderAction({ stripePaymentsEnabled: true });

        expect(screen.getByRole('button', { name: 'Pay & Confirm' })).toBeDisabled();
        expect(screen.getByText('Card payments are coming soon.')).toBeInTheDocument();
    });

    it('disables Confirm Reservation when the dates are no longer available', () => {
        renderAction({ canConfirm: false });

        expect(screen.getByRole('button', { name: 'Confirm Reservation' })).toBeDisabled();
    });

    it('creates the reservation and navigates to the success page', async () => {
        createDemoReservation.mockResolvedValue({ reservationId: 'reservation-1' });
        const user = userEvent.setup();
        renderAction();

        await user.click(screen.getByRole('button', { name: 'Confirm Reservation' }));

        expect(createDemoReservation).toHaveBeenCalledWith({
            cabinId: CABIN_ID,
            checkIn: '2026-08-15',
            checkOut: '2026-08-18',
            guests: 2,
        });
        expect(push).toHaveBeenCalledWith('/checkout/success?reservationId=reservation-1');
    });

    it('surfaces a ConvexError message inline and re-enables the button', async () => {
        createDemoReservation.mockRejectedValue(
            new ConvexError('These dates are no longer available.'),
        );
        const user = userEvent.setup();
        renderAction();

        await user.click(screen.getByRole('button', { name: 'Confirm Reservation' }));

        expect(await screen.findByText('These dates are no longer available.')).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Confirm Reservation' })).toBeEnabled();
    });

    it('falls back to a generic message for a non-ConvexError failure', async () => {
        createDemoReservation.mockRejectedValue(new Error('network error'));
        const user = userEvent.setup();
        renderAction();

        await user.click(screen.getByRole('button', { name: 'Confirm Reservation' }));

        expect(
            await screen.findByText(
                'Something went wrong confirming your reservation. Please try again.',
            ),
        ).toBeInTheDocument();
    });
});
