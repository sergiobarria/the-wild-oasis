import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckoutConfirmAction } from './checkout-confirm-action';

const { useAction, useMutation } = vi.hoisted(() => ({
    useAction: vi.fn(),
    useMutation: vi.fn(),
}));
const push = vi.fn();
const createDemoReservation = vi.fn();
const createStripeCheckoutSession = vi.fn();

vi.mock('convex/react', () => ({ useAction, useMutation }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const CABIN_ID = 'cabin-1';

function renderAction(
    overrides: Partial<{ canConfirm: boolean; stripePaymentsEnabled: boolean }> = {},
) {
    return render(
        <CheckoutConfirmAction
            cabinId={CABIN_ID as never}
            cabinSlug='pine-ridge-cabin'
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
        createStripeCheckoutSession.mockClear();
        useMutation.mockReturnValue(createDemoReservation);
        useAction.mockReturnValue(createStripeCheckoutSession);
    });

    it('starts a Stripe Checkout redirect when Stripe is enabled', async () => {
        createStripeCheckoutSession.mockResolvedValue({
            url: 'https://checkout.stripe.com/test-session',
        });
        const user = userEvent.setup();
        renderAction({ stripePaymentsEnabled: true });

        await user.click(screen.getByRole('button', { name: 'Pay & Confirm' }));

        expect(createStripeCheckoutSession).toHaveBeenCalledWith({
            cabinId: CABIN_ID,
            cabinSlug: 'pine-ridge-cabin',
            checkIn: '2026-08-15',
            checkOut: '2026-08-18',
            guests: 2,
        });
    });

    it('disables Pay & Confirm when the dates are no longer available', () => {
        renderAction({ stripePaymentsEnabled: true, canConfirm: false });

        expect(screen.getByRole('button', { name: 'Pay & Confirm' })).toBeDisabled();
    });

    it('surfaces a ConvexError message inline when starting Stripe checkout fails', async () => {
        createStripeCheckoutSession.mockRejectedValue(
            new ConvexError('Stripe payments are not currently enabled.'),
        );
        const user = userEvent.setup();
        renderAction({ stripePaymentsEnabled: true });

        await user.click(screen.getByRole('button', { name: 'Pay & Confirm' }));

        expect(
            await screen.findByText('Stripe payments are not currently enabled.'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Pay & Confirm' })).toBeEnabled();
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
