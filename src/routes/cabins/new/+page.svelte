<script lang="ts">
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { ArrowLeftIcon } from 'lucide-svelte'
	import type { FormOptions } from 'formsnap'
	import toast from 'svelte-french-toast'

	import Button from '$lib/components/ui/button/button.svelte'
	import { newCabinSchema, type NewCabinSchema } from '$lib/schemas/cabin-schemas'
	import CabinForm from '$lib/components/cabin-form.svelte'

	export let data: PageData
	let submitting = false

	const options: FormOptions<NewCabinSchema> = {
		validators: newCabinSchema,
		onSubmit: () => {
			submitting = true
		},
		onError: ({ result }) => {
			if (result.type === 'error') {
				console.error(result.error)
				toast.error(result.error.message, { duration: 2000 })
			}
		}
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

<CabinForm form={data.form} {options} {submitting} />
