import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CabinFilters } from './cabin-filters';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.mock('convex/react', () => ({ useQuery }));

const AMENITIES = [
    { _id: 'wifi-id', name: 'WiFi', icon: 'wifi', category: 'essentials' },
    { _id: 'kitchen-id', name: 'Kitchen', icon: 'kitchen', category: 'kitchen' },
    { _id: 'fireplace-id', name: 'Fireplace', icon: 'fireplace', category: 'comfort' },
    { _id: 'hottub-id', name: 'Hot Tub', icon: 'hot-tub', category: 'comfort' },
    { _id: 'garden-id', name: 'Garden', icon: 'garden', category: 'outdoor' },
    { _id: 'grill-id', name: 'Grill / BBQ', icon: 'grill', category: 'outdoor' },
];

describe('CabinFilters', () => {
    beforeEach(() => {
        useQuery.mockReturnValue(AMENITIES);
    });

    it('toggling an amenity chip adds its id to the amenities URL param', async () => {
        const onUrlUpdate = vi.fn();
        const user = userEvent.setup();
        render(<CabinFilters />, { wrapper: withNuqsTestingAdapter({ onUrlUpdate }) });

        await user.click(screen.getByRole('button', { name: 'WiFi' }));

        const lastUpdate = onUrlUpdate.mock.calls.at(-1)?.[0];
        expect(lastUpdate.searchParams.get('amenities')).toBe('wifi-id');
    });

    it('clicking an active amenity chip removes it again', async () => {
        const onUrlUpdate = vi.fn();
        const user = userEvent.setup();
        render(<CabinFilters />, {
            wrapper: withNuqsTestingAdapter({
                searchParams: '?amenities=wifi-id',
                hasMemory: true,
                onUrlUpdate,
            }),
        });

        expect(screen.getByRole('button', { name: 'WiFi' })).toHaveAttribute(
            'aria-pressed',
            'true',
        );

        await user.click(screen.getByRole('button', { name: 'WiFi' }));

        const lastUpdate = onUrlUpdate.mock.calls.at(-1)?.[0];
        expect(lastUpdate.searchParams.get('amenities')).toBeNull();
    });

    it('shows Clear filters only when a filter is active, and resets only filter keys', async () => {
        const onUrlUpdate = vi.fn();
        const user = userEvent.setup();
        render(<CabinFilters />, {
            wrapper: withNuqsTestingAdapter({
                searchParams: '?checkIn=2026-08-15&maxPrice=300',
                hasMemory: true,
                onUrlUpdate,
            }),
        });

        await user.click(screen.getByRole('button', { name: 'Clear filters' }));

        const lastUpdate = onUrlUpdate.mock.calls.at(-1)?.[0];
        expect(lastUpdate.searchParams.get('maxPrice')).toBeNull();
        expect(lastUpdate.searchParams.get('checkIn')).toBe('2026-08-15');
    });

    it('typing in the search field updates the search URL param', async () => {
        const onUrlUpdate = vi.fn();
        const user = userEvent.setup();
        render(<CabinFilters />, { wrapper: withNuqsTestingAdapter({ onUrlUpdate }) });

        await user.type(screen.getByLabelText('Search'), 'lodge');

        // The search field debounces its URL write -- wait past that delay rather than
        // asserting synchronously.
        await vi.waitFor(() => {
            const lastUpdate = onUrlUpdate.mock.calls.at(-1)?.[0];
            expect(lastUpdate?.searchParams.get('search')).toBe('lodge');
        });
    });

    it('does not show Clear filters when no filter is active', () => {
        render(<CabinFilters />, { wrapper: withNuqsTestingAdapter() });

        expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
    });
});
