import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CheckoutCancelScreen } from './checkout-cancel-screen';

describe('CheckoutCancelScreen', () => {
    it('shows only the Browse cabins action when no cabin context is given', () => {
        render(<CheckoutCancelScreen cabinHref={null} />);

        expect(screen.getByRole('button', { name: 'Browse cabins' })).toHaveAttribute(
            'href',
            '/cabins',
        );
        expect(screen.queryByRole('button', { name: 'Back to cabin' })).not.toBeInTheDocument();
    });

    it('offers a Back to cabin action when a cabin href is given', () => {
        render(<CheckoutCancelScreen cabinHref='/cabins/pine-ridge-cabin' />);

        expect(screen.getByRole('button', { name: 'Back to cabin' })).toHaveAttribute(
            'href',
            '/cabins/pine-ridge-cabin',
        );
    });
});
