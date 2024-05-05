'use client';

import { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import DashboardSidebar from './dashboard-sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="flex h-screen">
			<DashboardSidebar isOpen={isOpen} onClick={() => setIsOpen(prev => !prev)} />
			<div className={cn('flex w-full flex-col px-8 duration-300', isOpen ? 'ml-40' : 'ml-14')}>
				<header className="flex h-20 items-center">
					<Breadcrumbs />
				</header>
				<main className="flex-1">{children}</main>
			</div>
		</div>
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
