import { Link, useLocation } from '@remix-run/react';
import { HomeIcon, CalendarIcon, FlameKindlingIcon, UsersIcon, SettingsIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils/helpers';
import logo from '~/assets/logo-light.webp';
import logoSmall from '~/assets/logo-light-sm.webp';

const NAV_LINKS = [
	{ label: 'Home', to: '/dashboard', exact: true, icon: <HomeIcon size={20} /> },
	{ label: 'Bookings', to: '/dashboard/bookings', exact: false, icon: <CalendarIcon size={20} /> },
	{ label: 'Cabins', to: '/dashboard/cabins', exact: false, icon: <FlameKindlingIcon size={20} /> },
	{ label: 'Users', to: '/dashboard/users', exact: false, icon: <UsersIcon size={20} /> }
];

const SETTINGS_LINK = { label: 'Settings', to: '/dashboard/settings', exact: false, icon: <SettingsIcon size={20} /> };

interface NavLinkProps {
	link: (typeof NAV_LINKS)[number];
	isOpen: boolean;
}

function NavLink({ link, isOpen }: NavLinkProps) {
	const location = useLocation();

	function isActiveLink(to: string, isExact = false) {
		if (isExact) return location.pathname === to;

		return location.pathname === to || location.pathname.startsWith(to);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					to={link.to}
					className={cn('text-muted-foreground mt-3 flex rounded-lg transition-colors duration-300', {
						'bg-primary text-background': isActiveLink(link.to, link.exact),
						'hover:bg-primary hover:text-primary-foreground': !isActiveLink(link.to, link.exact),
						'size-9 items-center justify-center': !isOpen,
						'gap-2 px-2.5 py-2': isOpen
					})}
				>
					{link.icon}
					<span className="text-sm">{isOpen && link.label}</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right">{link.label}</TooltipContent>
		</Tooltip>
	);
}

interface DashboardSidebarProps {
	isOpen: boolean;
}

export function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
	return (
		<aside
			className={cn(
				'bg-background fixed inset-y-0 left-0 z-10 hidden flex-col border-r sm:flex',
				'transition-all duration-300 ease-in-out',
				isOpen ? 'w-56' : 'w-14'
			)}
		>
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
				<Link to="/dashboard" className="group flex items-center justify-center">
					<img
						src={isOpen ? logo : logoSmall}
						alt="logo"
						className={cn(isOpen ? 'size-20 py-2' : 'size-8 shrink-0')}
					/>
					<span className="sr-only">Logo</span>
				</Link>

				<div className="mt-4 w-full">
					<TooltipProvider>
						{NAV_LINKS.map((link) => (
							<NavLink key={link.label} link={link} isOpen={isOpen} />
						))}
					</TooltipProvider>
				</div>
			</nav>

			<nav className="mb-6 mt-auto w-full px-2">
				<TooltipProvider>
					<NavLink link={SETTINGS_LINK} isOpen={isOpen} />
				</TooltipProvider>
			</nav>
		</aside>
	);
}
