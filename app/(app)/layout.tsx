import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';

import { Header } from '@/_components/site/header';
import { cn } from '@/_lib/utils';

import '../globals.css';

const josefinSans = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		template: '%s | The Wild Oasis',
		default: 'The Wild Oasis',
	},
	description:
		'Luxury cabins in the heart of the wilderness. Surrounded by nature, you can relax and unwind in our beautiful cabins.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					josefinSans.className,
					'relative flex min-h-screen flex-col bg-background antialiased',
				)}
			>
				<NextTopLoader showSpinner={false} color="#C69963" />
				<Header />
				<div className="grid flex-1 px-8 py-12">
					<main className="mx-auto w-full max-w-7xl">{children}</main>
				</div>
			</body>
		</html>
	);
}
