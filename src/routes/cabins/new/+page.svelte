<script lang="ts">
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { ArrowLeftIcon, CheckIcon } from 'lucide-svelte'
	import type { FormOptions } from 'formsnap'

	import Button from '$lib/components/ui/button/button.svelte'

	import * as Form from '$lib/components/ui/form'
	import { newCabinSchema, type NewCabinSchema } from '$lib/schemas/new-cabin-schema'
	import { cn } from '$lib/utils'
	import toast from 'svelte-french-toast'

	const MAX_CHARS = 1000
	export let data: PageData
	let charsLeft = MAX_CHARS

	$: descriptionLength = MAX_CHARS - charsLeft

	const options: FormOptions<NewCabinSchema> = {
		validators: newCabinSchema,
		onError: ({ result }) => {
			if (result.type === 'error') {
				console.error(result.error)
				toast.error(result.error.message, { duration: 2000 })
			}
		}
	}

	function getCharsLeft(e: InputEvent) {
		const target = e.target as HTMLTextAreaElement
		charsLeft = MAX_CHARS - target.value.length
	}
</script>

<svelte:head>
	<title>Cabins | The Wild Oasis</title>
</svelte:head>

<div class="mb-6 flex items-center gap-3">
	<Button variant="outline" size="icon" on:click={() => goto('/cabins')}>
		<ArrowLeftIcon class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-semibold">New Cabin</h1>
</div>

<!-- <AddNewCabinForm form={data.form} /> -->
<Form.Root
	method="POST"
	{options}
	form={data.form}
	schema={newCabinSchema}
	let:config
	class="max-w-lg space-y-5"
>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Cabin Name</Form.Label>
			<Form.Input placeholder="001" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="maxCapacity">
		<Form.Item>
			<Form.Label>Maximum Capacity</Form.Label>
			<Form.Input type="number" placeholder="2" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="price">
		<Form.Item>
			<Form.Label>Price</Form.Label>
			<Form.Input type="number" placeholder="100.00" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="priceDiscount">
		<Form.Item>
			<Form.Label>Price Discount</Form.Label>
			<Form.Input type="number" placeholder="0.00" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description*</Form.Label>
			<Form.Textarea rows={5} on:input={getCharsLeft} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<div class="flex justify-between">
		<small class={cn('text-xs', descriptionLength >= 10 ? 'text-green-500' : 'text-gray-500')}>
			{#if descriptionLength >= 10}
				<CheckIcon class="mr-1 inline-block h-4 w-4" />
			{/if}
			Minimum of 10 characters
		</small>
		<small class="text-xs text-gray-500">
			{charsLeft} characters left
		</small>
	</div>

	<Form.Button>Save</Form.Button>
</Form.Root>
