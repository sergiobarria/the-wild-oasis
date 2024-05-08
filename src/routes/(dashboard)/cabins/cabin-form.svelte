<script lang="ts">
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { CloudUploadIcon, Loader2Icon } from 'lucide-svelte';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { CabinSchema, type CabinInput } from '$lib/validators/cabin';
	import { cn } from '$lib/utils';

	export let data: SuperValidated<Infer<CabinInput>>;
	let imagePreview: string;

	const form = superForm(data, {
		validators: zodClient(CabinSchema)
	});

	const { form: formData, enhance, submitting, delayed } = form;

	function handleFileInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const file = target.files?.item(0) as File;

		const reader = new FileReader();
		reader.onloadend = () => {
			imagePreview = reader.result as string;
		};
		reader.readAsDataURL(file); // Read the file as a data URL

		$formData.cover = file;
	}
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<div class="grid grid-cols-12 gap-x-8 gap-y-3">
		<div class="col-span-7">
			<input type="hidden" name="id" bind:value={$formData.id} />

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>*Cabin Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} placeholder="001" />
				</Form.Control>
				<Form.Description>Enter the name of the cabin, e.g. 001</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="max_capacity">
				<Form.Control let:attrs>
					<Form.Label>*Max Capacity</Form.Label>
					<Input
						{...attrs}
						type="number"
						bind:value={$formData.max_capacity}
						placeholder="10"
					/>
				</Form.Control>
				<Form.Description>
					Enter the maximum number of people that can stay in the cabin.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-3 flex items-baseline gap-6">
				<Form.Field {form} name="price" class="w-full">
					<Form.Control let:attrs>
						<Form.Label>*Cabin Price</Form.Label>
						<Input
							{...attrs}
							type="number"
							bind:value={$formData.price}
							placeholder="199.99"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="discount_price" class="w-full">
					<Form.Control let:attrs>
						<Form.Label>Price Discount</Form.Label>
						<Input
							{...attrs}
							type="number"
							bind:value={$formData.discount_price}
							placeholder="99.99"
						/>
					</Form.Control>
				</Form.Field>
			</div>
		</div>
		<div class="col-span-5">
			{#if imagePreview}
				<div
					class="relative flex h-2/3 w-full items-center justify-center rounded-lg border border-dashed border-primary bg-gray-100"
				>
					<img
						src={imagePreview}
						alt="Cabin"
						class="h-full w-full rounded-lg object-cover"
					/>
				</div>
			{/if}

			<Form.Field {form} name="cover">
				<Form.Control let:attrs>
					<label
						for="cover"
						class={cn(
							'mx-auto flex h-52 max-w-md cursor-pointer flex-col items-center justify-center rounded',
							'border-2 border-dashed border-gray-300 bg-white font-[sans-serif] text-base font-semibold text-gray-500',
							'transition-colors duration-200 ease-in-out hover:border-primary hover:bg-gray-50 hover:text-primary',
							'duration-300',
							{ hidden: imagePreview }
						)}
					>
						<CloudUploadIcon class="mb-2 size-11 text-gray-500" />
						Upload file
						<input
							id="cover"
							name="cover"
							on:input={handleFileInput}
							type="file"
							class="hidden"
						/>
						<p class="mt-2 text-xs font-medium text-gray-400">
							PNG, JPG, JPEG, and WEBP are Allowed.
						</p>
						<small class="text-xs text-gray-400">Max file size: 5MB</small>
					</label>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="col-span-full">
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>*Cabin Description</Form.Label>
					<Textarea
						{...attrs}
						bind:value={$formData.description}
						placeholder="This cabin is perfect for a family of 4...."
						rows={8}
					/>
				</Form.Control>
				<Form.Description>
					Enter a description of the cabin, e.g. This cabin is perfect for a family of 4.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>

	<Form.Button disabled={$submitting || $delayed} class="mt-4">
		{#if $delayed || $submitting}
			<Loader2Icon class="mr-2 size-4 animate-spin" />
			Saving
		{:else}
			Save Cabin
		{/if}
	</Form.Button>
</form>

<div class="my-10">
	<SuperDebug data={$formData} />
</div>
