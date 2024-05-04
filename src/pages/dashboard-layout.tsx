import { Fragment, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
	CalendarIcon,
	ChevronRightIcon,
	CircleUserRoundIcon,
	FlameKindlingIcon,
	HomeIcon,
	Settings2Icon,
	UsersIcon
} from 'lucide-react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const links = [
	{ label: 'Home', to: '/dashboard', exact: true, icon: <HomeIcon className="size-4" /> },
	{ label: 'Bookings', to: '/dashboard/bookings', exact: false, icon: <CalendarIcon className="size-4" /> },
	{ label: 'Cabins', to: '/dashboard/cabins', exact: false, icon: <FlameKindlingIcon className="size-4" /> },
	{ label: 'Users', to: '/dashboard/users', exact: false, icon: <UsersIcon className="size-4" /> },
	{ label: 'Settings', to: '/dashboard/settings', exact: false, icon: <Settings2Icon className="size-4" /> }
];

const bottomLinks = [
	{ label: 'Logout', to: '/dashboard/account', exact: true, icon: <CircleUserRoundIcon className="size-4" /> }
];

export function DashboardLayout() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="flex min-h-screen border-4 border-black">
			<aside
				className={cn(
					'relative flex flex-col border-r border-gray-300 p-3 duration-300',
					isOpen ? 'w-40' : 'w-14'
				)}
			>
				<button
					className={cn(
						'absolute -right-3.5 top-10 z-10 rounded-full border border-muted-foreground bg-white p-0 text-primary',
						'transition-colors duration-200 hover:bg-gray-200'
					)}
					onClick={() => setIsOpen(prev => !prev)}
				>
					<ChevronRightIcon size={18} className={cn('text-primary', isOpen && 'rotate-180')} />
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
			<div className="w-full border-4 border-blue-500 bg-gray-50 px-8 pb-6">
				<header className="flex h-20 items-center justify-between">
					<Breadcrumbs />

					<Avatar>
						<AvatarImage src="" alt="avatar" />
						<AvatarFallback>TWO</AvatarFallback>
					</Avatar>
				</header>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	);
}

function NavLink({ link, isOpen }: { link: (typeof links)[0]; isOpen: boolean }) {
	const pathname = useLocation().pathname;

	function isActiveLink(href: string, isExact: boolean) {
		if (isExact) return pathname === href;

		return pathname === href || pathname.startsWith(href);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						to={link.to}
						className={cn('flex items-center gap-3 rounded-lg p-2 text-white', {
							'bg-primary text-white': isActiveLink(link.to, link.exact),
							'text-muted-foreground hover:bg-gray-200': !isActiveLink(link.to, link.exact)
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

function Breadcrumbs() {
	const pathname = useLocation().pathname;

	const breadcrumbsParts = pathname.split('/').filter(Boolean);
	const breadcrumbs = breadcrumbsParts.map((part, index) => {
		const href = `/${breadcrumbsParts.slice(0, index + 1).join('/')}`;
		return { label: part, href };
	});

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((part, index) => (
					<Fragment key={part.href}>
						<BreadcrumbItem>
							<BreadcrumbLink href={part.href} className="capitalize">
								{part.label === 'admin' ? 'Home' : part.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
