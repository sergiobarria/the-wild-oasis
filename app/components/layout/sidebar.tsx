import { NavLink, useLocation } from '@remix-run/react';
import { HomeIcon, CalendarIcon, FlameKindlingIcon, UsersIcon, SettingsIcon } from 'lucide-react';

import logoWhite from '~/assets/logo-light.png';
import { cn } from '~/lib/utils';

const NAV_LINKS = [
	{ label: 'Home', to: '/dashboard', current: true, icon: <HomeIcon className="size-4" />, exact: true },
	{
		label: 'Bookings',
		to: '/dashboard/bookings',
		current: false,
		icon: <CalendarIcon className="size-4" />,
		exact: false,
	},
	{
		label: 'Cabins',
		to: '/dashboard/cabins',
		current: false,
		icon: <FlameKindlingIcon className="size-4" />,
		exact: false,
	},
	{ label: 'Users', to: '/dashboard/users', current: false, icon: <UsersIcon className="size-4" />, exact: false },
	{
		label: 'Settings',
		to: '/dashboard/settings',
		current: false,
		icon: <SettingsIcon className="size-4" />,
		exact: false,
	},
];

function isActiveLink(pathname: string, to: string, isExact = false) {
	if (isExact) return pathname === to;

	return pathname === to || pathname.startsWith(to);
}

export function AppSidebar() {
	const location = useLocation();

	return (
		<aside className="row-span-full border-r">
			<div>
				<img src={logoWhite} alt="logo" className="mx-auto my-8 w-20" />
			</div>

			{/* Navigation Links */}
			<nav className="flex flex-col space-y-2 px-4">
				{NAV_LINKS.map(({ label, to, icon, exact }) => (
					<NavLink
						key={label}
						to={to}
						className={() => {
							const isCurrent = isActiveLink(location.pathname, to, exact);

							return cn('flex items-center gap-3 rounded-md px-4 py-3 text-sm', {
								'bg-gray-200 font-semibold text-primary': isCurrent,
								'hover:bg-gray-200': !isCurrent,
							});
						}}
					>
						{icon}
						<span className="font-light">{label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
