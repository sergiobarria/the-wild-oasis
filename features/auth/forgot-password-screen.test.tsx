import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ForgotPasswordScreen } from './forgot-password-screen';

const { requestPasswordReset } = vi.hoisted(() => ({
    requestPasswordReset: vi.fn(),
}));

vi.mock('./auth-api', () => ({ requestPasswordReset }));

describe('ForgotPasswordScreen', () => {
    beforeEach(() => {
        requestPasswordReset.mockClear();
        requestPasswordReset.mockResolvedValue({ data: {}, error: null });
    });

    it('renders the accessible email field, submit button, and sign-in link', () => {
        render(<ForgotPasswordScreen />);

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
    });

    it('requests a reset and shows the generic success state', async () => {
        const user = userEvent.setup();
        render(<ForgotPasswordScreen />);

        await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
        await user.click(screen.getByRole('button', { name: 'Send reset link' }));

        expect(requestPasswordReset).toHaveBeenCalledWith('jamie@example.com');
        expect(await screen.findByText('Check your email')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute(
            'href',
            '/sign-in',
        );
    });

    it('blocks submission with an invalid email', async () => {
        const user = userEvent.setup();
        render(<ForgotPasswordScreen />);

        await user.type(screen.getByLabelText('Email'), 'not-an-email');

        expect(screen.getByRole('button', { name: 'Send reset link' })).toBeDisabled();
        expect(requestPasswordReset).not.toHaveBeenCalled();
    });
});
