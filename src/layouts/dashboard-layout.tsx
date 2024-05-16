import { ReactNode, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
	CalendarIcon,
	ChevronRightIcon,
	CircleUserRoundIcon,
	FlameKindlingIcon,
	LayoutDashboardIcon,
	Settings2Icon,
	UsersIcon,
} from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/site/breadcrumbs'

const links = [
	{
		label: 'Home',
		href: '/dashboard',
		icon: <LayoutDashboardIcon className="size-4" />,
		isExact: true,
	},
	{
		label: 'Bookings',
		href: '/dashboard/bookings',
		icon: <CalendarIcon className="size-4" />,
		isExact: false,
	},
	{
		label: 'Cabins',
		href: '/dashboard/cabins',
		icon: <FlameKindlingIcon className="size-4" />,
		isExact: false,
	},
	{
		label: 'Users',
		href: '/dashboard/users',
		icon: <UsersIcon className="size-4" />,
		isExact: false,
	},
	{
		label: 'Settings',
		href: '/dashboard/settings',
		icon: <Settings2Icon className="size-4" />,
		isExact: false,
	},
]

const bottomLinks = [
	{
		label: 'Account',
		href: '/dashboard/account',
		icon: <CircleUserRoundIcon className="size-4" />,
		isExact: false,
	},
]

export function DashboardLayout() {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="flex h-16 w-full items-center justify-between border-b px-6">
				<Breadcrumbs />
			</header>

			<div className="flex w-full flex-1 overflow-hidden">
				<aside
					className={cn(
						'relative hidden h-[calc(100vh-4rem)] bg-background p-4 duration-300 ease-in-out md:flex md:flex-col md:border-r',
						isOpen ? 'w-36' : 'w-16',
					)}
				>
					<button
						className={cn(
							'absolute -right-3 bottom-20 z-10 rounded-full border border-muted-foreground bg-white p-1 text-primary',
						)}
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<ChevronRightIcon
							className={cn(
								'size-4 text-primary duration-300',
								isOpen ? 'rotate-180' : 'rotate-0',
							)}
						/>
						<span className="sr-only">toggle sidebar</span>
					</button>

					<nav className="flex h-full flex-col justify-between overflow-x-hidden">
						<ul className="space-y-2">
							{links.map((link) => (
								<li key={link.href}>
									<NavLink {...link} isOpen={isOpen} />
								</li>
							))}
						</ul>
						<div className="border-t pt-4">
							<ul className="space-y-2">
								{bottomLinks.map((link) => (
									<li key={link.href}>
										<NavLink {...link} isOpen={isOpen} />
									</li>
								))}
							</ul>
						</div>
					</nav>
				</aside>
				<main className="h-[calc(100vh-4rem)] flex-1 overflow-y-auto bg-gray-50 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

interface NavLinkProps {
	label: string
	href: string
	icon: ReactNode
	isExact: boolean
	isOpen: boolean
}

function NavLink({ label, href, icon, isExact, isOpen }: NavLinkProps) {
	const pathname = useLocation().pathname

	function isActive(href: string, isExact: boolean) {
		if (isExact) return pathname === href

		return pathname.startsWith(href)
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						to={href}
						className={cn('flex items-center gap-3 rounded-lg p-2', {
							'bg-primary text-white': isActive(href, isExact),
							'text-muted-foreground hover:bg-gray-200': !isActive(href, isExact),
						})}
					>
						<div>{icon}</div>
						<span className={cn('text-xs duration-300', !isOpen && 'hidden')}>
							{label}
						</span>
					</Link>
				</TooltipTrigger>

				<TooltipContent side="right">
					<p className="text-sm">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
