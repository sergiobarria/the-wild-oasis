import Image from 'next/image';
import Link from 'next/link';

import { AvatarFallback } from '@radix-ui/react-avatar';
import { SettingsIcon } from 'lucide-react';

import { ModeToggle } from '@/components/site/mode-toggle';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { NavLinks } from './nav-links';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-16 max-w-screen-2xl items-center justify-between border-b px-4 lg:px-6">
				<div className="flex items-center gap-6">
					<Link href="/dashboard">
						<Image
							src="/logo-dark-sm.webp"
							alt="The Wild Oasis"
							width={32}
							height={32}
						/>
					</Link>
					<NavLinks />
				</div>

				<div className="flex items-center gap-6">
					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon" asChild>
							<Link href="/dashboard/settings">
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
				<div className="mx-auto my-8 h-full max-w-screen-2xl px-4 lg:px-6">{children}</div>
			</main>
		</div>
	);
}
