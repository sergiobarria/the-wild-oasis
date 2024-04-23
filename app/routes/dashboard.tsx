import { Outlet } from '@remix-run/react';
import { useState } from 'react';

import { DashboardHeader } from '~/components/site/dashboard-header';
import { DashboardSidebar } from '~/components/site/dashboard-sidebar';
import { cn } from '~/lib/utils/helpers';

export default function DashboardLayout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

	function toggleDrawer() {
		setIsDrawerOpen((prev) => !prev);
	}

	return (
		<div className="bg-muted/40 min-h-screen w-full flex-col border-4 border-red-500">
			<DashboardSidebar isOpen={isDrawerOpen} />

			<div
				className={cn(
					'flex flex-col transition-all duration-300 ease-in-out sm:gap-4 sm:py-4',
					isDrawerOpen ? 'ml-56' : 'sm:ml-14'
				)}
			>
				<DashboardHeader isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

				<main className="my-6 flex-1 items-start gap-4 border-4 border-blue-500 px-4 sm:py-0 md:gap-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
