import { DataTable } from '@/components/ui/data-table';
import { getAllCabins } from '@/data/cabins';
import { columns } from './table-columns';

export async function CabinsTable() {
	const cabins = await getAllCabins();

	return (
		<div className="py-6">
			<DataTable columns={columns} data={cabins} caption="A list of all available Cabins" />
		</div>
	);
}
