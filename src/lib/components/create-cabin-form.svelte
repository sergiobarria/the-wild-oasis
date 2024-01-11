<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { SaveIcon } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	import type { createCabinSchema } from '$lib/schemas/cabin';

	export let superForm: SuperForm<typeof createCabinSchema>;
	export let action: 'create' | 'update' = 'create';
	export let isModalOpen = false;
	const { form, constraints, errors, submitting, delayed } = superForm;

	const dispatch = createEventDispatcher();

	function handleCancel() {
		dispatch('close');
		goto('/cabins');
	}
</script>

<div class="modal" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">{action === 'create' ? 'Add New Cabin' : 'Edit Cabin'}</h3>

		<form method="POST">
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

			<!-- Form action buttons -->
			<hr class="my-4 border-neutral-200" />
			<div class="modal-action flex gap-2">
				<button type="button" class="btn btn-outline" on:click={handleCancel}>Cancel</button
				>
				<button
					type="submit"
					formaction={action === 'create' ? '?/create' : '?/update'}
					disabled={$submitting}
					class="btn btn-accent flex items-center"
				>
					{#if $delayed}
						<span class="loading loading-spinner"></span>
						<span>{action === 'create' ? 'Saving...' : 'Updating...'}</span>
					{:else}
						<SaveIcon class="h-5 w-5" />
						<span>{action === 'create' ? 'Save' : 'Update'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
