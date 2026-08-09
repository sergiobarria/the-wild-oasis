import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Header } from '@/features/layout/header';

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Header', () => {
    it('renders the primary nav links pointing at their routes', () => {
        render(<Header isAuthenticated={false} />);

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Cabins' })).toHaveAttribute('href', '/cabins');
        expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
        expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    });

    it('shows Sign In and Explore Cabins when unauthenticated', () => {
        render(<Header isAuthenticated={false} />);

        expect(screen.getByRole('button', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in');
        expect(screen.getByRole('button', { name: 'Explore Cabins' })).toHaveAttribute(
            'href',
            '/cabins',
        );
        expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument();
    });

    it('shows Dashboard when authenticated', () => {
        render(<Header isAuthenticated={true} />);

        expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
            'href',
            '/dashboard',
        );
        expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
    });

    it('opens the mobile menu and navigates its links', async () => {
        const user = userEvent.setup();
        render(<Header isAuthenticated={false} />);

        await user.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
        expect(
            screen.getByRole('dialog', { name: 'Menu' }).querySelector('a[href="/cabins"]'),
        ).not.toBeNull();
    });
});
