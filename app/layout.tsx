import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';

import { ConvexClientProvider } from '@/components/convex-client-provider';
import { getToken } from '@/lib/auth-server';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'The Wild Oasis',
    description: 'Cabin booking for The Wild Oasis.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
    const initialToken = await getToken();

    return (
        <html
            lang='en'
            className={cn(
                'h-full',
                'antialiased',
                geistSans.variable,
                geistMono.variable,
                'font-sans',
                inter.variable,
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
            </body>
        </html>
    );
}
