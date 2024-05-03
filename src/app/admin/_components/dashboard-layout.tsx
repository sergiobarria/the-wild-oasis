'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarIcon, FlameKindlingIcon, HomeIcon, UsersIcon, SettingsIcon, ArrowLeftIcon } from 'lucide-react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const links = [
	{ label: 'Home', href: '/admin', exact: true, icon: <HomeIcon size={18} /> },
	{ label: 'Bookings', href: '/admin/bookings', exact: false, icon: <CalendarIcon size={18} /> },
	{ label: 'Cabins', href: '/admin/cabins', exact: false, icon: <FlameKindlingIcon size={18} /> },
	{ label: 'Users', href: '/admin/users', exact: false, icon: <UsersIcon size={18} /> }
];

const settingsLink = { label: 'Settings', href: '/admin/settings', exact: false, icon: <SettingsIcon size={18} /> };

type DashboardLayoutProps = {
	children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="flex min-h-screen">
			<aside
				className={cn(
					'fixed inset-y-0 flex min-h-screen flex-col border-r bg-white p-3 duration-300',
					isOpen ? 'w-40' : 'w-16'
				)}
			>
				<button
					className="absolute -right-3.5 top-7 rounded-lg border bg-primary p-1.5 text-white"
					onClick={() => setIsOpen((prev) => !prev)}
					title="Toggle Sidebar"
				>
					<ArrowLeftIcon size={16} className={cn(!isOpen && 'rotate-180')} />
				</button>

				<nav className="relative mt-20 flex flex-1 flex-col gap-3">
					{links.map((link) => (
						<NavLink key={link.label} link={link} isOpen={isOpen} />
					))}
				</nav>

				<nav className="mt-auto pb-6">
					<NavLink link={settingsLink} isOpen={isOpen} />
				</nav>
			</aside>
			<div className={cn('flex-1 bg-gray-50 px-5 duration-300', isOpen ? 'pl-48' : 'pl-24')}>
				<header className="flex h-20 items-center justify-between">
					<Breadcrumbs />

					<Avatar>
						<AvatarImage src="" alt="@shadcn" />
						<AvatarFallback>WO</AvatarFallback>
					</Avatar>
				</header>
				<main className="my-2">{children}</main>
			</div>
		</div>
	);
}

type NavLinkProps = {
	link: (typeof links)[0];
	isOpen: boolean;
};

function NavLink({ link, isOpen }: NavLinkProps) {
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
						key={link.label}
						href={link.href}
						className={cn('flex items-center rounded-lg transition-colors duration-100', {
							'bg-primary text-primary-foreground': isActiveLink(link.href, link.exact),
							'text-muted-foreground hover:bg-primary hover:text-primary-foreground': !isActiveLink(
								link.href,
								link.exact
							),
							'size-9 items-center justify-center': !isOpen,
							'gap-2 px-2.5 py-2': isOpen
						})}
					>
						<div>{link.icon}</div>
						<span className={cn('text-sm duration-300', !isOpen && 'hidden')}>{link.label}</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p className="capitalize">{link.label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function Breadcrumbs() {
	const pathname = usePathname();

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
