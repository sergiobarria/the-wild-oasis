import Image from 'next/image';
import Link from 'next/link';

import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import { APP_ROUTES } from '@/lib/routes';
import { SITE_CONFIG } from '@/lib/site-config';

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
                        aria-label={`${SITE_CONFIG.NAME} home`}
                    >
                        <Image src='/assets/logo.webp' alt='' width={32} height={23} />
                        <span className='font-heading text-lg font-medium'>{SITE_CONFIG.NAME}</span>
                    </Link>
                    <p className='max-w-xs text-sm text-muted-foreground'>{SITE_CONFIG.TAGLINE}</p>
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

                <NewsletterForm />
            </div>

            <div className='border-t border-border px-6 py-6 lg:px-8'>
                <p className='text-xs text-muted-foreground'>
                    © {new Date().getFullYear()} {SITE_CONFIG.NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
