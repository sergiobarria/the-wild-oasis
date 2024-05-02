import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { db } from '@/db';

export async function getCabinDetails(cabinId: string) {
	const result = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, cabinId)
	});

	return result;
}

type CabinDetailsPageProps = {
	params: {
		id: string;
	};
};

export default async function CabinDetailsPage({ params }: CabinDetailsPageProps) {
	console.log('🚀 ~ CabinDetailsPage ~ params:', params);
	const cabin = await getCabinDetails(params.id);

	if (!cabin) redirect('/cabins');

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-wide">Cabin Details</h1>
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
