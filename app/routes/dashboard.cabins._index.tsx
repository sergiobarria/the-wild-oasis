import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';

import { CabinsTable } from '~/components/cabins/cabins-table';
import { Button } from '~/components/ui/button';
import { db } from '~/lib/db/db.server';
import { getToast, redirectWithToast } from '~/lib/utils/toast.server';
import { useShowToast } from '~/hooks/use-show-toast';
import { cabins } from '~/lib/db/schema';
import { config } from '~/lib/utils/config.server';

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

	cabins = cabins.map((cabin) => {
		const imageUrl = cabin.image ? `${config.R2_BUCKET_BASE_URL}/${cabin.image}` : 'https://placehold.co/150x100';

		return {
			...cabin,
			price: cabin.price / 100, // Convert price to dollars (from cents)
			discountPrice: cabin.discountPrice ? cabin.discountPrice / 100 : null, // Convert price to dollars (from cents)
			image: imageUrl
		};
	});

	return json({ toast, cabins }, { headers });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const cabinID = formData.get('cabinID') as string;

	try {
		if (!cabinID) throw new Error('Cabin ID is required');

		await db.delete(cabins).where(eq(cabins.id, cabinID));
		const toast = { title: 'Success!', description: 'Cabin successfully deleted' };

		return redirectWithToast('/dashboard/cabins', toast);
	} catch (err: unknown) {
		console.error('=> 💥 Something went wrong!', err);
		const toast = { title: 'Something Went Wrong!', description: 'There was an error deleting the Cabin' };

		return redirectWithToast('/dashboard/cabins', toast);
	}
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
