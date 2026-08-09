import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FeaturedCabinsSection } from './featured-cabins-section';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.mock('convex/react', () => ({ useQuery }));

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
        ...overrides,
    };
}

describe('FeaturedCabinsSection', () => {
    it('shows skeleton placeholders while loading', () => {
        useQuery.mockReturnValue(undefined);
        const { container } = render(<FeaturedCabinsSection />);

        expect(container.querySelectorAll('[data-slot=skeleton]').length).toBeGreaterThan(0);
    });

    it('shows an empty state with a link to /cabins when there are no cabins', () => {
        useQuery.mockReturnValue({ page: [], isDone: true, continueCursor: '' });
        render(<FeaturedCabinsSection />);

        expect(screen.getByText('No featured cabins yet.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Browse all cabins' })).toHaveAttribute(
            'href',
            '/cabins',
        );
    });

    it('renders a card per cabin with the formatted price and a working link', () => {
        useQuery.mockReturnValue({
            page: [
                cabin(),
                cabin({ _id: 'cabin-2', slug: 'lakeside-lodge', name: 'Lakeside Lodge' }),
            ],
            isDone: true,
            continueCursor: '',
        });
        render(<FeaturedCabinsSection />);

        expect(screen.getByText('Pine Ridge Cabin')).toBeInTheDocument();
        expect(screen.getByText('Lakeside Lodge')).toBeInTheDocument();
        expect(screen.getAllByText('$250/night')).toHaveLength(2);
        expect(screen.getAllByRole('link', { name: 'View Cabin' })[0]).toHaveAttribute(
            'href',
            '/cabins/pine-ridge-cabin',
        );
        expect(screen.getAllByText('Featured')).toHaveLength(2);
        expect(useQuery).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ featuredOnly: true }),
        );
    });
});
