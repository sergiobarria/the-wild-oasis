import { ColumnDef } from '@tanstack/react-table';

import { AppTable } from '~/components/site/app-table';
import { formatCurrency } from '~/lib/utils';
import { Cabin } from '~/lib/validation/cabin';
import { CabinsTableActions } from './table-actions';

type CabinTableColumns = Omit<Cabin, 'description' | 'createdAt' | 'updatedAt'>;

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
		accessorKey: 'maxCapacity',
		header: 'Max Capacity',
		cell: ({ row }) => <div className="font-medium">Fits up to {row.getValue('maxCapacity')} guest(s)</div>,
	},
	{
		accessorKey: 'regularPrice',
		header: () => <div className="text-right">Regular Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('regularPrice'));

			return <div className="text-right font-medium">{formatCurrency(price)}</div>;
		},
	},
	{
		accessorKey: 'discountPrice',
		header: () => <div className="text-right">Discount Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue('discountPrice'));

			return (
				<div className="text-right font-medium">
					{price ? <span className="text-green-500">formatCurrency(price)</span> : 'N/A'}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const cabin = row.original;

			return <CabinsTableActions cabin={cabin} />;
		},
	},
];

interface CabinTableProps {
	data: CabinTableColumns[];
}

export function CabinsTable({ data }: CabinTableProps) {
	return <AppTable columns={columns} data={data} />;
}
