import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_ROUTES } from '@/lib/routes';

const NAV_LINKS = [
    { label: 'Cabins', href: APP_ROUTES.CABINS },
    { label: 'Contact', href: APP_ROUTES.CONTACT },
    { label: 'Privacy Policy', href: APP_ROUTES.PRIVACY },
    { label: 'Terms', href: APP_ROUTES.TERMS },
] as const;

export function Footer() {
    return (
        <footer className='border-t border-border'>
            <div className='mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8'>
                <div className='flex flex-col gap-3'>
                    <Link
                        href={APP_ROUTES.HOME}
                        className='flex items-center gap-2'
                        aria-label='The Wild Oasis home'
                    >
                        <Image src='/assets/logo.webp' alt='' width={32} height={23} />
                        <span className='font-heading text-lg font-medium'>The Wild Oasis</span>
                    </Link>
                    <p className='max-w-xs text-sm text-muted-foreground'>
                        Handpicked cabins for slowing down, away from the noise.
                    </p>
                </div>

                <nav aria-label='Footer' className='flex flex-col gap-2'>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <form className='flex flex-col gap-2'>
                    <label
                        htmlFor='newsletter-email'
                        className='text-sm font-medium text-foreground'
                    >
                        Newsletter
                    </label>
                    <div className='flex gap-2'>
                        <Input
                            id='newsletter-email'
                            type='email'
                            placeholder='you@example.com'
                            className='flex-1'
                        />
                        <Button type='submit'>Subscribe</Button>
                    </div>
                </form>
            </div>

            <div className='border-t border-border px-6 py-6 lg:px-8'>
                <p className='text-xs text-muted-foreground'>
                    © {new Date().getFullYear()} The Wild Oasis. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
