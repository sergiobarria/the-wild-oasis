import { useQuery } from 'convex/react'

import { DataTable, TableSkeleton } from '@/components/ui/data-table'
import { api } from '~/_generated/api'
import { columns } from './columns'

export function CabinsTable() {
	const cabins = useQuery(api.cabins.get)

	// NOTE: Convex queries are only undefined when the query is loading
	if (cabins === undefined) return <TableSkeleton />

	return (
		<DataTable
			columns={columns}
			data={cabins}
			options={{ filterInputPlaceholder: 'Search by cabin name...', filterColumn: 'name' }}
		/>
	)
}
