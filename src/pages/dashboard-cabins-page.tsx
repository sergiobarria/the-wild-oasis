import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function DashboardCabinPage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-wide">All Cabins</h1>
				<Button size="sm" asChild>
					<Link to="/admin/cabins/add">
						<PlusIcon size={16} className="mr-2" />
						Add Cabin
					</Link>
				</Button>
			</div>
		</>
	);
}
