<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { goto, afterNavigate } from '$app/navigation'
	import { PencilIcon, TrashIcon, PlusIcon, Plus } from 'lucide-svelte'
	import toast from 'svelte-french-toast'

	import * as Table from '$lib/components/ui/table'
	import Button from '$lib/components/ui/button/button.svelte'
	import { formatCurrency } from '$lib/utils'

	export let data: PageData
	export let form: ActionData

	afterNavigate(() => {
		if (form?.success) toast.success(form?.message, { duration: 2000 })
		if (!form?.success && form?.message) toast.error(form?.message, { duration: 2000 })
	})
</script>

<svelte:head>
	<title>Cabins | The Wild Oasis</title>
</svelte:head>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-2xl font-semibold">All Cabins</h1>
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
						src={cabin.image}
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
