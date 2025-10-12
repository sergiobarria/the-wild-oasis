<script lang="ts">
	import { SendIcon } from '@lucide/svelte';
	import { createForm } from '@tanstack/svelte-form';

	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldLabel, FieldSet } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';

	import { ContactSchema } from './schema';

	let state = $state<'idle' | 'loading' | 'success' | 'error'>('idle');

	const form = createForm(() => ({
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			subject: '',
			message: ''
		},
		validators: {
			onChangeAsync: ContactSchema,
			onChangeAsyncDebounceMs: 750
		},
		onSubmit: async ({ value }) => {
			state = 'loading';
		}
	}));
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}}
	class="mx-auto mt-12 max-w-4xl"
>
	<FieldSet class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<form.Field name="name">
			{#snippet children(field)}
				{@const hasErrors = field.state.meta.errors?.length > 0}
				<Field data-invalid={hasErrors}>
					<FieldLabel for={field.name}>Tell us your name*</FieldLabel>
					<Input
						id={field.name}
						type="text"
						placeholder="John Doe"
						value={field.state.value}
						onblur={() => field.handleBlur()}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
						aria-invalid={hasErrors}
					/>
					{#if hasErrors}
						{#each field.state.meta.errors as error}
							<FieldError>{error?.message}</FieldError>
						{/each}
					{/if}
				</Field>
			{/snippet}
		</form.Field>

		<form.Field name="email">
			{#snippet children(field)}
				{@const hasErrors = field.state.meta.errors?.length > 0}
				<Field data-invalid={hasErrors}>
					<FieldLabel for={field.name}>Tell us your email address*</FieldLabel>
					<Input
						id={field.name}
						type="email"
						placeholder="iamawesome@email.com"
						value={field.state.value}
						onblur={() => field.handleBlur()}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
						aria-invalid={hasErrors}
					/>
					{#if hasErrors}
						{#each field.state.meta.errors as error}
							<FieldError>{error?.message}</FieldError>
						{/each}
					{/if}
				</Field>
			{/snippet}
		</form.Field>

		<form.Field name="subject">
			{#snippet children(field)}
				{@const hasErrors = field.state.meta.errors?.length > 0}
				<Field data-invalid={hasErrors}>
					<FieldLabel for={field.name}>Subject*</FieldLabel>
					<Input
						id={field.name}
						type="text"
						placeholder="Subject"
						value={field.state.value}
						onblur={() => field.handleBlur()}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
						aria-invalid={hasErrors}
					/>
					{#if hasErrors}
						{#each field.state.meta.errors as error}
							<FieldError>{error?.message}</FieldError>
						{/each}
					{/if}
				</Field>
			{/snippet}
		</form.Field>

		<form.Field name="phone">
			{#snippet children(field)}
				{@const hasErrors = field.state.meta.errors?.length > 0}
				<Field data-invalid={hasErrors}>
					<FieldLabel for={field.name}>Phone</FieldLabel>
					<Input
						id={field.name}
						type="tel"
						placeholder="+1 234 567 890"
						value={field.state.value}
						onblur={() => field.handleBlur()}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
						aria-invalid={hasErrors}
					/>
					{#if hasErrors}
						{#each field.state.meta.errors as error}
							<FieldError>{error?.message}</FieldError>
						{/each}
					{/if}
				</Field>
			{/snippet}
		</form.Field>

		<form.Field name="message">
			{#snippet children(field)}
				{@const hasErrors = field.state.meta.errors?.length > 0}
				<Field data-invalid={hasErrors} class="col-span-2">
					<FieldLabel for={field.name}>Your message*</FieldLabel>
					<Textarea
						id={field.name}
						placeholder="Your message"
						rows={5}
						value={field.state.value}
						onblur={() => field.handleBlur()}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							field.handleChange(target.value);
						}}
						aria-invalid={hasErrors}
					/>
					{#if hasErrors}
						{#each field.state.meta.errors as error}
							<FieldError>{error?.message}</FieldError>
						{/each}
					{/if}
				</Field>
			{/snippet}
		</form.Field>
	</FieldSet>

	<form.Subscribe
		selector={(state) => ({
			canSubmit: state.canSubmit,
			isSubmitting: state.isSubmitting
		})}
	>
		{#snippet children({ canSubmit, isSubmitting })}
			<Button type="submit" disabled={!canSubmit} class="mt-6">
				{#if isSubmitting}
					<Spinner />
				{:else}
					<SendIcon />
				{/if}
				{isSubmitting ? 'Sending...' : 'Send message'}
			</Button>
		{/snippet}
	</form.Subscribe>
</form>
