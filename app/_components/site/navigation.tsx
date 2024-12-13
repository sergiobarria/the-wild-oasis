'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/_lib/utils';

const NAV_LINKS = [
	{ href: '/cabins', label: 'Cabins' },
	{ href: '/about', label: 'About' },
	{ href: '/account', label: 'Account' },
];

export function Navigation() {
	const pathname = usePathname();

	return (
		<nav className="z-10 text-xl">
			<ul className="flex items-center gap-16">
				{NAV_LINKS.map(({ href, label }) => (
					<li key={label}>
						<Link
							href={href}
							className={cn(
								'transition-colors hover:text-accent',
								pathname.startsWith(href) ? 'text-accent' : 'text-white/60',
							)}
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
