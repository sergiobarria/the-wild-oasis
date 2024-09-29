import { DataTable } from '@/components/data-table';
import { getCabins } from '@/database/data-access/cabins';

import { columns } from './cabins-columns';

export async function CabinsTable() {
	const cabins = await getCabins();

	return (
		<div className="mt-8">
			<DataTable columns={columns} data={cabins} />
		</div>
	);
}
