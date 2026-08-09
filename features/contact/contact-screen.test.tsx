import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactScreen } from './contact-screen';

const { useMutation } = vi.hoisted(() => ({ useMutation: vi.fn() }));
const submitMessage = vi.fn();

vi.mock('convex/react', () => ({ useMutation }));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('Name'), 'Jamie Alder');
    await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
    await user.type(screen.getByLabelText('Subject'), 'Question about a cabin');
    await user.type(screen.getByLabelText('Message'), 'Is Hidden Creek pet-friendly?');
}

describe('ContactScreen', () => {
    beforeEach(() => {
        submitMessage.mockClear();
        useMutation.mockReturnValue(submitMessage);
    });

    it('submits the message and shows a success state', async () => {
        submitMessage.mockResolvedValue({ success: true });
        const user = userEvent.setup();
        render(<ContactScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(await screen.findByText('Message sent')).toBeInTheDocument();
        expect(submitMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Jamie Alder',
                email: 'jamie@example.com',
                subject: 'Question about a cabin',
                message: 'Is Hidden Creek pet-friendly?',
                honeypot: '',
            }),
        );
    });

    it('surfaces a ConvexError message inline, e.g. a rate-limit rejection', async () => {
        submitMessage.mockRejectedValue(
            new ConvexError('Please wait a moment before sending another message.'),
        );
        const user = userEvent.setup();
        render(<ContactScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(
            await screen.findByText('Please wait a moment before sending another message.'),
        ).toBeInTheDocument();
        expect(screen.queryByText('Message sent')).not.toBeInTheDocument();
    });

    it('falls back to a generic message for a non-ConvexError failure', async () => {
        submitMessage.mockRejectedValue(new Error('network error'));
        const user = userEvent.setup();
        render(<ContactScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(
            await screen.findByText('Something went wrong sending your message. Please try again.'),
        ).toBeInTheDocument();
    });

    it('renders the honeypot field hidden from view', () => {
        render(<ContactScreen />);

        const honeypot = screen.getByLabelText('Leave this field blank');
        expect(honeypot).toHaveAttribute('tabindex', '-1');
        expect(honeypot).toHaveAttribute('autocomplete', 'off');
    });
});
