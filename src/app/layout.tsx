import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'The Wild Oasis',
	description: 'Beautiful cabins in the woods.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn('antialiased', inter.className)}>
				<NextTopLoader showSpinner={false} />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
