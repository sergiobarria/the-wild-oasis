import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfileForm } from './profile-form';

const { useQuery } = vi.hoisted(() => ({ useQuery: vi.fn() }));
const { updateProfile } = vi.hoisted(() => ({ updateProfile: vi.fn() }));
const { toast } = vi.hoisted(() => ({ toast: { success: vi.fn() } }));

vi.mock('convex/react', () => ({ useQuery }));
vi.mock('../profile-api', () => ({ updateProfile }));
vi.mock('sonner', () => ({ toast }));

describe('ProfileForm', () => {
    beforeEach(() => {
        updateProfile.mockClear();
        toast.success.mockClear();
    });

    it('shows a loading state while the user is being fetched', () => {
        useQuery.mockReturnValue(undefined);
        const { container } = render(<ProfileForm />);

        expect(container.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('pre-fills first and last name split from the stored name', () => {
        useQuery.mockReturnValue({ name: 'Jamie Alder', email: 'jamie@example.com', phone: null });
        render(<ProfileForm />);

        expect(screen.getByLabelText('First name')).toHaveValue('Jamie');
        expect(screen.getByLabelText('Last name')).toHaveValue('Alder');
    });

    it('shows the email as read-only text, not an editable field', () => {
        useQuery.mockReturnValue({ name: 'Jamie Alder', email: 'jamie@example.com', phone: null });
        render(<ProfileForm />);

        expect(screen.getByText('jamie@example.com')).toBeInTheDocument();
        expect(screen.queryByLabelText('Email')).toBeNull();
    });

    it('joins first and last name and saves the phone number on submit', async () => {
        updateProfile.mockResolvedValue({ error: null });
        useQuery.mockReturnValue({ name: 'Jamie Alder', email: 'jamie@example.com', phone: null });
        const user = userEvent.setup();
        render(<ProfileForm />);

        await user.clear(screen.getByLabelText('Last name'));
        await user.type(screen.getByLabelText('Last name'), 'Rivera');
        await user.type(screen.getByLabelText('Phone (optional)'), '555-0100');
        await user.click(screen.getByRole('button', { name: 'Save changes' }));

        expect(updateProfile).toHaveBeenCalledWith({
            firstName: 'Jamie',
            lastName: 'Rivera',
            phone: '555-0100',
        });
        expect(toast.success).toHaveBeenCalledWith('Profile updated');
    });

    it('surfaces a server error message inline', async () => {
        updateProfile.mockResolvedValue({ error: { message: 'Something specific went wrong.' } });
        useQuery.mockReturnValue({ name: 'Jamie Alder', email: 'jamie@example.com', phone: null });
        const user = userEvent.setup();
        render(<ProfileForm />);

        await user.click(screen.getByRole('button', { name: 'Save changes' }));

        expect(await screen.findByText('Something specific went wrong.')).toBeInTheDocument();
        expect(toast.success).not.toHaveBeenCalled();
    });
});
