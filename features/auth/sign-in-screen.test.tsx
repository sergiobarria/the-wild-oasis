import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignInScreen } from './sign-in-screen';

const { useRouter, useSearchParams, signInWithEmail } = vi.hoisted(() => ({
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
    signInWithEmail: vi.fn(),
}));

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter, useSearchParams }));
vi.mock('./auth-api', () => ({ signInWithEmail }));

function mockSearchParams(redirectTo: string | null = null) {
    useSearchParams.mockReturnValue({
        get: (key: string) => (key === 'redirectTo' ? redirectTo : null),
    });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
}

describe('SignInScreen', () => {
    beforeEach(() => {
        push.mockClear();
        signInWithEmail.mockClear();
        useRouter.mockReturnValue({ push });
        mockSearchParams(null);
    });

    it('renders accessible fields, the submit button, and the sign-up link', () => {
        render(<SignInScreen />);

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute(
            'href',
            '/forgot-password',
        );
        expect(screen.getByRole('link', { name: 'Create one' })).toHaveAttribute(
            'href',
            '/sign-up',
        );
    });

    it('redirects a guest to the guest area by default', async () => {
        signInWithEmail.mockResolvedValue({ data: { user: { role: 'guest' } }, error: null });
        const user = userEvent.setup();
        render(<SignInScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(signInWithEmail).toHaveBeenCalledWith({
            email: 'jamie@example.com',
            password: 'password123',
        });
        expect(push).toHaveBeenCalledWith('/guest-area');
    });

    it('redirects an admin to the admin area by default', async () => {
        signInWithEmail.mockResolvedValue({ data: { user: { role: 'admin' } }, error: null });
        const user = userEvent.setup();
        render(<SignInScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(push).toHaveBeenCalledWith('/admin');
    });

    it('an explicit redirectTo wins over the role-aware default', async () => {
        mockSearchParams('/checkout/summary');
        signInWithEmail.mockResolvedValue({ data: { user: { role: 'guest' } }, error: null });
        const user = userEvent.setup();
        render(<SignInScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(push).toHaveBeenCalledWith('/checkout/summary');
    });

    it('falls back to the guest area for an unsafe redirectTo', async () => {
        mockSearchParams('//evil.com');
        signInWithEmail.mockResolvedValue({ data: { user: { role: 'guest' } }, error: null });
        const user = userEvent.setup();
        render(<SignInScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(push).toHaveBeenCalledWith('/guest-area');
    });

    it('surfaces an error message inline and does not redirect', async () => {
        signInWithEmail.mockResolvedValue({
            data: null,
            error: { message: 'Invalid email or password.' },
        });
        const user = userEvent.setup();
        render(<SignInScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it('blocks submission with invalid fields', async () => {
        const user = userEvent.setup();
        render(<SignInScreen />);
        await user.type(screen.getByLabelText('Email'), 'not-an-email');

        expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
        expect(signInWithEmail).not.toHaveBeenCalled();
    });
});
