import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CabinBookingPanel } from './cabin-booking-panel';

describe('CabinBookingPanel', () => {
    it('prompts for dates before any total is shown', () => {
        render(<CabinBookingPanel nightlyRate={25000} cleaningFee={3500} maxGuests={4} />);

        expect(screen.getByText('Select your dates to see the total.')).toBeInTheDocument();
    });

    it('computes and displays the live total once both dates are set', () => {
        render(<CabinBookingPanel nightlyRate={25000} cleaningFee={3500} maxGuests={4} />);

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-18' },
        });

        // 3 nights x $250 + $35 cleaning fee = $785
        expect(screen.getByText('$785')).toBeInTheDocument();
    });

    it('only offers guest options up to the cabin capacity', async () => {
        const user = userEvent.setup();
        render(<CabinBookingPanel nightlyRate={25000} cleaningFee={3500} maxGuests={2} />);

        await user.click(screen.getByRole('combobox', { name: 'Guests' }));

        // The popup mounts via a portal with its own open transition -- `findByRole` waits
        // for it rather than asserting synchronously right after the click.
        expect(await screen.findByRole('option', { name: '2 guests' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '4 guests' })).not.toBeInTheDocument();
    });

    it('offers a capacity that falls between presets, not just the nearest preset below it', async () => {
        const user = userEvent.setup();
        render(<CabinBookingPanel nightlyRate={25000} cleaningFee={3500} maxGuests={5} />);

        await user.click(screen.getByRole('combobox', { name: 'Guests' }));

        expect(await screen.findByRole('option', { name: '5 guests' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '6 guests' })).not.toBeInTheDocument();
    });

    it('keeps the Reserve button disabled with a coming-soon caption', () => {
        render(<CabinBookingPanel nightlyRate={25000} cleaningFee={3500} maxGuests={4} />);

        expect(screen.getByRole('button', { name: 'Reserve' })).toBeDisabled();
        expect(screen.getByText('Checkout coming soon.')).toBeInTheDocument();
    });
});
