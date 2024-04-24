import { LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ChevronLeftIcon, PencilIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { db } from '~/lib/db/db.server';

export const meta: MetaFunction = () => {
	return [{ title: 'View Cabin Details | Hotel Booking System' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
	const cabinId = params.id;
	console.log('🚀 ~ loader ~ cabinId:', cabinId);

	if (!cabinId) return redirect('/dashboard/cabins');

	const cabin = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, Number(cabinId))
	});
	console.log('🚀 ~ loader ~ cabin:', cabin);

	if (!cabin) return redirect('/dashboard/cabins');

	cabin.price = cabin.price / 100;
	cabin.discountPrice = cabin.discountPrice ? cabin.discountPrice / 100 : null;

	return json({ cabin });
}

export default function CabinDetailsPage() {
	const { cabin } = useLoaderData<typeof loader>();
	console.log('🚀 ~ CabinDetailsPage ~ cabin:', cabin);

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
		</>
	);
}
