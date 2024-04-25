import { LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ChevronLeftIcon, PencilIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useShowToast } from '~/hooks/use-show-toast';
import { db } from '~/lib/db/db.server';
import { getToast } from '~/lib/utils/toast.server';

export const meta: MetaFunction = () => {
	return [{ title: 'View Cabin Details | Hotel Booking System' }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
	const cabinId = params.id;
	const { toast, headers } = await getToast(request);

	if (!cabinId) return redirect('/dashboard/cabins');

	const cabin = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, cabinId)
	});

	if (!cabin) return redirect('/dashboard/cabins');

	cabin.price = cabin.price / 100;
	cabin.discountPrice = cabin.discountPrice ? cabin.discountPrice / 100 : null;

	return json({ cabin, toast }, { headers });
}

export default function CabinDetailsPage() {
	const { cabin, toast } = useLoaderData<typeof loader>();
	useShowToast(toast);

	return (
		<>
			<div className="flex items-center">
				<div>
					<Button variant="outline" size="icon" className="mb-3" asChild>
						<Link to="/dashboard/cabins">
							<ChevronLeftIcon size={20} />
						</Link>
					</Button>
					<h1 className="mb-3 text-3xl font-bold">View Cabin: {cabin.name}</h1>
				</div>
				<Button className="ml-auto" asChild>
					<Link to={`/dashboard/cabins/${cabin.id}/edit`}>
						<PencilIcon size={16} />
						<span className="ml-2">Edit Cabin</span>
					</Link>
				</Button>
			</div>

			{/* Display the cabin details */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<img
						src={cabin.image ?? 'https://placehold.co/100'}
						alt={cabin.name}
						className="h-96 w-full rounded-lg object-cover"
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold">{cabin.name}</h2>
					<p className="text-lg text-gray-600">Max Capacity: {cabin.maxCapacity}</p>
					<p className="text-lg text-gray-600">Price: ${cabin.price}</p>
					{cabin.discountPrice && (
						<p className="text-lg text-gray-600">Discount Price: ${cabin.discountPrice}</p>
					)}
					<p className="text-lg text-gray-600">Description: {cabin.description}</p>
				</div>
			</div>
		</>
	);
}
