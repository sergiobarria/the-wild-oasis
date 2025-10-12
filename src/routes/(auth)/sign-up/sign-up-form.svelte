<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { EyeIcon, EyeOffIcon } from '@lucide/svelte';
	import { createForm, formOptions } from '@tanstack/svelte-form';

	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '$lib/components/ui/field';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput
	} from '$lib/components/ui/input-group';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	import { RegisterSchema } from './schema';

	let showPassword = $state<boolean>(false);
	let showPasswordConfirmation = $state<boolean>(false);
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');

	const form = createForm(() => ({
		defaultValues: {
			email: '',
			password: '',
			passwordConfirmation: ''
		},
		validators: {
			onChangeAsync: RegisterSchema,
			onChangeAsyncDebounceMs: 500
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: '',
					callbackURL: '/'
				},
				{
					onRequest: () => {
						status = 'loading';
					},
					onSuccess: () => {
						status = 'success';
						toast.success('Account created successfully');
						goto('/');
					},
					onError: () => {
						status = 'error';
						toast.error('Something went wrong');
					}
				}
			);
		}
	}));
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();

		form.handleSubmit();
	}}
	class="space-y-6"
>
	<FieldSet>
		<FieldGroup class="gap-3">
			<form.Field name="email">
				{#snippet children(field)}
					{@const hasErrors = field.state.meta.errors?.length > 0}
					<Field data-invalid={hasErrors}>
						<FieldLabel for={field.name}>Tell us your email address</FieldLabel>
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

			<form.Field name="password">
				{#snippet children(field)}
					{@const hasErrors = field.state.meta.errors?.length > 0}
					<Field data-invalid={hasErrors}>
						<FieldLabel for={field.name}>Choose a secure password</FieldLabel>
						<InputGroup>
							<InputGroupInput
								type={showPassword ? 'text' : 'password'}
								placeholder="*********"
								value={field.state.value}
								onblur={() => field.handleBlur()}
								oninput={(e: Event) => {
									const target = e.target as HTMLInputElement;
									field.handleChange(target.value);
								}}
								aria-invalid={hasErrors}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									aria-label="Show password"
									title="show password"
									size="icon-xs"
									tabindex={-1}
									onclick={() => (showPassword = !showPassword)}
								>
									{#if showPassword}
										<EyeOffIcon />
									{:else}
										<EyeIcon />
									{/if}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						{#if hasErrors}
							{#each field.state.meta.errors as error}
								<FieldError>{error?.message}</FieldError>
							{/each}
						{/if}
					</Field>
				{/snippet}
			</form.Field>

			<form.Field name="passwordConfirmation">
				{#snippet children(field)}
					{@const hasErrors = field.state.meta.errors?.length > 0}
					<Field data-invalid={hasErrors}>
						<FieldLabel for={field.name}>Confirm your password</FieldLabel>
						<InputGroup>
							<InputGroupInput
								type={showPasswordConfirmation ? 'text' : 'password'}
								placeholder="*********"
								value={field.state.value}
								onblur={() => field.handleBlur()}
								oninput={(e: Event) => {
									const target = e.target as HTMLInputElement;
									field.handleChange(target.value);
								}}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									aria-label="Show password"
									title="show password"
									size="icon-xs"
									tabindex={-1}
									onclick={() => (showPasswordConfirmation = !showPasswordConfirmation)}
								>
									{#if showPasswordConfirmation}
										<EyeOffIcon />
									{:else}
										<EyeIcon />
									{/if}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						{#if hasErrors}
							{#each field.state.meta.errors as error}
								<FieldError>{error?.message}</FieldError>
							{/each}
						{/if}
					</Field>
				{/snippet}
			</form.Field>
		</FieldGroup>
	</FieldSet>

	<form.Subscribe
		selector={(state) => ({
			canSubmit: state.canSubmit,
			isSubmitting: state.isSubmitting
		})}
	>
		{#snippet children({ canSubmit, isSubmitting })}
			<Button type="submit" disabled={!canSubmit} class="w-full">
				{#if isSubmitting}
					<Spinner />
				{/if}
				{isSubmitting ? 'Signing up...' : 'Sign Up'}
			</Button>
		{/snippet}
	</form.Subscribe>
</form>
