import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PencilIcon } from 'lucide-react';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import { getCabinDetails } from '@/data/cabins';

type CabinDetailsPageProps = {
	params: {
		id: string;
	};
};

export default async function CabinDetailsPage({ params }: CabinDetailsPageProps) {
	const cabin = await getCabinDetails(params.id);
	const success = cookies().get('cabinCreated');
	const updated = cookies().get('cabinUpdated');

	if (!cabin) redirect('/cabins');

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-baseline gap-3">
					<h1 className="text-3xl font-semibold tracking-wide">Cabin Details</h1>
					{success && (
						<>
							<span> -</span>
							<p className="animate-bounce font-semibold text-green-400">New Cabin</p>
						</>
					)}

					{updated && (
						<>
							<span> -</span>
							<p className="animate-bounce font-semibold text-green-400">Cabin Updated</p>
						</>
					)}
				</div>

				<Button size="sm" asChild>
					<Link href={`${params.id}/edit`}>
						<PencilIcon size={16} className="mr-2" />
						Edit Cabin
					</Link>
				</Button>
			</div>

			<pre>{JSON.stringify({ id: cabin.id, name: cabin.name }, null, 2)}</pre>
		</>
	);
}
