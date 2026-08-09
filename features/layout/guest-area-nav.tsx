'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { APP_ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

import { useLogout } from './use-logout';

const NAV_ITEMS = [
    { label: 'Overview', href: APP_ROUTES.GUEST_AREA },
    { label: 'Bookings', href: APP_ROUTES.GUEST_AREA_BOOKINGS },
    { label: 'Profile', href: APP_ROUTES.GUEST_AREA_PROFILE },
] as const;

const NAV_ITEM_CLASSES =
    'rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground';

/**
 * Spec §43: "deliberately lightweight" -- a plain link list, not the full
 * collapsible/icon Sidebar the admin app shell uses. On mobile, collapses into a
 * `Dialog`-based menu, same pattern as `header.tsx`'s mobile nav (not the admin
 * `Sidebar`/`SidebarProvider`).
 */
export function GuestAreaNav() {
    const pathname = usePathname();
    const logout = useLogout();
    const [mobileOpen, setMobileOpen] = useState(false);

    function navLinks(onNavigate?: () => void) {
        return NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                    className={cn(NAV_ITEM_CLASSES, active && 'bg-secondary text-foreground')}
                >
                    {item.label}
                </Link>
            );
        });
    }

    function logoutButton(onLogout?: () => void) {
        return (
            <button
                type='button'
                onClick={() => {
                    onLogout?.();
                    logout();
                }}
                className={cn(
                    NAV_ITEM_CLASSES,
                    'text-destructive hover:bg-destructive/10 hover:text-destructive',
                )}
            >
                Logout
            </button>
        );
    }

    return (
        <>
            <nav aria-label='Account' className='hidden h-full flex-col gap-1 lg:flex'>
                {navLinks()}
                <div className='mt-auto'>{logoutButton()}</div>
            </nav>

            <div className='lg:hidden'>
                <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                    <DialogTrigger
                        render={<Button variant='outline' className='w-full justify-start gap-2' />}
                    >
                        <MenuIcon className='size-4' />
                        Account menu
                    </DialogTrigger>
                    <DialogContent className='top-0 left-0 max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-full'>
                        <DialogHeader>
                            <DialogTitle>Account</DialogTitle>
                        </DialogHeader>
                        <nav aria-label='Account' className='flex flex-col gap-1'>
                            {navLinks(() => setMobileOpen(false))}
                            {logoutButton(() => setMobileOpen(false))}
                        </nav>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
