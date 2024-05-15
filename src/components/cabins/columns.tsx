import { formatCurrency } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

import { Doc } from '~/_generated/dataModel'
import { TableActions } from './table-actions'

export const columns: ColumnDef<Doc<'cabins'>>[] = [
	{
		accessorKey: '_id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'maxCapacity',
		header: () => <div className="text-right">Max Capacity</div>,
		cell: ({ row }) => {
			const amount = parseInt(row.getValue('maxCapacity'))

			return <div className="text-right font-medium">{amount}</div>
		},
	},
	{
		accessorKey: 'price',
		header: () => <div className="text-right">Price (USD)</div>,
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
	},
]
