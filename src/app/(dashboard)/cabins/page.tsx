import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CabinsTable } from './cabins-table';

export default async function CabinsPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-wide">All Cabins</h1>
				<Button size="sm">
					<PlusIcon size={16} className="mr-2" />
					Add Cabin
				</Button>
			</div>

			<CabinsTable />
		</>
	);
}
