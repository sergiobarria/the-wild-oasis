import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '~/components/ui/data-table';
import { Cabin } from '~/lib/schemas';
import { formatCurrency } from '~/lib/utils/helpers';
import { CabinsTableActionsMenu } from './cabins-table-actions';

const columns: ColumnDef<Cabin>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			const image = (row.getValue('image') as string) ?? 'https://placehold.co/150x100';

			return <img src={image} alt="Cabin" className="h-16 w-24 rounded-md object-cover" />;
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'maxCapacity',
		header: 'Max Capacity'
	},
	{
		accessorKey: 'price',
		header: () => <div className="text-right">Price (USD)</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('price'));

			return <div className="text-right font-medium">{formatCurrency(amount, 'USD')}</div>;
		}
	},
	{
		accessorKey: 'discountPrice',
		header: () => <div className="text-right">Discount Price (USD)</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('discountPrice'));

			return <div className="text-accent-foreground text-right font-medium">{formatCurrency(amount, 'USD')}</div>;
		}
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const cabinId = row.getValue('id') as number;

			return <CabinsTableActionsMenu cabinId={cabinId} />;
		}
	}
];

interface CabinsTableProps {
	data: Cabin[];
}

export function CabinsTable({ data }: CabinsTableProps) {
	return <DataTable columns={columns} data={data} />;
}
