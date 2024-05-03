import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CabinForm } from '../cabin-form';

export default function AddCabinPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Button variant="outline" size="icon" asChild>
						<Link href="/admin/cabins">
							<ChevronLeftIcon className="size-4" />
						</Link>
					</Button>
					<h1 className="text-3xl font-semibold tracking-wide">All Cabins</h1>
				</div>
			</div>

			<div className="flex gap-8 py-10">
				<CabinForm />
				<div>image</div>
			</div>
		</>
	);
}
