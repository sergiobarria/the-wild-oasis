'use client';

import Image from 'next/image';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import type { Cabin } from '@/database/schemas';
import { formatCurrency } from '@/lib/utils';

import { CabinsTableActions } from './cabins-table-actions';

type TableCabin = Omit<Cabin, 'description' | 'updatedAt'>;

export const columns: ColumnDef<TableCabin>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			return (
				<div className="relative h-20 w-28 overflow-hidden rounded-lg bg-gray-400">
					{row.original.image ? (
						<Image src={row.original.image} alt="Placeholder" fill />
					) : (
						<Image src="/placeholder.jpg" alt="Placeholder" fill />
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
		header: ({ column }) => <DataTableColumnHeader column={column} title="Max Capacity" />,
		cell: ({ row }) => {
			return <div>Fits up to {row.original.maxCapacity} guest(s)</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'regularPrice',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Regular Price" className="justify-end" />
		),
		cell: ({ row }) => {
			return (
				<div className="pr-4 text-right">
					{formatCurrency(row.original.regularPrice / 100)}
				</div>
			);
		},
	},
	{
		accessorKey: 'discount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Discount (%)" className="justify-end" />
		),
		cell: ({ row }) => {
			return <div className="pr-4 text-right">{row.original.discount}</div>;
		},
	},
	{
		id: 'actions',
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			return (
				<div className="flex w-full justify-end">
					<CabinsTableActions cabin={row.original} />
				</div>
			);
		},
	},
];
