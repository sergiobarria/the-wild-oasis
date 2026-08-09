import Image from 'next/image';
import Link from 'next/link';

import { APP_ROUTES } from '@/lib/routes';
import { SITE_CONFIG } from '@/lib/site-config';

type AuthSplitLayoutProps = {
    children: React.ReactNode;
};

/**
 * Spec §53: photography + form split, collapsing to a single column (form
 * only) on mobile.
 */
export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
    return (
        <div className='grid min-h-svh lg:grid-cols-2'>
            <div className='relative hidden lg:block'>
                <Image
                    src='/assets/about-1.webp'
                    alt=''
                    fill
                    priority
                    sizes='50vw'
                    className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />
                <Link
                    href={APP_ROUTES.HOME}
                    className='absolute top-8 left-8 flex items-center gap-2 text-white'
                    aria-label={`${SITE_CONFIG.NAME} home`}
                >
                    <Image src='/assets/logo.webp' alt='' width={32} height={23} />
                    <span className='font-heading text-lg font-medium'>{SITE_CONFIG.NAME}</span>
                </Link>
            </div>
            <div className='flex flex-col items-center justify-center px-6 py-12 lg:px-12'>
                <div className='w-full max-w-sm space-y-8'>
                    <Link
                        href={APP_ROUTES.HOME}
                        className='flex items-center justify-center gap-2 lg:hidden'
                        aria-label={`${SITE_CONFIG.NAME} home`}
                    >
                        <Image src='/assets/logo.webp' alt='' width={32} height={23} />
                        <span className='font-heading text-lg font-medium'>{SITE_CONFIG.NAME}</span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
