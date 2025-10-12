<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { EyeIcon, EyeOffIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { signUp } from '$lib/api/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput
	} from '$lib/components/ui/input-group';
	import { Spinner } from '$lib/components/ui/spinner';
	import { SignUpSchema } from '$lib/schemas/auth';

	let showPassword = $state<boolean>(false);
	let showPasswordConfirmation = $state<boolean>(false);
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
</script>

<form
	{...signUp.preflight(SignUpSchema).enhance(async ({ data, form, submit }) => {
		try {
			status = 'loading';
			await submit();
			form.reset();

			if (signUp.result?.success) {
				goto('/');
				toast.success('Account created successfully');
			}
		} catch (err: unknown) {
			toast.error('Something went wrong');
		} finally {
			status = 'idle';
		}
	})}
	class="space-y-6"
>
	<FieldSet>
		<FieldGroup class="gap-3">
			{@const emailIssues = signUp.fields.email.issues() ?? []}
			<Field data-invalid={emailIssues.length > 0}>
				<FieldLabel for="email">Tell us your email address</FieldLabel>
				<Input
					placeholder="iamawesome@email.com"
					{...signUp.fields.email.as('email')}
					aria-invalid={emailIssues.length > 0}
				/>
				{#each emailIssues as issue}
					<FieldError>{issue.message}</FieldError>
				{/each}
			</Field>

			{@const passwordIssues = signUp.fields.password.issues() ?? []}
			<Field data-invalid={passwordIssues.length > 0}>
				<FieldLabel for="password">Choose a secure password</FieldLabel>
				<InputGroup>
					<InputGroupInput
						placeholder="*********"
						{...signUp.fields.password.as(showPassword ? 'text' : 'password')}
						aria-invalid={passwordIssues.length > 0}
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
				{#each passwordIssues as issue}
					<FieldError>{issue.message}</FieldError>
				{/each}
			</Field>

			{@const passwordConfirmationIssues = signUp.fields.passwordConfirmation.issues() ?? []}
			<Field data-invalid={passwordConfirmationIssues.length > 0}>
				<FieldLabel for="passwordConfirmation">Confirm your password</FieldLabel>
				<InputGroup>
					<InputGroupInput
						placeholder="*********"
						{...signUp.fields.passwordConfirmation.as(
							showPasswordConfirmation ? 'text' : 'password'
						)}
						aria-invalid={passwordConfirmationIssues.length > 0}
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
				{#each passwordConfirmationIssues as issue}
					<FieldError>{issue.message}</FieldError>
				{/each}
			</Field>
		</FieldGroup>
	</FieldSet>

	<Button type="submit" disabled={status === 'loading'} class="w-full">
		{#if status === 'loading'}
			<Spinner />
		{/if}
		{status === 'loading' ? 'Signing up...' : 'Sign Up'}
	</Button>
</form>
