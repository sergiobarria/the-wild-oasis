<script lang="ts">
	import { Loader2Icon, PlusIcon, XIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createCabin } from '$lib/data-access/cabins.remote';

	let open = $state<boolean>(false);
	let submitting = $state<boolean>(false);

	let selectedFiles = $state<File[]>([]);
	let filePreviews = $state<Array<{ file: File; preview: string }>>([]);

	function getOpen() {
		return open;
	}

	function setOpen(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) resetImageState();
	}

	function resetImageState() {
		selectedFiles = [];
		filePreviews.forEach(({ preview }) => URL.revokeObjectURL(preview));
		filePreviews = [];
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files || []);

		const imageFiles = files.filter((file) => file.type.startsWith('image/'));

		if (imageFiles.length !== files.length) {
			toast.warning('Only image files are allowed');
		}

		selectedFiles = imageFiles;
		filePreviews = imageFiles.map((file) => ({
			file,
			preview: URL.createObjectURL(file)
		}));
	}

	function removeImage(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);

		if (filePreviews[index]) {
			URL.revokeObjectURL(filePreviews[index].preview);
			filePreviews = filePreviews.filter((_, i) => i !== index);
		}

		const input = document.getElementById('images') as HTMLInputElement;
		if (input) {
			const dt = new DataTransfer();
			selectedFiles.forEach((file) => dt.items.add(file));
			input.files = dt.files;
		}
	}

	function isSuccess(result: any): result is { success: true; cabinId: string } {
		return result?.success === true;
	}

	function hasErrors(result: any): result is { success: false; errors: any } {
		return result?.success === false && result?.errors;
	}

	$effect(() => {
		if (createCabin.result && isSuccess(createCabin.result)) {
			open = false;
		}
	});
</script>

<Dialog.Root bind:open={getOpen, setOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
		<PlusIcon class="size-4" /> New Cabin
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create New Cabin</Dialog.Title>
			<Dialog.Description>Add a new cabin to the database</Dialog.Description>
		</Dialog.Header>

		<form
			{...createCabin.enhance(async ({ submit, data, form }) => {
				submitting = true;
				try {
					await submit();

					// ✨ Verificar resultado usando type guard
					if (createCabin.result && isSuccess(createCabin.result)) {
						form.reset();
						resetImageState();
						toast.success('Cabin created successfully');
					} else if (createCabin.result && hasErrors(createCabin.result)) {
						toast.error('Failed to create cabin');
					}
				} catch (err: unknown) {
					console.error(err);
					toast.error('An unexpected error occurred');
				} finally {
					submitting = false;
				}
			})}
			enctype="multipart/form-data"
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
					<Label for="price" class="text-right">Regular Price*</Label>
					<Input
						id="price"
						name="price"
						type="text"
						placeholder="199.99"
						class="col-span-3"
					/>
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="discountPercentage" class="text-right">Discount (%)</Label>
					<Input
						id="discountPercentage"
						name="discountPercentage"
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

				<div class="grid grid-cols-4 items-start gap-4">
					<Label for="images" class="pt-2 text-right">Images</Label>
					<div class="col-span-3 space-y-3">
						<Input
							id="images"
							name="images"
							accept="image/*"
							type="file"
							multiple
							onchange={handleFileSelect}
						/>

						{#if filePreviews.length > 0}
							<div class="grid grid-cols-3 gap-2">
								{#each filePreviews as { preview, file }, i}
									<div class="group relative">
										<img
											src={preview}
											alt={file.name}
											class="h-20 w-full rounded-md object-cover"
										/>
										<button
											type="button"
											class="text-destructive-foreground absolute -top-1 -right-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
											onclick={() => removeImage(i)}
										>
											<XIcon class="size-3" />
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- ✨ Mostrar errores con type guard -->
			{#if createCabin.result && hasErrors(createCabin.result)}
				{@const result = createCabin.result}
				<div class="mt-3 mb-4 rounded-md border border-destructive bg-destructive/5 p-3">
					<ul class="text-destructive-foreground space-y-1 text-sm">
						<!-- Errores generales -->
						{#if result.errors.root}
							{#each result.errors.root as error}
								<li>{error}</li>
							{/each}
						{/if}

						<!-- Errores específicos de campos -->
						{#if result.errors.nested}
							{#each Object.entries(result.errors.nested) as [fieldName, fieldErrors]}
								{#if fieldErrors && Array.isArray(fieldErrors)}
									{#each fieldErrors as error}
										<li>{error}</li>
									{/each}
								{/if}
							{/each}
						{/if}
					</ul>
				</div>
			{/if}

			<Dialog.Footer>
				<Button type="submit" disabled={submitting}>
					{#if submitting}
						<Loader2Icon size={16} />
					{/if}
					{submitting ? 'Saving...' : 'Create'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
