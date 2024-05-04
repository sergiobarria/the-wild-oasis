import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getCabinDetails } from '@/data/cabins';
import { CabinForm } from '../../cabin-form';

export default async function EditCabinPage({ params }: { params: { id: string } }) {
	const cabin = await getCabinDetails(params.id);

	return (
		<>
			<div className="space-y-2">
				<Button variant="outline" size="icon" asChild>
					<Link href="/admin/cabins">
						<ChevronLeftIcon className="size-4" />
					</Link>
				</Button>
				<h1 className="text-3xl font-semibold tracking-wide">All Cabins: {params.id}</h1>
			</div>

			<div className="mb-8 mt-6">
				<CabinForm cabin={cabin} />
			</div>
		</>
	);
}
