import { ColumnDef } from '@tanstack/react-table';

import { AppTable } from '~/components/site/app-table';
import { formatCurrency } from '~/lib/utils';
import { CabinsTableActions } from './table-actions';
import { Cabins } from '~/lib/xata';

type CabinTableColumns = Omit<Cabins, 'description' | 'xata'>;

const columns: ColumnDef<CabinTableColumns>[] = [
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			const image = row.getValue('image') as string;

			return (
				<div className="h-16 w-20 overflow-hidden rounded-md bg-gray-200">
					{image ? (
						<img src={image} alt={row.getValue('name')} className="h-full w-full object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center text-gray-400">N/A</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'max_capacity',
		header: 'Max Capacity',
		cell: ({ row }) => <div className="font-medium">Fits up to {row.getValue('max_capacity')} guest(s)</div>,
	},
	{
		accessorKey: 'price',
		header: () => <div className="text-right">Regular Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('price'));

			return <div className="text-right font-medium">{formatCurrency(price)}</div>;
		},
	},
	{
		accessorKey: 'discount_price',
		header: () => <div className="text-right">Discount Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('discount_price'));

			return (
				<div className="text-right font-medium">
					{price ? <span className="text-green-500">{formatCurrency(price)}</span> : 'N/A'}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const cabin = row.original;

			return <CabinsTableActions cabinId={cabin.id} />;
		},
	},
];

interface CabinTableProps {
	data: CabinTableColumns[];
}

export function CabinsTable({ data }: CabinTableProps) {
	return <AppTable columns={columns} data={data} />;
}
