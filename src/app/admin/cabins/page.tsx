import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function CabinsPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-wide">All Cabins</h1>
				<Button size="sm" asChild>
					<Link href="/admin/cabins/add">
						<PlusIcon size={16} className="mr-2" />
						Add Cabin
					</Link>
				</Button>
			</div>
		</>
	);
}
