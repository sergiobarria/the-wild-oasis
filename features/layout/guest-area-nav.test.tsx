import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GuestAreaNav } from './guest-area-nav';

vi.mock('next/navigation', () => ({
    usePathname: () => '/guest-area',
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe('GuestAreaNav', () => {
    it('renders the desktop nav links pointing at their routes', () => {
        render(<GuestAreaNav />);

        const desktopNav = screen.getByRole('navigation', { name: 'Account' });
        expect(within(desktopNav).getByRole('link', { name: 'Overview' })).toHaveAttribute(
            'href',
            '/guest-area',
        );
        expect(within(desktopNav).getByRole('link', { name: 'Bookings' })).toHaveAttribute(
            'href',
            '/guest-area/bookings',
        );
        expect(within(desktopNav).getByRole('link', { name: 'Profile' })).toHaveAttribute(
            'href',
            '/guest-area/profile',
        );
        expect(within(desktopNav).getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

    it('marks the active link via aria-current', () => {
        render(<GuestAreaNav />);

        const desktopNav = screen.getByRole('navigation', { name: 'Account' });
        expect(within(desktopNav).getByRole('link', { name: 'Overview' })).toHaveAttribute(
            'aria-current',
            'page',
        );
        expect(within(desktopNav).getByRole('link', { name: 'Bookings' })).not.toHaveAttribute(
            'aria-current',
        );
    });

    it('opens a mobile account menu with the same links', async () => {
        const user = userEvent.setup();
        render(<GuestAreaNav />);

        await user.click(screen.getByRole('button', { name: 'Account menu' }));

        const dialog = screen.getByRole('dialog', { name: 'Account' });
        expect(within(dialog).getByRole('link', { name: 'Bookings' })).toHaveAttribute(
            'href',
            '/guest-area/bookings',
        );
        expect(within(dialog).getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

    it('closes the mobile menu after clicking a link', async () => {
        const user = userEvent.setup();
        render(<GuestAreaNav />);

        await user.click(screen.getByRole('button', { name: 'Account menu' }));
        await user.click(
            screen
                .getByRole('dialog', { name: 'Account' })
                .querySelector('a[href="/guest-area/profile"]')!,
        );

        expect(screen.queryByRole('dialog', { name: 'Account' })).not.toBeInTheDocument();
    });
});
