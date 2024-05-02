'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import type { Cabin } from '@/schemas/cabin';
import { formatCurrency } from '@/lib/utils';
import { CabinsTableMenu } from './cabins-table-menu';
import { Button } from '@/components/ui/button';

type CabinTableColumns = Omit<Cabin, 'slug' | 'createdAt' | 'updatedAt' | 'description'>;

export const columns: ColumnDef<CabinTableColumns>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Name
					<ArrowUpDownIcon className="ml-2 size-4" />
				</Button>
			);
		}
	},
	{
		accessorKey: 'maxCapacity',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Max Capacity
					<ArrowUpDownIcon className="ml-2 size-4" />
				</Button>
			);
		}
	},
	{
		accessorKey: 'price',
		header: ({ column }) => {
			return (
				<div className="text-right">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Price (USD)
						<ArrowUpDownIcon className="ml-2 size-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const price = row.getValue('price') as number;
			const formattedPrice = formatCurrency(price / 100); // Convert cents to dollars

			return <div className="text-right font-medium">{formattedPrice}</div>;
		}
	},
	{
		accessorKey: 'discountPrice',
		header: ({ column }) => {
			return (
				<div className="text-right">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Price Discount (USD)
						<ArrowUpDownIcon className="ml-2 size-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const discountPrice = row.getValue('discountPrice') as number;
			const formattedDiscountPrice = formatCurrency(discountPrice / 100); // Convert cents to dollars

			return <div className="text-right font-medium">{formattedDiscountPrice}</div>;
		}
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const cabin = row.original;

			return <CabinsTableMenu cabinId={cabin.id} />;
		}
	}
];
