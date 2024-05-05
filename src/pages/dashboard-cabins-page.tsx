import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getAllCabins } from '@/api/cabins';

export function DashboardCabinPage() {
	const query = useQuery({
		queryKey: ['cabins'],
		queryFn: getAllCabins
	});
	console.log('🚀 ~ DashboardCabinPage ~ query:', query);

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
