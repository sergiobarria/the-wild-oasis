'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
 * collapsible/icon Sidebar the admin app shell uses.
 */
export function GuestAreaNav() {
    const pathname = usePathname();
    const logout = useLogout();

    return (
        <nav aria-label='Account' className='flex h-full flex-col gap-1'>
            {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(NAV_ITEM_CLASSES, active && 'bg-secondary text-foreground')}
                    >
                        {item.label}
                    </Link>
                );
            })}
            <button
                type='button'
                onClick={logout}
                className={cn(
                    NAV_ITEM_CLASSES,
                    'mt-auto text-destructive hover:bg-destructive/10 hover:text-destructive',
                )}
            >
                Logout
            </button>
        </nav>
    );
}
