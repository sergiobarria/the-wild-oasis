import { DataTable } from '@/components/ui/data-table';
import { columns } from './table-columns';
import { getXataClient } from '@/lib/xata';

const xata = getXataClient();

export async function CabinsTable() {
	const cabins = await xata.db.cabins.select(['id', 'name', 'max_capacity', 'price', 'discount_price']).getAll();
	console.log('🚀 ~ CabinsTable ~ cabins:', cabins);

	return (
		<div className="py-6">
			<DataTable columns={columns} data={cabins as any} caption="A list of all available Cabins" />
		</div>
	);
}
