import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { PlusIcon } from 'lucide-react';

import { CabinsTable } from '~/components/cabins/cabins-table';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db/db.server';
import { getToast } from '~/lib/utils/toast.server';
import { useShowToast } from '~/hooks/use-show-toast';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | Hotel Booking System' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const { toast, headers } = await getToast(request);
	let cabins = await db.query.cabins.findMany({
		columns: {
			description: false,
			createdAt: false,
			updatedAt: false
		},
		orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
	});

	cabins = cabins.map((cabin) => ({
		...cabin,
		price: cabin.price / 100, // Convert price to dollars (from cents)
		discountPrice: cabin.discountPrice ? cabin.discountPrice / 100 : null // Convert price to dollars (from cents)
	}));

	return json({ toast, cabins }, { headers });
}

export default function DashboardCabinsPage() {
	const data = useLoaderData<typeof loader>();
	useShowToast(data.toast);

	return (
		<>
			<div className="flex items-center">
				<h1 className="mb-3 text-3xl font-bold">All Cabins</h1>
				<Button className="ml-auto" asChild>
					<Link to="/dashboard/cabins/add">
						<PlusIcon size={16} className="mr-2" />
						Add Cabin
					</Link>
				</Button>
			</div>

			<div className="py-4">
				<CabinsTable data={data.cabins} />
			</div>
		</>
	);
}
