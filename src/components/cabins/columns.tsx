import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { TableActions } from './table-actions'
import { Doc } from '~/_generated/dataModel'

type Column = ColumnDef<Doc<'cabins'> & { imageUrl: string }>

export const columns: Column[] = [
	{
		accessorKey: '_id',
		header: 'ID',
	},
	{
		accessorKey: 'image',
		header: 'Cover',
		cell: ({ row }) => {
			const imageUrl = row.original.imageUrl

			return (
				<div className="h-14 w-20 overflow-hidden rounded-lg">
					<img
						src={imageUrl ?? 'https://placehold.co/100'}
						alt="Cabin"
						className="h-full w-full object-cover"
					/>
				</div>
			)
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDownIcon className="ml-2" size={16} />
				</Button>
			)
		},
	},
	{
		accessorKey: 'maxCapacity',
		header: ({ column }) => {
			return (
				<div className="flex justify-end">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Max Capacity
						<ArrowUpDownIcon className="ml-2" size={16} />
					</Button>
				</div>
			)
		},
		cell: ({ row }) => {
			const amount = parseInt(row.getValue('maxCapacity'))

			return <div className="text-right font-medium">{amount}</div>
		},
	},
	{
		accessorKey: 'price',
		header: ({ column }) => {
			return (
				<div className="flex justify-end">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Price (USD)
						<ArrowUpDownIcon className="ml-2" size={16} />
					</Button>
				</div>
			)
		},
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('price'))

			return <div className="text-right font-medium">{formatCurrency(amount / 100)}</div>
		},
	},
	{
		accessorKey: 'discount',
		header: () => <div className="text-right">Price Discount (USD)</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('discount'))

			return <div className="text-right font-medium">{formatCurrency(amount / 100)}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const cabinId = row.original._id

			return <TableActions cabinId={cabinId} />
		},
		enableHiding: false,
	},
]
