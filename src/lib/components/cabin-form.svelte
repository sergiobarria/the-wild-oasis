<script lang="ts">
	import type { FormOptions } from 'formsnap'
	import type { SuperValidated } from 'sveltekit-superforms'
	import { CheckIcon } from 'lucide-svelte'

	import * as Form from '$lib/components/ui/form'
	import {
		editCabinSchema,
		type EditCabinSchema,
		type NewCabinSchema
	} from '$lib/schemas/cabin-schemas'
	import type { Cabin } from '$lib/database/schemas'
	import { cn } from '$lib/utils'
	import { onMount } from 'svelte'

	const MAX_CHARS = 1000
	export let form: SuperValidated<EditCabinSchema | NewCabinSchema>
	export let options: FormOptions<EditCabinSchema | NewCabinSchema>
	export let cabin: Cabin | null = null
	export let submitting = false
	let charsLeft = MAX_CHARS

	$: descriptionLength = MAX_CHARS - charsLeft

	function getCharsLeft(e: InputEvent) {
		const target = e.target as HTMLTextAreaElement
		charsLeft = MAX_CHARS - target.value.length
	}

	onMount(() => {
		if (cabin) {
			charsLeft = cabin.description ? MAX_CHARS - cabin.description.length : MAX_CHARS
		}
	})
</script>

<Form.Root
	method="POST"
	{options}
	{form}
	schema={editCabinSchema}
	let:config
	class="max-w-lg space-y-6"
>
	<input type="hidden" name="id" value={cabin?.id} />
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Cabin Name</Form.Label>
			<Form.Input placeholder="001" value={cabin?.name} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="maxCapacity">
		<Form.Item>
			<Form.Label>Maximum Capacity</Form.Label>
			<Form.Input type="number" placeholder="2" value={cabin?.maxCapacity} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="price">
		<Form.Item>
			<Form.Label>Price</Form.Label>
			<Form.Input type="number" placeholder="100.00" value={cabin?.price} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="priceDiscount">
		<Form.Item>
			<Form.Label>Price Discount</Form.Label>
			<Form.Input type="number" placeholder="0.00" value={cabin?.priceDiscount} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description*</Form.Label>
			<Form.Textarea rows={5} on:input={getCharsLeft} value={cabin?.description} />
			<Form.Validation />
			<div class="flex justify-between">
				<small
					class={cn(
						'text-xs',
						descriptionLength >= 10 ? 'text-green-500' : 'text-gray-500'
					)}
				>
					{#if descriptionLength >= 10}
						<CheckIcon class="mr-1 inline-block h-4 w-4" />
					{/if}
					Minimum of 10 characters
				</small>
				<small class="text-xs text-gray-500">
					{charsLeft} characters left
				</small>
			</div>
		</Form.Item>
	</Form.Field>

	<Form.Button disabled={submitting}>
		{#if submitting}
			Submitting...
		{:else}
			Save
		{/if}
	</Form.Button>
</Form.Root>
