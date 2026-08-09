import type { Metadata } from 'next';
import { Geist_Mono, Josefin_Sans } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/sonner';
import { getToken } from '@/lib/auth-server';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';
import { ConvexClientProvider } from '@/providers/convex-client-provider';

import './globals.css';

// Brand typeface per docs/00_SPEC.md §14. Fallback stack (ui-sans-serif,
// sans-serif, system-ui) is handled by Tailwind's font-sans utility already.
const josefinSans = Josefin_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.URL),
    title: SITE_CONFIG.NAME,
    description: SITE_CONFIG.DESCRIPTION,
    icons: {
        icon: [
            { url: '/favicon/favicon.ico', sizes: 'any' },
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/favicon/apple-touch-icon.png',
    },
    manifest: '/favicon/site.webmanifest',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
    const initialToken = await getToken();

    return (
        <html
            lang='en'
            // Dark is the primary brand experience (spec §13). Hardcoded until a
            // theme switcher exists -- light mode tokens stay fully defined in
            // globals.css for when one does.
            className={cn(
                'dark',
                'h-full',
                'antialiased',
                geistMono.variable,
                'font-sans',
                josefinSans.variable,
            )}
        >
            <body className='flex min-h-full flex-col'>
                {/* Route-change progress bar. Colour tracks the theme token, so it
                    follows light/dark without a second definition. */}
                <NextTopLoader
                    color='var(--primary)'
                    height={2}
                    shadow={false}
                    showSpinner={false}
                    zIndex={9999}
                />
                <ConvexClientProvider initialToken={initialToken}>{children}</ConvexClientProvider>
                {/* No theme switcher yet (see the `dark` class above), so pin the
                    toaster to dark rather than letting it fall back to system. */}
                <Toaster theme='dark' />
            </body>
        </html>
    );
}
