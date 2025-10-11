import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router'

import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

import { SignOutButton } from '@/components/shared/sign-out-button'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/constants'
import { cn } from '@/lib/utils'

const LINKS = [
    { to: '/cabins', label: 'Cabins' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
]

export const Route = createFileRoute('/(web)')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const { session } = Route.useRouteContext()

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b px-8 py-3">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link to="/" className="z-10 flex items-center gap-2">
                        <img src="/logo-2.webp" alt="logo" width={40} height={40} />
                        <span className="text-xl font-semibold">{APP_NAME}</span>
                    </Link>

                    <nav className="flex items-center gap-8">
                        {LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={cn(
                                    'hover:text-primary transition-colors duration-300 ease-in-out',
                                    location.pathname === link.to && 'text-primary',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {session && (
                            <div className="flex items-center gap-3">
                                <Button size="sm" asChild>
                                    <Link to="/guest">Guest Area</Link>
                                </Button>
                                {/* TODO: Only admins can see the dashboard button */}
                                <Button size="sm" variant="outline" asChild>
                                    <Link to="/admin">Dashboard</Link>
                                </Button>
                                <SignOutButton showLabel variant="outline" />
                            </div>
                        )}

                        {!session && (
                            <div className="flex items-center gap-3">
                                <Button size="sm" variant="outline" asChild>
                                    <Link to="/sign-in">Sign In</Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <Link to="/sign-up">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <div className="flex-1">
                <main className="w-full">
                    <Outlet />
                </main>
            </div>

            <footer className="bg-base-100 border-t border-zinc-800 text-sm text-zinc-400">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-3">
                    {/* Logo */}
                    <div>
                        <Link to="/" className="mb-4 flex items-center gap-4">
                            <img src="/logo-2.webp" alt="The Wild Oasis logo" width="40" height="40" />
                            <span className="text-lg font-semibold text-zinc-100">The Wild Oasis</span>
                        </Link>
                        <p className="max-w-xs leading-relaxed">
                            Luxury cabins in the heart of the Dolomites. Unwind, reconnect, and experience the magic of
                            nature.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="mb-4 font-medium text-zinc-100">Explore</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/cabins" className="hover:text-accent transition-colors">
                                    Cabins
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-accent transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-accent transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 font-medium text-zinc-100">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <div className="flex items-center gap-2">
                                    <MailIcon className="text-accent size-4" />
                                    <a
                                        href="mailto:hello@thewildoasis.com"
                                        className="hover:text-accent transition-colors"
                                    >
                                        hello@thewildoasis.com
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="text-accent size-4" />
                                    <a href="tel:+1234567890" className="hover:text-accent transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="text-accent mt-1 size-4" />
                                    <span className="leading-snug">
                                        Via delle Dolomiti 25
                                        <br />
                                        39030 Cortina d'Ampezzo (BZ), Italy
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 px-8 py-6 text-center text-xs text-zinc-500">
                    © {new Date().getFullYear()} The Wild Oasis. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
