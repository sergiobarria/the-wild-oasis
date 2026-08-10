import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CheckoutSuccessScreen } from './checkout-success-screen';

const { usePreloadedQuery } = vi.hoisted(() => ({ usePreloadedQuery: vi.fn() }));

vi.mock('convex/react', () => ({ usePreloadedQuery }));

function reservation(overrides: Partial<Record<string, unknown>> = {}) {
    return {
        _id: 'reservation-1',
        cabinName: 'Pine Ridge Cabin',
        checkIn: '2026-08-15',
        checkOut: '2026-08-18',
        guests: 2,
        status: 'confirmed',
        paymentStatus: 'not_required',
        pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
        createdAt: 1700000000000,
        ...overrides,
    };
}

function renderScreen(overrides: Partial<Record<string, unknown>> = {}) {
    usePreloadedQuery.mockReturnValue(reservation(overrides));
    return render(<CheckoutSuccessScreen preloadedReservation={'preloaded' as never} />);
}

describe('CheckoutSuccessScreen', () => {
    it('shows the reservation reference, cabin, dates, and total', () => {
        renderScreen();

        expect(screen.getByText('WO-VATI-ON-1')).toBeInTheDocument();
        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('2026-08-15 → 2026-08-18')).toBeInTheDocument();
        expect(screen.getByText('$785')).toBeInTheDocument();
        expect(screen.getByText('Reservation confirmed')).toBeInTheDocument();
    });

    it('links to the guest dashboard', () => {
        renderScreen();

        expect(screen.getByRole('button', { name: 'Go to dashboard' })).toHaveAttribute(
            'href',
            '/guest-area',
        );
    });

    it('shows a processing state while payment is still pending (WO-060)', () => {
        renderScreen({ status: 'pending', paymentStatus: 'pending' });

        expect(screen.getByText('Processing your payment…')).toBeInTheDocument();
        expect(screen.queryByText('Reservation confirmed')).not.toBeInTheDocument();
    });
});
