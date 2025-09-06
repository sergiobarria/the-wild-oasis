<script lang="ts">
	import { PlusIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createCabin } from '$lib/data-access/cabins.remote';

	function formatFieldName(fieldName: string): string {
		return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
		<PlusIcon class="size-4" /> New Cabin
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Create New Cabin</Dialog.Title>
			<Dialog.Description>Add a new cabin to the database</Dialog.Description>
		</Dialog.Header>

		<form
			{...createCabin.enhance(async ({ submit, data, form }) => {
				try {
					await submit();
					form.reset();
					toast.success('Cabin created successfully');
				} catch (err: unknown) {
					console.error(err);
				}
			})}
		>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name*</Label>
					<Input id="name" name="name" placeholder="001" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="maxCapacity" class="text-right">Max Capacity*</Label>
					<Input
						id="maxCapacity"
						name="maxCapacity"
						type="number"
						placeholder="4"
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="price" class="text-right">Regular Price</Label>
					<Input
						id="price"
						name="price"
						type="text"
						placeholder="199.99"
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="discount" class="text-right">Discount (%)</Label>
					<Input
						id="discount"
						name="discount"
						type="number"
						placeholder="0"
						class="col-span-3"
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="description" class="text-right">Description</Label>
					<Textarea
						id="description"
						name="description"
						placeholder="Description"
						class="col-span-3"
					/>
				</div>
			</div>

			{#if createCabin.result?.errors?.nested && Object.keys(createCabin.result?.errors?.nested).length > 0}
				{@const errors = createCabin.result?.errors?.nested}

				<div class="mt-3 mb-4 rounded-md border border-destructive bg-destructive/5 p-3">
					<ul class="text-destructive-foreground space-y-1 text-sm">
						{#each Object.entries(errors) as [fieldName, fieldErrors]}
							{#each fieldErrors as error}
								<li>{error}</li>
							{/each}
						{/each}
					</ul>
				</div>
			{/if}

			<Dialog.Footer>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
