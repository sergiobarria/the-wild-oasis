import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResetPasswordScreen } from './reset-password-screen';

const { useRouter, resetPassword } = vi.hoisted(() => ({
    useRouter: vi.fn(),
    resetPassword: vi.fn(),
}));

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter }));
vi.mock('./auth-api', () => ({ resetPassword }));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('New password'), 'newpassword123');
    await user.type(screen.getByLabelText('Confirm new password'), 'newpassword123');
}

describe('ResetPasswordScreen', () => {
    beforeEach(() => {
        push.mockClear();
        resetPassword.mockClear();
        useRouter.mockReturnValue({ push });
    });

    it('shows the invalid-link state and never calls the API when no token is present', () => {
        render(<ResetPasswordScreen token={undefined} />);

        expect(screen.getByText('Invalid or expired link')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute(
            'href',
            '/forgot-password',
        );
        expect(screen.queryByLabelText('New password')).not.toBeInTheDocument();
        expect(resetPassword).not.toHaveBeenCalled();
    });

    it('renders the accessible fields and submit button when a token is present', () => {
        render(<ResetPasswordScreen token='valid-token' />);

        expect(screen.getByLabelText('New password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset password' })).toBeInTheDocument();
    });

    it('resets the password and redirects to sign-in on success', async () => {
        resetPassword.mockResolvedValue({ data: {}, error: null });
        const user = userEvent.setup();
        render(<ResetPasswordScreen token='valid-token' />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Reset password' }));

        expect(resetPassword).toHaveBeenCalledWith('newpassword123', 'valid-token');
        expect(push).toHaveBeenCalledWith('/sign-in');
    });

    it('surfaces an error message inline and does not redirect', async () => {
        resetPassword.mockResolvedValue({
            data: null,
            error: { message: 'That reset link is invalid or has expired.' },
        });
        const user = userEvent.setup();
        render(<ResetPasswordScreen token='expired-token' />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Reset password' }));

        expect(
            await screen.findByText('That reset link is invalid or has expired.'),
        ).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it('blocks submission when passwords do not match', async () => {
        const user = userEvent.setup();
        render(<ResetPasswordScreen token='valid-token' />);
        await user.type(screen.getByLabelText('New password'), 'newpassword123');
        await user.type(screen.getByLabelText('Confirm new password'), 'different123');

        expect(screen.getByRole('button', { name: 'Reset password' })).toBeDisabled();
        expect(resetPassword).not.toHaveBeenCalled();
    });
});
