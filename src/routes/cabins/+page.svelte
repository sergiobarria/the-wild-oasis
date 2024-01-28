<script lang="ts">
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-svelte'
	import toast from 'svelte-french-toast'
	import { getFlash } from 'sveltekit-flash-message'

	import * as Table from '$lib/components/ui/table'
	import Button from '$lib/components/ui/button/button.svelte'
	import { formatCurrency } from '$lib/utils'

	export let data: PageData

	const flash = getFlash(page)

	$: if ($flash) {
		switch ($flash?.type) {
			case 'success':
				toast.success($flash?.message, { duration: 2000 })
				break
			case 'error':
				toast.error($flash?.message, { duration: 2000 })
				break
		}
	}
</script>

<svelte:head>
	<title>Cabins | The Wild Oasis</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold">All Cabins</h1>
	<Button on:click={() => goto('/cabins/new')}>
		<PlusIcon class="h-4 w-4" />
		<span class="ml-2">New Cabin</span>
	</Button>
</div>

<Table.Root>
	<Table.Caption>A list of all available cabins.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[150px]">Image</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Max. Capacity</Table.Head>
			<Table.Head>Price</Table.Head>
			<Table.Head>Discount</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#if data.cabins.length === 0}
			<Table.Row>
				<p>No cabins found.</p>
			</Table.Row>
		{/if}
		{#each data.cabins as cabin}
			<Table.Row>
				<Table.Cell align="center">
					<img
						src={cabin.image ?? 'https://placehold.co/100x75'}
						alt={cabin.name}
						width="100"
						height="100"
						class="rounded"
					/>
				</Table.Cell>
				<Table.Cell>{cabin.name}</Table.Cell>
				<Table.Cell>Fits up to {cabin.capacity} guests</Table.Cell>
				<Table.Cell>{formatCurrency(Number(cabin.price))}</Table.Cell>
				<Table.Cell>{formatCurrency(Number(cabin.discount))}</Table.Cell>
				<Table.Cell>
					<div class="flex gap-1">
						<Button
							variant="outline"
							size="icon"
							on:click={() => goto(`/cabins/${cabin.id}/edit`)}
						>
							<PencilIcon class="h-4 w-4" />
						</Button>
						<form method="POST">
							<input type="hidden" name="id" value={cabin.id} />
							<Button
								type="submit"
								variant="outline"
								size="icon"
								class="border-red-500 text-red-500"
							>
								<TrashIcon class="h-4 w-4" />
							</Button>
						</form>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
