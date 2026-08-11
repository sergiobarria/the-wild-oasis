import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getFunctionName } from 'convex/server';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/convex/_generated/api';

import { AdminAmenitiesScreen } from './admin-amenities-screen';

const { useMutation, useQuery } = vi.hoisted(() => ({
    useMutation: vi.fn(),
    useQuery: vi.fn(),
}));
const { toast } = vi.hoisted(() => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const adminCreateAmenity = vi.fn();
const adminUpdateAmenity = vi.fn();
const adminDeleteAmenity = vi.fn();

vi.mock('convex/react', () => ({ useMutation, useQuery }));
vi.mock('sonner', () => ({ toast }));

function amenity(
    overrides: Partial<{ _id: string; name: string; icon: string; category: string }> = {},
) {
    return {
        _id: 'amenity-1',
        _creationTime: 0,
        name: 'WiFi',
        icon: 'Wifi',
        category: 'essentials',
        ...overrides,
    };
}

describe('AdminAmenitiesScreen', () => {
    beforeEach(() => {
        adminCreateAmenity.mockClear();
        adminUpdateAmenity.mockClear();
        adminDeleteAmenity.mockClear();
        toast.success.mockClear();
        toast.error.mockClear();

        // `api.*` is a Proxy that returns a fresh object per property access (see
        // convex/server's `createApi`), so reference equality never holds across two
        // separate accesses -- compare via `getFunctionName`'s resolved path string instead.
        useMutation.mockImplementation((ref: Parameters<typeof getFunctionName>[0]) => {
            const name = getFunctionName(ref);
            if (name === getFunctionName(api.amenities.adminCreateAmenity))
                return adminCreateAmenity;
            if (name === getFunctionName(api.amenities.adminUpdateAmenity))
                return adminUpdateAmenity;
            if (name === getFunctionName(api.amenities.adminDeleteAmenity))
                return adminDeleteAmenity;
            throw new Error('Unexpected mutation reference in test');
        });
    });

    it('shows a loading skeleton while amenities are still loading', () => {
        useQuery.mockReturnValue(undefined);
        render(<AdminAmenitiesScreen />);

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('shows an empty state when there are no amenities', () => {
        useQuery.mockReturnValue([]);
        render(<AdminAmenitiesScreen />);

        expect(screen.getByText('No amenities yet.')).toBeInTheDocument();
    });

    it('renders a row per amenity with its name and category', () => {
        useQuery.mockReturnValue([
            amenity(),
            amenity({ _id: 'amenity-2', name: 'Hot Tub', icon: 'Sparkles', category: 'comfort' }),
        ]);
        render(<AdminAmenitiesScreen />);

        expect(screen.getByText('WiFi')).toBeInTheDocument();
        expect(screen.getByText('Hot Tub')).toBeInTheDocument();
        expect(screen.getByText('Comfort')).toBeInTheDocument();
    });

    it('creates a new amenity through the dialog', async () => {
        useQuery.mockReturnValue([]);
        adminCreateAmenity.mockResolvedValue('new-amenity-id');
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'New amenity' }));
        await user.type(screen.getByLabelText('Name'), 'Pool Table');
        await user.click(screen.getByLabelText('Category'));
        await user.click(await screen.findByRole('option', { name: 'Entertainment' }));
        await user.click(screen.getByRole('radio', { name: 'Dices' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(adminCreateAmenity).toHaveBeenCalledWith({
            name: 'Pool Table',
            icon: 'Dices',
            category: 'entertainment',
        });
    });

    it('blocks submission with an empty name', async () => {
        useQuery.mockReturnValue([]);
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'New amenity' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(await screen.findByText('Name is required.')).toBeInTheDocument();
        expect(adminCreateAmenity).not.toHaveBeenCalled();
    });

    it('edits an amenity pre-filled with its current values', async () => {
        useQuery.mockReturnValue([amenity()]);
        adminUpdateAmenity.mockResolvedValue(null);
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'Edit' }));

        expect(screen.getByLabelText('Name')).toHaveValue('WiFi');

        await user.clear(screen.getByLabelText('Name'));
        await user.type(screen.getByLabelText('Name'), 'Wireless Internet');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(adminUpdateAmenity).toHaveBeenCalledWith({
            amenityId: 'amenity-1',
            name: 'Wireless Internet',
            icon: 'Wifi',
            category: 'essentials',
        });
    });

    it('deletes an amenity after an inline confirm step', async () => {
        useQuery.mockReturnValue([amenity()]);
        adminDeleteAmenity.mockResolvedValue(null);
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(adminDeleteAmenity).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

        expect(adminDeleteAmenity).toHaveBeenCalledWith({ amenityId: 'amenity-1' });
    });

    it('cancels the inline delete confirm without deleting', async () => {
        useQuery.mockReturnValue([amenity()]);
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
        expect(adminDeleteAmenity).not.toHaveBeenCalled();
    });

    it('surfaces the "in use" error via a toast and keeps the row', async () => {
        useQuery.mockReturnValue([amenity()]);
        adminDeleteAmenity.mockRejectedValue(
            new ConvexError('This amenity is used by 1 cabin. Remove it from that cabin first.'),
        );
        const user = userEvent.setup();
        render(<AdminAmenitiesScreen />);

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

        expect(toast.error).toHaveBeenCalledWith(
            'This amenity is used by 1 cabin. Remove it from that cabin first.',
        );
        expect(screen.getByText('WiFi')).toBeInTheDocument();
    });
});
