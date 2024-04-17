import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { AppHeader } from '~/components/layout/header';
import { AppSidebar } from '~/components/layout/sidebar';

export const meta: MetaFunction = () => {
	return [{ title: 'Home | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function DashboardLayout() {
	return (
		<div className="grid h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr]">
			<AppHeader />
			<AppSidebar />
			<main className="bg-gray-50 p-10">
				<Outlet />
			</main>
		</div>
	);
}
