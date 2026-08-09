'use client';

import { useState } from 'react';

import Image from 'next/image';
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
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { label: 'Home', href: APP_ROUTES.HOME },
    { label: 'Cabins', href: APP_ROUTES.CABINS },
    { label: 'About', href: APP_ROUTES.ABOUT },
    { label: 'Contact', href: APP_ROUTES.CONTACT },
] as const;

type HeaderProps = {
    /** The signed-in user's role, or `null` when unauthenticated. */
    role: 'guest' | 'admin' | null;
};

export function Header({ role }: HeaderProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const accountHref = role === 'admin' ? APP_ROUTES.ADMIN : APP_ROUTES.GUEST_AREA;
    const accountLabel = role === 'admin' ? 'Admin' : 'Dashboard';

    return (
        <header className='sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8'>
                <Link
                    href={APP_ROUTES.HOME}
                    className='flex items-center gap-2'
                    aria-label={`${SITE_CONFIG.NAME} home`}
                >
                    <Image src='/assets/logo.webp' alt='' width={32} height={23} priority />
                    <span className='font-heading text-lg font-medium'>{SITE_CONFIG.NAME}</span>
                </Link>

                <nav aria-label='Primary' className='hidden items-center gap-1 md:flex'>
                    {NAV_LINKS.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                                    active && 'text-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className='hidden items-center gap-2 md:flex'>
                    {role ? (
                        <Button
                            render={<Link href={accountHref} />}
                            nativeButton={false}
                            variant='outline'
                        >
                            {accountLabel}
                        </Button>
                    ) : (
                        <>
                            <Button
                                render={<Link href={APP_ROUTES.SIGN_IN} />}
                                nativeButton={false}
                                variant='ghost'
                            >
                                Sign In
                            </Button>
                            <Button render={<Link href={APP_ROUTES.CABINS} />} nativeButton={false}>
                                Explore Cabins
                            </Button>
                        </>
                    )}
                </div>

                <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                    <DialogTrigger
                        render={
                            <Button
                                variant='ghost'
                                size='icon'
                                className='md:hidden'
                                aria-label='Open menu'
                            />
                        }
                    >
                        <MenuIcon />
                    </DialogTrigger>
                    <DialogContent className='top-0 left-0 max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-full'>
                        <DialogHeader>
                            <DialogTitle>Menu</DialogTitle>
                        </DialogHeader>
                        <nav aria-label='Primary' className='flex flex-col gap-1'>
                            {NAV_LINKS.map((link) => {
                                const active = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        aria-current={active ? 'page' : undefined}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                                            active && 'text-foreground',
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className='flex flex-col gap-2'>
                            {role ? (
                                <Button
                                    render={
                                        <Link
                                            href={accountHref}
                                            onClick={() => setMobileOpen(false)}
                                        />
                                    }
                                    nativeButton={false}
                                    variant='outline'
                                >
                                    {accountLabel}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        render={
                                            <Link
                                                href={APP_ROUTES.SIGN_IN}
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        }
                                        nativeButton={false}
                                        variant='ghost'
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        render={
                                            <Link
                                                href={APP_ROUTES.CABINS}
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        }
                                        nativeButton={false}
                                    >
                                        Explore Cabins
                                    </Button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
}
