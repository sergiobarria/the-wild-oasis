import { Link, Outlet, useLocation } from '@remix-run/react'
import { SettingsIcon } from 'lucide-react'
import { ModeToggle } from '~/components/site/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const LINKS = [
	{ label: 'Bookings', to: '/dashboard/bookings' },
	{ label: 'Cabins', to: '/dashboard/cabins' },
	{ label: 'Users', to: '/dashboard/users' },
]

export default function DashboardLayout() {
	const { pathname } = useLocation()

	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
				<div className="flex items-center gap-6">
					<Link to="/dashboard">
						<img src="/logo-dark-sm.webp" alt="The Wild Oasis" className="h-8 w-auto" />
						<span className="sr-only">The Wild Oasis</span>
					</Link>

					<nav className="flex items-center gap-3 text-sm">
						{LINKS.map(({ to, label }) => (
							<Link
								to={to}
								key={label}
								className={cn(
									'rounded-lg px-2.5 py-1.5 font-semibold transition-colors duration-300',
									pathname.startsWith(to) ? 'bg-muted' : 'text-muted-foreground',
								)}
							>
								{label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-6">
					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon" asChild>
							<Link to="/dashboard/settings">
								<SettingsIcon className="size-4" />
							</Link>
						</Button>
						<ModeToggle />
					</div>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>WO</AvatarFallback>
					</Avatar>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto my-8 h-full max-w-screen-xl px-4 lg:px-6">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
