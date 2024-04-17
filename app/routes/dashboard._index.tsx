import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const meta: MetaFunction = () => {
	return [{ title: 'Home | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function DashboardHomePage() {
	return (
		<>
			<h1 className="text-3xl font-bold underline">Dashboard Home Page</h1>
			<main>
				<Outlet />
			</main>
		</>
	);
}
