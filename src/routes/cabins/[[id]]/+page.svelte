<script lang="ts">
	import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';

	import type { PageData } from './$types';

	export let data: PageData;
	const { form, enhance, delayed, submitting, errors, constraints } = superForm(data.form, {
		resetForm: true,
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.type === 'success') toast.success(form.message.text);
				else toast.error(form.message.text);
			}
		}
	});
	console.log({ form: data.form, cabin: data.cabins });
</script>

<svelte:head>
	<title>Cabins | The Wild Oasis</title>
	<meta name="description" content="Cabins" />
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-3xl font-semibold">All Cabins</h2>
	<div class="flex items-center gap-3">
		<span>Filter/Sort</span>
		<button class="btn btn-primary rounded-full" on:click={() => {}}>
			<PlusIcon class="h-5 w-5 rounded-full bg-white" />
			New Cabin
		</button>
	</div>
</div>

<div class="flex flex-col">
	{#each data.cabins as cabin}
		<a href="/cabins/{cabin.id}">{cabin.name}</a>
	{/each}
</div>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<input type="hidden" name="id" bind:value={$form.id} />

	<label class="w-full max-w-md">
		<span class="label label-text font-semibold">Cabin name</span>
		<input
			type="text"
			name="name"
			class="input input-bordered w-full"
			placeholder="001"
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<small class="text-red-500">{$errors.name}</small>{/if}
	</label>

	<label class="w-full max-w-md">
		<span class="label label-text font-semibold">Maximun Capacity</span>
		<input
			type="text"
			name="maxCapacity"
			class="input input-bordered w-full"
			placeholder="2"
			bind:value={$form.maxCapacity}
			{...$constraints.maxCapacity}
		/>
		{#if $errors.maxCapacity}<small class="text-red-500">{$errors.maxCapacity}</small>{/if}
	</label>

	<label class="w-full max-w-md">
		<span class="label label-text font-semibold">Cabin price</span>
		<input
			type="text"
			name="price"
			class="input input-bordered w-full"
			placeholder="100"
			bind:value={$form.price}
			{...$constraints.price}
		/>
		{#if $errors.price}<small class="text-red-500">{$errors.price}</small>{/if}
	</label>

	<label class="w-full max-w-md">
		<span class="label label-text font-semibold">Price Discount</span>
		<input
			type="text"
			name="discount"
			class="input input-bordered w-full"
			placeholder="10"
			bind:value={$form.discount}
			{...$constraints.discount}
		/>
		{#if $errors.discount}<small class="text-red-500">{$errors.discount}</small>{/if}
	</label>

	<label class="w-full max-w-md">
		<span class="label label-text font-semibold">Cabin Description</span>
		<textarea
			name="description"
			class="textarea textarea-bordered w-full"
			placeholder="Cabin description..."
			rows={3}
			bind:value={$form.description}
			{...$constraints.description}
		/>
	</label>

	<label>
		<span class="label label-text font-semibold">Price Discount</span>
		<div class="flex items-center gap-6">
			<input type="file" name="image" class="file-input file-input-bordered" />
			{#if $form.image}
				<img src={$form.image} alt={$form.name} width="100" height="100" class="mt-3 rounded" />
			{/if}
		</div>
	</label>

	<button type="submit" disabled={$submitting} class="btn btn-primary mt-6 flex items-center">
		{#if $delayed}
			<span class="loading loading-spinner"></span>
			Saving...
		{:else}
			<SaveIcon class="h-5 w-5" />
			Save
		{/if}
	</button>

	{#if $form.id}
		<button name="delete" class="btn btn-outline btn-error mt-6 flex items-center">
			<TrashIcon class="h-5 w-5" />
			Delete
		</button>
	{/if}
</form>
