import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Header } from '@/features/layout/header';

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Header', () => {
    it('renders the primary nav links pointing at their routes', () => {
        render(<Header role={null} />);

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Cabins' })).toHaveAttribute('href', '/cabins');
        expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
        expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    });

    it('shows Sign In and Explore Cabins when unauthenticated', () => {
        render(<Header role={null} />);

        expect(screen.getByRole('button', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in');
        expect(screen.getByRole('button', { name: 'Explore Cabins' })).toHaveAttribute(
            'href',
            '/cabins',
        );
        expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument();
    });

    it('shows Dashboard linking to /guest-area for a guest', () => {
        render(<Header role='guest' />);

        expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
            'href',
            '/guest-area',
        );
        expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
    });

    it('shows Admin linking to /admin for an admin', () => {
        render(<Header role='admin' />);

        expect(screen.getByRole('button', { name: 'Admin' })).toHaveAttribute('href', '/admin');
        expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
    });

    it('opens the mobile menu and navigates its links', async () => {
        const user = userEvent.setup();
        render(<Header role={null} />);

        await user.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
        expect(
            screen.getByRole('dialog', { name: 'Menu' }).querySelector('a[href="/cabins"]'),
        ).not.toBeNull();
    });
});
