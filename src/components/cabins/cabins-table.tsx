import { useQuery } from '@tanstack/react-query';

import { getAllCabins } from '@/api/cabins';
import { DataTable, SkeletonTable } from '@/components/ui/data-table';
import { columns } from './cabins-table-columns';

export function CabinsTable() {
	const { data, isLoading } = useQuery({
		queryKey: ['cabins'],
		queryFn: getAllCabins
	});

	return (
		<div className="py-6">
			{isLoading && <SkeletonTable columns={5} rows={10} />}
			<DataTable columns={columns} data={data ?? []} caption="A list of all available Cabins" />
		</div>
	);
}
