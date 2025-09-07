<script lang="ts">
	import { type ColumnDef } from '@tanstack/table-core';

	import placeholder from '$lib/assets/placeholder.jpg';
	import DataTable from '$lib/components/shared/data-table.svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import { getCabins } from '$lib/data-access/cabins.remote';
	import type { Cabin } from '$lib/types';
	import { formatCurrency } from '$lib/utils';
	import CabinsTableActions from './cabins-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowUpDownIcon } from '@lucide/svelte';

	let data = $derived(await getCabins());
	$inspect(data);

	type CabinWithImages = Cabin & { images: string[] };

	const columns: ColumnDef<Omit<CabinWithImages, 'createdAt' | 'updatedAt' | 'description'>>[] = [
		{
			id: 'image',
			header: 'Cabin Image',
			cell: ({ row }) => {
				const cover = row.original.images?.[0] || '';
				return renderSnippet(image, cover);
			}
		},
		{
			accessorKey: 'name',
			header: 'Cabin Name'
		},
		{
			accessorKey: 'maxCapacity',
			header: 'Max. Capacity',
			cell: ({ row }) => {
				return renderSnippet(maxCapacity, row.original.maxCapacity);
			}
		},
		{
			accessorKey: 'price',
			header: ({ column }) =>
				renderSnippet(priceHeader, {
					onclick: () => column.toggleSorting()
				}),
			cell: ({ row }) => {
				return renderSnippet(price, row.original.price / 100);
			}
		},
		{
			accessorKey: 'discountPercentage',
			header: 'Discount %',
			cell: ({ row }) => {
				return renderSnippet(discountPercent, row.original.discountPercentage);
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderComponent(CabinsTableActions, { id: row.original.id });
			}
		}
	];
</script>

{#snippet image(url: string)}
	<div class="relative h-16 w-24">
		<img
			src={url || placeholder}
			alt="placeholder"
			width={96}
			height={64}
			class="size-full rounded object-cover"
		/>
	</div>
{/snippet}

{#snippet priceHeader({ onclick }: { onclick: () => void })}
	<Button variant="ghost" {onclick}>
		Price
		<ArrowUpDownIcon />
	</Button>
{/snippet}

{#snippet price(value: number)}
	<div>{formatCurrency(value)}</div>
{/snippet}

{#snippet discountPercent(value: number | null)}
	<div>
		{#if value}
			{value.toFixed(2)}%
		{:else}
			-
		{/if}
	</div>
{/snippet}

{#snippet maxCapacity(value: number)}
	<div>Fits up to {value} guests</div>
{/snippet}

<DataTable
	{data}
	{columns}
	placeholder="Search cabins by name..."
	filterColumn="name"
	showPagination
/>
