<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CircleAlertIcon, EyeIcon, EyeOffIcon, FileWarningIcon } from '@lucide/svelte';
	import { createForm, formOptions } from '@tanstack/svelte-form';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
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

	import { SignInSchema } from './schema';

	let showPassword = $state<boolean>(false);
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state<string | null>(null);

	const form = createForm(() => ({
		defaultValues: {
			email: '',
			password: ''
		},
		validators: {
			onChangeAsync: SignInSchema,
			onChangeAsyncDebounceMs: 750
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password
				},
				{
					onRequest: () => {
						status = 'loading';
					},
					onSuccess: () => {
						status = 'success';
						toast.success('Signed in successfully');

						const redirect = page.url.searchParams.get('intended') ?? '/';
						goto(redirect);
					},
					onError: ({ error }) => {
						console.log('🚀 ~ err:', error);

						status = 'error';
						errorMessage = error.message;
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
		</FieldGroup>
	</FieldSet>

	{#if errorMessage}
		<div class="rounded-lg border border-destructive bg-destructive/10 p-2">
			<div class="flex items-start gap-3">
				<div class="rounded-full bg-destructive/15 p-1.5">
					<CircleAlertIcon class="size-4 text-destructive" />
				</div>
				<div class="flex-1 space-y-1 text-sm">
					<h3 class="font-semibold text-destructive">Oops! Something went wrong</h3>
					<p class="text-destructive/90">{errorMessage}</p>
				</div>
			</div>
		</div>
	{/if}

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
				{isSubmitting ? 'Signing in...' : 'Sign In'}
			</Button>
		{/snippet}
	</form.Subscribe>
</form>
