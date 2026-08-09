import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CabinBookingPanel } from './cabin-booking-panel';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const push = vi.fn();

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const CABIN_ID = 'cabin-1';

function renderPanel(
    overrides: Partial<{
        nightlyRate: number;
        cleaningFee: number;
        maxGuests: number;
        isAuthenticated: boolean;
    }> = {},
) {
    return render(
        <CabinBookingPanel
            cabinId={CABIN_ID as never}
            nightlyRate={overrides.nightlyRate ?? 25000}
            cleaningFee={overrides.cleaningFee ?? 3500}
            maxGuests={overrides.maxGuests ?? 4}
            isAuthenticated={overrides.isAuthenticated ?? true}
        />,
    );
}

function selectAvailableDates() {
    fireEvent.change(screen.getByLabelText('Check-in'), {
        target: { value: '2026-08-15' },
    });
    fireEvent.change(screen.getByLabelText('Check-out'), {
        target: { value: '2026-08-18' },
    });
}

describe('CabinBookingPanel', () => {
    beforeEach(() => {
        push.mockClear();
    });

    it('prompts for dates before any total is shown', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(screen.getByText('Select your dates to see the total.')).toBeInTheDocument();
    });

    it('computes and displays the live total once both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();
        selectAvailableDates();

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

    it('keeps Reserve disabled until dates are set and available', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(screen.getByRole('button', { name: 'Reserve' })).toBeDisabled();
    });

    it('does not query availability until both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();

        expect(useQuery).toHaveBeenCalledWith(expect.anything(), 'skip');
    });

    it('queries availability once both dates are set', () => {
        useQuery.mockReturnValue(undefined);
        renderPanel();
        selectAvailableDates();

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
        selectAvailableDates();

        expect(
            screen.getByText('These dates are already booked. Try a different range.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('This cabin can’t accommodate that many guests.'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reserve' })).toBeDisabled();
    });

    it('enables Reserve once the dates are available', () => {
        useQuery.mockReturnValue({ available: true });
        renderPanel();
        selectAvailableDates();

        expect(
            screen.queryByText('These dates are already booked. Try a different range.'),
        ).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reserve' })).toBeEnabled();
    });

    it('navigates straight to checkout when already signed in', async () => {
        useQuery.mockReturnValue({ available: true });
        const user = userEvent.setup();
        renderPanel({ isAuthenticated: true });
        selectAvailableDates();

        await user.click(screen.getByRole('button', { name: 'Reserve' }));

        expect(push).toHaveBeenCalledWith(
            `/checkout/summary?cabinId=${CABIN_ID}&checkIn=2026-08-15&checkOut=2026-08-18&guests=1`,
        );
    });

    it('routes through sign-in with the checkout URL preserved when signed out', async () => {
        useQuery.mockReturnValue({ available: true });
        const user = userEvent.setup();
        renderPanel({ isAuthenticated: false });
        selectAvailableDates();

        await user.click(screen.getByRole('button', { name: 'Reserve' }));

        expect(push).toHaveBeenCalledWith(
            `/sign-in?redirectTo=${encodeURIComponent(
                `/checkout/summary?cabinId=${CABIN_ID}&checkIn=2026-08-15&checkOut=2026-08-18&guests=1`,
            )}`,
        );
    });
});
