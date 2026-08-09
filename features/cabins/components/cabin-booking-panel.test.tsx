import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CabinBookingPanel } from './cabin-booking-panel';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.mock('convex/react', () => ({ useQuery }));

const CABIN_ID = 'cabin-1';

function renderPanel(
    overrides: Partial<{ nightlyRate: number; cleaningFee: number; maxGuests: number }> = {},
) {
    return render(
        <CabinBookingPanel
            cabinId={CABIN_ID as never}
            nightlyRate={overrides.nightlyRate ?? 25000}
            cleaningFee={overrides.cleaningFee ?? 3500}
            maxGuests={overrides.maxGuests ?? 4}
        />,
    );
}

describe('CabinBookingPanel', () => {
    it('prompts for dates before any total is shown', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(screen.getByText('Select your dates to see the total.')).toBeInTheDocument();
    });

    it('computes and displays the live total once both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

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
        useQuery.mockReturnValue(undefined);
        const user = userEvent.setup();
        renderPanel({ maxGuests: 2 });

        await user.click(screen.getByRole('combobox', { name: 'Guests' }));

        // The popup mounts via a portal with its own open transition -- `findByRole` waits
        // for it rather than asserting synchronously right after the click.
        expect(await screen.findByRole('option', { name: '2 guests' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '4 guests' })).not.toBeInTheDocument();
    });

    it('offers a capacity that falls between presets, not just the nearest preset below it', async () => {
        useQuery.mockReturnValue(undefined);
        const user = userEvent.setup();
        renderPanel({ maxGuests: 5 });

        await user.click(screen.getByRole('combobox', { name: 'Guests' }));

        expect(await screen.findByRole('option', { name: '5 guests' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: '6 guests' })).not.toBeInTheDocument();
    });

    it('keeps the Reserve button disabled with a coming-soon caption', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(screen.getByRole('button', { name: 'Reserve' })).toBeDisabled();
        expect(screen.getByText('Checkout coming soon.')).toBeInTheDocument();
    });

    it('does not query availability until both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(useQuery).toHaveBeenCalledWith(expect.anything(), 'skip');
    });

    it('queries availability once both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-18' },
        });

        expect(useQuery).toHaveBeenLastCalledWith(
            expect.anything(),
            expect.objectContaining({
                cabinId: CABIN_ID,
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
                guests: 1,
            }),
        );
    });

    it('shows every violation message when the dates are unavailable', () => {
        useQuery.mockReturnValue({
            available: false,
            violations: [{ code: 'DATE_UNAVAILABLE' }, { code: 'GUESTS_EXCEED_CAPACITY' }],
        });
        renderPanel();

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-18' },
        });

        expect(
            screen.getByText('These dates are already booked. Try a different range.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('This cabin can’t accommodate that many guests.'),
        ).toBeInTheDocument();
    });

    it('shows no violation messages when the dates are available', () => {
        useQuery.mockReturnValue({ available: true });
        renderPanel();

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-18' },
        });

        expect(
            screen.queryByText('These dates are already booked. Try a different range.'),
        ).not.toBeInTheDocument();
    });
});
