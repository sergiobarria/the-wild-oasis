'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CalendarDaysIcon, HomeIcon, UserIcon } from 'lucide-react';

import { SignOutButton } from '@/_components/account/sign-out-button';
import { cn } from '@/_lib/utils';

const SIDE_NAV_LINKS = [
	{ label: 'Home', href: '/account', icon: <HomeIcon className="size-5 text-white" /> },
	{
		label: 'Reservations',
		href: '/account/reservations',
		icon: <CalendarDaysIcon className="size-5 text-white" />,
	},
	{
		label: 'Guest Profile',
		href: '/account/profile',
		icon: <UserIcon className="size-5 text-white" />,
	},
];

export function SideNavigation() {
	const pathname = usePathname();

	return (
		<nav className="h-full border-r border-primary">
			<ul className="flex h-full flex-col gap-2 text-lg">
				{SIDE_NAV_LINKS.map(link => (
					<li key={link.label}>
						<Link
							href={link.href}
							className={cn(
								'flex items-center gap-4 px-5 py-3 font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground/80',
								pathname === link.href && 'bg-accent',
							)}
						>
							{link.icon}
							<span>{link.label}</span>
						</Link>
					</li>
				))}

				<li className="mt-auto">
					<SignOutButton />
				</li>
			</ul>
		</nav>
	);
}
