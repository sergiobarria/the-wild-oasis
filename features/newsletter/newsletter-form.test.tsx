import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NewsletterForm } from './newsletter-form';

const { useMutation } = vi.hoisted(() => ({ useMutation: vi.fn() }));
const subscribe = vi.fn();

vi.mock('convex/react', () => ({ useMutation }));

describe('NewsletterForm', () => {
    beforeEach(() => {
        subscribe.mockClear();
        useMutation.mockReturnValue(subscribe);
    });

    it('subscribes with the entered email', async () => {
        subscribe.mockResolvedValue({ success: true });
        const user = userEvent.setup();
        render(<NewsletterForm />);

        await user.type(screen.getByLabelText('Newsletter'), 'jamie@example.com');
        await user.click(screen.getByRole('button', { name: 'Subscribe' }));

        expect(subscribe).toHaveBeenCalledWith({ email: 'jamie@example.com' });
    });

    it('disables the submit button for an invalid email', async () => {
        const user = userEvent.setup();
        render(<NewsletterForm />);

        await user.type(screen.getByLabelText('Newsletter'), 'not-an-email');
        await user.tab();

        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
        expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    });

    it('surfaces a ConvexError message inline, e.g. a rate-limit rejection', async () => {
        subscribe.mockRejectedValue(new ConvexError('Please wait a moment before trying again.'));
        const user = userEvent.setup();
        render(<NewsletterForm />);

        await user.type(screen.getByLabelText('Newsletter'), 'jamie@example.com');
        await user.click(screen.getByRole('button', { name: 'Subscribe' }));

        expect(
            await screen.findByText('Please wait a moment before trying again.'),
        ).toBeInTheDocument();
    });

    it('falls back to a generic message for a non-ConvexError failure', async () => {
        subscribe.mockRejectedValue(new Error('network error'));
        const user = userEvent.setup();
        render(<NewsletterForm />);

        await user.type(screen.getByLabelText('Newsletter'), 'jamie@example.com');
        await user.click(screen.getByRole('button', { name: 'Subscribe' }));

        expect(
            await screen.findByText('Something went wrong subscribing. Please try again.'),
        ).toBeInTheDocument();
    });
});
