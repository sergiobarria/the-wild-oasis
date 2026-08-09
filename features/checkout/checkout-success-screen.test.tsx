import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CheckoutSuccessScreen } from './checkout-success-screen';

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
    } as never;
}

describe('CheckoutSuccessScreen', () => {
    it('shows the reservation reference, cabin, dates, and total', () => {
        render(<CheckoutSuccessScreen reservation={reservation()} />);

        expect(screen.getByText('reservation-1')).toBeInTheDocument();
        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('2026-08-15 → 2026-08-18')).toBeInTheDocument();
        expect(screen.getByText('$785')).toBeInTheDocument();
    });

    it('links to the guest dashboard', () => {
        render(<CheckoutSuccessScreen reservation={reservation()} />);

        expect(screen.getByRole('button', { name: 'Go to dashboard' })).toHaveAttribute(
            'href',
            '/guest-area',
        );
    });
});
