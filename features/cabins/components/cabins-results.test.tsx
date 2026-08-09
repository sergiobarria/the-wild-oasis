import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CabinsResults } from './cabins-results';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const { useQueryStates } = vi.hoisted(() => ({ useQueryStates: vi.fn() }));

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('nuqs', async (importOriginal) => ({
    ...(await importOriginal<typeof import('nuqs')>()),
    useQueryStates,
}));

function cabin(overrides: Partial<Record<string, unknown>> = {}) {
    return {
        _id: 'cabin-1',
        _creationTime: 0,
        name: 'Pine Ridge Cabin',
        slug: 'pine-ridge-cabin',
        shortDescription: 'A quiet cabin in the woods.',
        location: 'Pine Ridge',
        nightlyRate: 25000,
        cleaningFee: 3500,
        maxGuests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        coverImageUrl: null,
        published: true,
        createdAt: 0,
        updatedAt: 0,
        amenities: [],
        ...overrides,
    };
}

function mockNuqsState(
    filters: { search: string; maxPrice: number | null; amenities: string[] } = {
        search: '',
        maxPrice: null,
        amenities: [],
    },
    setFilters = vi.fn(),
) {
    useQueryStates
        .mockReturnValueOnce([{ checkIn: '', checkOut: '', guests: '2' }, vi.fn()])
        .mockReturnValueOnce([filters, setFilters]);
}

describe('CabinsResults', () => {
    it('shows skeleton placeholders while loading', () => {
        mockNuqsState();
        useQuery.mockReturnValue(undefined);
        const { container } = render(<CabinsResults />);

        expect(container.querySelectorAll('[data-slot=skeleton]').length).toBeGreaterThan(0);
    });

    it('shows a plain empty state with no Clear filters button when nothing is filtered', () => {
        mockNuqsState();
        useQuery.mockReturnValue([]);
        render(<CabinsResults />);

        expect(screen.getByText('No cabins published yet.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
    });

    it('shows a filtered empty state with a working Clear filters action', async () => {
        const setFilters = vi.fn();
        mockNuqsState({ search: '', maxPrice: 200, amenities: [] }, setFilters);
        useQuery.mockReturnValue([]);
        const user = userEvent.setup();
        render(<CabinsResults />);

        expect(screen.getByText('No cabins match your filters.')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(setFilters).toHaveBeenCalledWith(null);
    });

    it('renders a card per cabin and converts filter state into Convex query args', () => {
        mockNuqsState({ search: 'lodge', maxPrice: 300, amenities: ['amenity-1'] });
        useQuery.mockReturnValue([
            cabin(),
            cabin({ _id: 'cabin-2', slug: 'lakeside-lodge', name: 'Lakeside Lodge' }),
        ]);
        render(<CabinsResults />);

        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('Lakeside Lodge')).toBeInTheDocument();
        expect(useQuery).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                guests: 2,
                name: 'lodge',
                maxPriceCents: 30000,
                amenityIds: ['amenity-1'],
            }),
        );
    });

    it('falls back to guests=1 for an unparseable guests value in the URL', () => {
        useQueryStates
            .mockReturnValueOnce([{ checkIn: '', checkOut: '', guests: 'not-a-number' }, vi.fn()])
            .mockReturnValueOnce([{ search: '', maxPrice: null, amenities: [] }, vi.fn()]);
        useQuery.mockReturnValue([]);
        render(<CabinsResults />);

        expect(useQuery).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ guests: 1 }),
        );
    });
});
