<script lang="ts">
	import type { PageData } from './$types';
	import { SaveIcon, Trash2Icon, PlusIcon, PencilIcon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';

	import { formatCurrency } from '$lib/helpers';

	export let data: PageData;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let deleteId = '';
	const { form, errors, constraints, enhance, delayed, submitting } = superForm(data.form, {
		resetForm: true,
		delayMs: 500,
		timeoutMs: 8000,
		onResult: ({ result }) => {
			if (result.type === 'success') isModalOpen = false;
			toast.success('Cabin saved successfully');
		}
	});

	const {
		submitting: deleting,
		delayed: deleteDelayed,
		enhance: deleteEnhance
	} = superForm(data.deleteCabinForm, {
		onResult: ({ result }) => {
			if (result.type === 'success') isDeleteModalOpen = false;
			toast.success('Cabin deleted successfully');
		}
	});
	$: ({ cabins } = data);
</script>

<svelte:head>
	<title>Cabins | The Wild Oasis</title>
	<meta name="description" content="Cabins" />
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-3xl font-semibold">All Cabins</h2>
	<div class="flex items-center gap-3">
		<span>Filter/Sort</span>
		<button class="btn btn-primary" on:click={() => (isModalOpen = true)}>
			<PlusIcon class="h-5 w-5" />
			Add New Cabin
		</button>
	</div>
</div>

<div class="overflow-x-auto rounded-lg bg-white p-4">
	<table class="table">
		<thead>
			<tr>
				<th>Image</th>
				<th>Cabin</th>
				<th>Capacity</th>
				<th>Price</th>
				<th>Discount</th>
				<th>Actions</th>
			</tr>
		</thead>

		<tbody>
			{#if cabins.length === 0}
				<tr>
					<td colspan="6" class="text-center opacity-50">No cabins found</td>
				</tr>
			{/if}
			{#each cabins as cabin (cabin.id)}
				<tr class="hover:bg-base-100">
					<td>
						<img
							src={cabin.image || 'https://placehold.co/75'}
							alt={cabin.name}
							class="rounded"
							width={75}
							height={75}
						/>
					</td>
					<td>{cabin.name}</td>
					<td>{cabin.maxCapacity}</td>
					<td>{formatCurrency(cabin.price)}</td>
					<td>{formatCurrency(cabin.discount)}</td>
					<td>
						<button
							class="btn btn-primary btn-sm"
							on:click={() => (isModalOpen = true)}
						>
							<PencilIcon class="h-4 w-4" />
						</button>
						<button
							class="btn btn-error btn-sm"
							on:click={() => {
								isDeleteModalOpen = true;
								deleteId = cabin.id;
							}}
						>
							<Trash2Icon class="h-4 w-4" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div id="delete" class="modal" class:modal-open={isDeleteModalOpen}>
	<div class="modal-box">
		<form method="POST" action="?/delete" use:deleteEnhance>
			<p>Are you sure you want to delete this cabin? This action is irreversible.</p>
			<input type="hidden" name="id" value={deleteId} />

			<div class="modal-action flex gap-2">
				<button class="btn btn-outline" on:click={() => (isDeleteModalOpen = false)}>
					Cancel
				</button>
				<button type="submit" disabled={$deleting} class="btn btn-accent flex items-center">
					{#if $deleteDelayed}
						<span class="loading loading-spinner"></span>
						Deleting...
					{:else}
						Delete
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

<div id="create" class="modal" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Add New Cabin</h3>
		<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance>
			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Cabin name</span>
				</div>
				<input
					type="text"
					name="name"
					class="input input-bordered w-full"
					bind:value={$form.name}
					placeholder="001"
					{...$constraints.name}
				/>
				{#if $errors.name}<small class="text-xs text-error">{$errors.name}</small>{/if}
			</label>

			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Maximun Capacity</span>
				</div>
				<input
					type="text"
					name="maxCapacity"
					inputmode="numeric"
					class="input input-bordered w-full"
					bind:value={$form.maxCapacity}
					placeholder="2"
					{...$constraints.maxCapacity}
				/>
				{#if $errors.maxCapacity}
					<small class="text-xs text-error">{$errors.maxCapacity}</small>
				{/if}
			</label>

			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Price</span>
				</div>
				<input
					type="text"
					name="price"
					inputmode="numeric"
					class="input input-bordered w-full"
					bind:value={$form.price}
					placeholder="2"
					{...$constraints.price}
				/>
				{#if $errors.price}
					<small class="text-xs text-error">{$errors.price}</small>
				{/if}
			</label>

			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Price Discount</span>
				</div>
				<input
					type="text"
					name="discount"
					inputmode="numeric"
					class="input input-bordered w-full"
					bind:value={$form.discount}
					placeholder="2"
					{...$constraints.discount}
				/>
				{#if $errors.discount}
					<small class="text-xs text-error">{$errors.discount}</small>
				{/if}
			</label>

			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Description</span>
				</div>
				<textarea
					name="description"
					class="textarea textarea-bordered w-full"
					bind:value={$form.description}
					placeholder="Cabin description..."
					rows={3}
					{...$constraints.description}
				/>
				{#if $errors.description}
					<small class="text-xs text-error">{$errors.description}</small>
				{/if}
			</label>

			<label class="w-full max-w-md">
				<div class="label">
					<span class="label-text">Cabin Image</span>
				</div>
				<input
					type="file"
					class="file-input file-input-bordered file-input-accent w-full"
					name="file"
				/>
			</label>

			<div class="modal-action flex gap-2">
				<button class="btn btn-outline" on:click={() => (isModalOpen = false)}>
					Cancel
				</button>
				<button
					type="submit"
					disabled={$submitting}
					class="btn btn-accent flex items-center"
				>
					{#if $delayed}
						<span class="loading loading-spinner"></span>
						Saving...
					{:else}
						<SaveIcon class="h-5 w-5" />
						Save
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
