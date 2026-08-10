import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SignUpScreen } from './sign-up-screen';

const { useRouter, signUpWithEmail } = vi.hoisted(() => ({
    useRouter: vi.fn(),
    signUpWithEmail: vi.fn(),
}));

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter }));
vi.mock('./auth-api', () => ({ signUpWithEmail }));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('First name'), 'Jamie');
    await user.type(screen.getByLabelText('Last name'), 'Alder');
    await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox'));
}

describe('SignUpScreen', () => {
    beforeEach(() => {
        push.mockClear();
        signUpWithEmail.mockClear();
        useRouter.mockReturnValue({ push });
    });

    it('renders accessible fields, the submit button, and the sign-in link', () => {
        render(<SignUpScreen />);

        expect(screen.getByLabelText('First name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
    });

    it('submits with the combined name and redirects to the guest area', async () => {
        signUpWithEmail.mockResolvedValue({ data: {}, error: null });
        const user = userEvent.setup();
        render(<SignUpScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Create account' }));

        expect(signUpWithEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                firstName: 'Jamie',
                lastName: 'Alder',
                email: 'jamie@example.com',
                password: 'password123',
            }),
        );
        expect(push).toHaveBeenCalledWith('/guest-area');
    });

    it('surfaces an error message inline and does not redirect', async () => {
        signUpWithEmail.mockResolvedValue({
            data: null,
            error: { message: 'An account with this email already exists.' },
        });
        const user = userEvent.setup();
        render(<SignUpScreen />);
        await fillValidForm(user);

        await user.click(screen.getByRole('button', { name: 'Create account' }));

        expect(
            await screen.findByText('An account with this email already exists.'),
        ).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it('blocks submission when passwords do not match', async () => {
        const user = userEvent.setup();
        render(<SignUpScreen />);
        await user.type(screen.getByLabelText('First name'), 'Jamie');
        await user.type(screen.getByLabelText('Last name'), 'Alder');
        await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Confirm password'), 'different123');
        await user.click(screen.getByRole('checkbox'));

        expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled();
        expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
        expect(signUpWithEmail).not.toHaveBeenCalled();
    });

    it('blocks submission until the terms checkbox is accepted', async () => {
        const user = userEvent.setup();
        render(<SignUpScreen />);
        await user.type(screen.getByLabelText('First name'), 'Jamie');
        await user.type(screen.getByLabelText('Last name'), 'Alder');
        await user.type(screen.getByLabelText('Email'), 'jamie@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Confirm password'), 'password123');

        expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled();

        await user.click(screen.getByRole('checkbox'));

        expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
    });

    it("shows the terms checkbox's own inline error only once touched", async () => {
        const user = userEvent.setup();
        render(<SignUpScreen />);

        expect(
            screen.queryByText('You must accept the terms to continue.'),
        ).not.toBeInTheDocument();

        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('checkbox'));

        expect(
            await screen.findByText('You must accept the terms to continue.'),
        ).toBeInTheDocument();
    });
});
