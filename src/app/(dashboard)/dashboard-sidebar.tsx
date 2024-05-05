'use client';

import { usePathname } from 'next/navigation';

import {
	CalendarIcon,
	ChevronRightIcon,
	CircleUserRoundIcon,
	FlameKindlingIcon,
	HomeIcon,
	Settings2Icon,
	UsersIcon
} from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const links = [
	{ label: 'Home', href: '/dashboard', exact: true, icon: <HomeIcon className="size-4" /> },
	{ label: 'Bookings', href: '/bookings', exact: false, icon: <CalendarIcon className="size-4" /> },
	{ label: 'Cabins', href: '/cabins', exact: false, icon: <FlameKindlingIcon className="size-4" /> },
	{ label: 'Users', href: '/users', exact: false, icon: <UsersIcon className="size-4" /> },
	{ label: 'Settings', href: '/settings', exact: false, icon: <Settings2Icon className="size-4" /> }
];

const bottomLinks = [
	{ label: 'Logout', href: '/account', exact: true, icon: <CircleUserRoundIcon className="size-4" /> }
];

type DashboardSidebarProps = {
	isOpen: boolean;
	onClick: () => void;
};

export default function DashboardSidebar({ isOpen, onClick }: DashboardSidebarProps) {
	return (
		<aside
			className={cn(
				'fixed inset-y-0 flex w-full flex-col border-r bg-white p-3 duration-300',
				isOpen ? 'w-40' : 'w-14'
			)}
		>
			<button
				className={cn(
					'border-muted-foreground text-primary absolute -right-3 top-10 z-10 rounded-full border bg-white p-1'
				)}
				onClick={onClick}
			>
				<ChevronRightIcon className={cn('text-primary size-4', isOpen && 'rotate-180')} />
			</button>

			<nav className="mt-24 flex flex-col space-y-3">
				{links.map(link => (
					<NavLink key={link.label} link={link} isOpen={isOpen} />
				))}
			</nav>

			<nav className="mt-auto flex flex-col space-y-3">
				{bottomLinks.map(link => (
					<NavLink key={link.label} link={link} isOpen={isOpen} />
				))}
			</nav>
		</aside>
	);
}

function NavLink({ link, isOpen }: { link: (typeof links)[0]; isOpen: boolean }) {
	const pathname = usePathname();

	function isActiveLink(href: string, isExact: boolean) {
		if (isExact) return pathname === href;

		return pathname === href || pathname.startsWith(href);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={link.href}
						className={cn('flex items-center gap-3 rounded-lg p-2 text-white', {
							'bg-primary text-white dark:bg-gray-100 dark:text-black': isActiveLink(
								link.href,
								link.exact
							),
							'text-muted-foreground hover:bg-gray-200': !isActiveLink(link.href, link.exact)
						})}
					>
						<div>{link.icon}</div>
						<span className={cn('duration-400 text-xs', !isOpen && 'hidden')}>{link.label}</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p className="p-0 text-xs capitalize">{link.label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
