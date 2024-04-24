import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { DataTable } from '~/components/ui/data-table';
import { Button } from '~/components/ui/button';
import { Cabin } from '~/lib/schemas/cabins-schemas';
import { formatCurrency } from '~/lib/utils/helpers';
import { CabinsTableActionsMenu } from './cabins-table-actions';

type CabinColumns = Omit<Cabin, 'description' | 'createdAt' | 'updatedAt'>;

const columns: ColumnDef<CabinColumns>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			const image = (row.getValue('image') as string) ?? 'https://placehold.co/150x100';

			return (
				<div className="h-16 w-24  overflow-hidden rounded-lg">
					<img src={image} alt="Cabin" width={96} height={54} className="rounded-md object-cover" />
				</div>
			);
		}
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				Name
				<ArrowUpDownIcon size={16} className="ml-2" />
			</Button>
		)
	},
	{
		accessorKey: 'maxCapacity',
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				Max Capacity
				<ArrowUpDownIcon size={16} className="ml-2" />
			</Button>
		)
	},
	{
		accessorKey: 'price',
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				Price (USD)
				<ArrowUpDownIcon size={16} className="ml-2" />
			</Button>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('price'));

			return <div className="text-right font-medium">{formatCurrency(amount, 'USD')}</div>;
		}
	},
	{
		accessorKey: 'discountPrice',
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				Discount Price (USD)
				<ArrowUpDownIcon size={16} className="ml-2" />
			</Button>
		),
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
	data: CabinColumns[];
}

export function CabinsTable({ data }: CabinsTableProps) {
	return <DataTable columns={columns} data={data} caption="A list of all available Cabins" />;
}
