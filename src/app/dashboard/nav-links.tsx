'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
	{ label: 'Bookings', href: '/dashboard/bookings' },
	{ label: 'Cabins', href: '/dashboard/cabins' },
	{ label: 'Users', href: '/dashboard/users' },
];

export function NavLinks() {
	const pathname = usePathname();

	return (
		<nav className="flex items-center gap-3 text-sm">
			{LINKS.map(({ href, label }) => (
				<Link
					href={href}
					key={label}
					className={cn(
						'rounded-lg px-2.5 py-1.5 font-semibold transition-colors duration-300',
						pathname.startsWith(href) ? 'bg-muted' : 'text-muted-foreground',
					)}
				>
					{label}
				</Link>
			))}
		</nav>
	);
}
