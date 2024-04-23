import { MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { CabinsTable } from '~/components/cabins/cabins-table';
import { db } from '~/lib/db/db.server';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | Hotel Booking System' }];
};

export async function loader() {
	const cabins = await db.query.cabins.findMany();

	return { cabins };
}

export async function action() {
	console.log('ACTION CALLED');
	return redirect('/dashboard/cabins');
}

export default function DashboardCabinsPage() {
	const { cabins } = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className="mb-6 text-3xl font-bold">All Cabins</h1>

			<div className="container py-10">
				<CabinsTable data={cabins} />
			</div>
		</>
	);
}
