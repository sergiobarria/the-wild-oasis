<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { Textarea } from '$lib/components/ui/textarea'
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { SaveIcon } from 'lucide-svelte'

	// import { newCabinSchema, type NewCabinSchema } from '$lib/schemas'
	import { insertCabinSchema, type InsertCabinSchema } from '$lib/schemas'

	export let data: SuperValidated<Infer<InsertCabinSchema>>

	const form = superForm(data, {
		validators: zodClient(insertCabinSchema)
	})
	const { form: formData, enhance } = form
</script>

<SuperDebug data={$formData} />

<form method="POST" use:enhance class="max-w-lg space-y-4">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Cabin Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} placeholder="001" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="maxCapacity">
		<Form.Control let:attrs>
			<Form.Label>Maximum Capacity</Form.Label>
			<Input {...attrs} bind:value={$formData.maxCapacity} placeholder="10" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="regularPrice">
		<Form.Control let:attrs>
			<Form.Label>Price</Form.Label>
			<Input {...attrs} bind:value={$formData.regularPrice} placeholder="100" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="discountPrice">
		<Form.Control let:attrs>
			<Form.Label>Discount Price</Form.Label>
			<Input {...attrs} bind:value={$formData.discountPrice} placeholder="10" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Cabin Description</Form.Label>
			<Textarea
				{...attrs}
				bind:value={$formData.description}
				rows={5}
				placeholder="A cozy cabin in the woods."
			/>
		</Form.Control>
	</Form.Field>

	<Form.Button class="gap-2">
		<SaveIcon class="size-5" />
		Save Cabin
	</Form.Button>
</form>
